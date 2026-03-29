import type { Message } from '../../../shared/types'

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={['flex gap-3', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      {isUser ? null : (
        <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-etOrange text-xs font-bold text-white shadow-sm">
          FP
        </div>
      )}
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
          isUser
            ? 'rounded-tr-sm bg-etOrange text-white'
            : 'rounded-tl-sm bg-white text-textPrimary dark:bg-gray-800 dark:text-white',
        ].join(' ')}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={[
            'mt-2 text-[11px] opacity-70',
            isUser ? 'text-white/80' : 'text-textSecondary dark:text-gray-400',
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
