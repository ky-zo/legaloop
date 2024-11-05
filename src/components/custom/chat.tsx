'use client'

import { useState } from 'react'
import { Attachment, Message } from 'ai'
import { useChat } from 'ai/react'
import { AnimatePresence } from 'framer-motion'
import useSWR, { useSWRConfig } from 'swr'
import { useWindowSize } from 'usehooks-ts'

import { ChatHeader } from '@/components/custom/chat-header'
import { PreviewMessage } from '@/components/custom/message'
import { useScrollToBottom } from '@/components/custom/use-scroll-to-bottom'
import { Vote } from '@/db/schema'
import { fetcher } from '@/lib/utils'

import { Canvas, UICanvas } from './canvas'
import { CanvasStreamHandler } from './canvas-stream-handler'
import { MultimodalInput } from './multimodal-input'
import { Overview } from './overview'

export function Chat({ id, initialMessages, selectedModelId }: { id: string; initialMessages: Array<Message>; selectedModelId: string }) {
  const { mutate } = useSWRConfig()

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    data: streamingData,
  } = useChat({
    body: { id, modelId: selectedModelId },
    initialMessages,
    onFinish: () => {
      mutate('/api/history')
    },
  })

  const { width: windowWidth = 1920, height: windowHeight = 1080 } = useWindowSize()

  const [canvas, setCanvas] = useState<UICanvas>({
    documentId: 'init',
    content: '',
    title: '',
    status: 'idle',
    isVisible: false,
    boundingBox: {
      top: windowHeight / 4,
      left: windowWidth / 4,
      width: 250,
      height: 50,
    },
  })

  const { data: votes } = useSWR<Array<Vote>>(`/api/vote?chatId=${id}`, fetcher)

  const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>()

  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  return (
    <>
      <div className="flex h-dvh min-w-0 flex-col bg-background">
        <ChatHeader selectedModelId={selectedModelId} />
        <div
          ref={messagesContainerRef}
          className="flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4">
          {messages.length === 0 && <Overview />}

          {messages.map((message, index) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              message={message}
              canvas={canvas}
              setCanvas={setCanvas}
              isLoading={isLoading && messages.length - 1 === index}
              vote={votes ? votes.find((vote) => vote.messageId === message.id) : undefined}
            />
          ))}

          <div
            ref={messagesEndRef}
            className="min-h-[24px] min-w-[24px] shrink-0"
          />
        </div>
        <form className="mx-auto flex w-full gap-2 bg-background px-4 pb-4 md:max-w-3xl md:pb-6">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
          />
        </form>
      </div>

      <AnimatePresence>
        {canvas && canvas.isVisible && (
          <Canvas
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append}
            canvas={canvas}
            setCanvas={setCanvas}
            messages={messages}
            setMessages={setMessages}
            votes={votes}
          />
        )}
      </AnimatePresence>

      <CanvasStreamHandler
        streamingData={streamingData}
        setCanvas={setCanvas}
      />
    </>
  )
}