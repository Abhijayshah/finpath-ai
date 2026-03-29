import type { Message } from '../../../shared/types'

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow',
          isUser
            ? 'bg-etOrange text-black'
            : 'bg-white/5 text-slate-100 ring-1 ring-white/10',
        ].join(' ')}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        <div
          className={[
            'mt-2 text-[11px] opacity-70',
            isUser ? 'text-black/70' : 'text-slate-400',
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
