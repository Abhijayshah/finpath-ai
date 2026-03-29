import type { Message } from '../../../shared/types'

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-etOrange text-white shadow-card'
            : 'bg-[#F3F4F6] text-textPrimary',
        ].join(' ')}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={[
            'mt-2 text-[11px] opacity-70',
            isUser ? 'text-white/80' : 'text-textSecondary',
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
