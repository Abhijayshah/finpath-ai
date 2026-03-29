import type { Message } from '../../../shared/types'

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-etOrange text-black'
            : 'border border-[#222222] bg-[#111111] text-white',
        ].join(' ')}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={[
            'mt-2 text-[11px] opacity-70',
            isUser ? 'text-black/70' : 'text-[#888888]',
          ].join(' ')}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}
