import type { Message } from '../backend';

interface MessageBubbleProps {
    message: Message;
    index: number;
}

function formatTime(timestamp: bigint): string {
    const ms = Number(timestamp / BigInt(1_000_000));
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function MessageBubble({ message, index }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    if (isUser) {
        return (
            <div
                className="flex items-end justify-end gap-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 30}ms` }}
            >
                <div className="flex flex-col items-end gap-1 max-w-[75%]">
                    <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-primary/20 border border-primary/30 text-foreground text-sm leading-relaxed">
                        {message.content}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono px-1">
                        {formatTime(message.timestamp)}
                    </span>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                    U
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex items-start gap-3 animate-fade-in-up"
            style={{ animationDelay: `${index * 30}ms` }}
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-neon-green/40 shadow-neon-green-sm">
                <img
                    src="/assets/generated/ai-avatar.dim_128x128.png"
                    alt="AI"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col items-start gap-1 max-w-[75%]">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-neon-green/20 shadow-neon-green-sm text-foreground text-sm leading-relaxed">
                    {message.content}
                </div>
                <span className="text-xs text-muted-foreground font-mono px-1">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}
