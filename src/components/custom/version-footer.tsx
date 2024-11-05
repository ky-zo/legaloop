'use client'

import { useState } from 'react'
import { isAfter } from 'date-fns'
import { motion } from 'framer-motion'
import { useSWRConfig } from 'swr'
import { useWindowSize } from 'usehooks-ts'

import { Document } from '@/db/schema'
import { getDocumentTimestampByIndex } from '@/lib/utils'

import { Button } from '../ui/button'
import { UICanvas } from './canvas'
import { LoaderIcon } from './icons'

interface VersionFooterProps {
  canvas: UICanvas
  handleVersionChange: (type: 'next' | 'prev' | 'toggle' | 'latest') => void
  documents: Array<Document> | undefined
  currentVersionIndex: number
}

export const VersionFooter = ({ canvas, handleVersionChange, documents, currentVersionIndex }: VersionFooterProps) => {
  const { width } = useWindowSize()
  const isMobile = width < 768

  const { mutate } = useSWRConfig()
  const [isMutating, setIsMutating] = useState(false)

  if (!documents) return

  return (
    <motion.div
      className="absolute bottom-0 z-50 flex w-full flex-col justify-between gap-4 border-t bg-background p-4 lg:flex-row"
      initial={{ y: isMobile ? 200 : 77 }}
      animate={{ y: 0 }}
      exit={{ y: isMobile ? 200 : 77 }}
      transition={{ type: 'spring', stiffness: 140, damping: 20 }}>
      <div>
        <div>You are viewing a previous version</div>
        <div className="text-sm text-muted-foreground">Restore this version to make edits</div>
      </div>

      <div className="flex flex-row gap-4">
        <Button
          disabled={isMutating}
          onClick={async () => {
            setIsMutating(true)

            mutate(
              `/api/document?id=${canvas.documentId}`,
              await fetch(`/api/document?id=${canvas.documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                  timestamp: getDocumentTimestampByIndex(documents, currentVersionIndex),
                }),
              }),
              {
                optimisticData: documents
                  ? [
                      ...documents.filter((document) =>
                        isAfter(new Date(document.createdAt), new Date(getDocumentTimestampByIndex(documents, currentVersionIndex)))
                      ),
                    ]
                  : [],
              }
            )
          }}>
          <div>Restore this version</div>
          {isMutating && (
            <div className="animate-spin">
              <LoaderIcon />
            </div>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            handleVersionChange('latest')
          }}>
          Back to latest version
        </Button>
      </div>
    </motion.div>
  )
}