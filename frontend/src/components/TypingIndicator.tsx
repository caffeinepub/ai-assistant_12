export function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-neon-green/40 shadow-neon-green-sm">
                <img
                    src="/assets/generated/ai-avatar.dim_128x128.png"
                    alt="AI"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-card border border-neon-green/20 shadow-neon-green-sm">
                <span
                    className="w-2 h-2 rounded-full bg-neon-green animate-typing-dot"
                    style={{ animationDelay: '0ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-neon-green animate-typing-dot"
                    style={{ animationDelay: '200ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-neon-green animate-typing-dot"
                    style={{ animationDelay: '400ms' }}
                />
            </div>
        </div>
    );
}
