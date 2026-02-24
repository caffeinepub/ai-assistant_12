import { useEffect, useRef } from 'react';
import { Trash2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { useChat } from '../hooks/useChat';

export function ChatInterface() {
    const { messages, isLoadingHistory, isTyping, sendMessage, clearConversation } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    return (
        <div className="flex flex-col h-screen bg-background grid-bg">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/90 backdrop-blur-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-neon-green/50 shadow-neon-green-sm animate-pulse-glow">
                            <img
                                src="/assets/generated/ai-avatar.dim_128x128.png"
                                alt="AI Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-background" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold text-foreground tracking-wide">
                            AI Assistant
                        </h1>
                        <p className="text-xs text-neon-green font-mono flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Online
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearConversation}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-2 text-xs font-mono transition-colors"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                </Button>
            </header>

            {/* Messages */}
            <ScrollArea className="flex-1 px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {isLoadingHistory && (
                        <div className="flex justify-center py-8">
                            <div className="flex gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-neon-green/60 animate-typing-dot" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-neon-green/60 animate-typing-dot" style={{ animationDelay: '200ms' }} />
                                <span className="w-2 h-2 rounded-full bg-neon-green/60 animate-typing-dot" style={{ animationDelay: '400ms' }} />
                            </div>
                        </div>
                    )}

                    {!isLoadingHistory && messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-neon-green/30 shadow-neon-green opacity-80">
                                <img
                                    src="/assets/generated/ai-avatar.dim_128x128.png"
                                    alt="AI"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground mb-1">
                                    Hello! I'm your AI Assistant
                                </h2>
                                <p className="text-sm text-muted-foreground max-w-xs">
                                    Ask me anything — I'm here to help. Type a message below to get started.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                {['Tell me a joke', 'What can you do?', 'How are you?'].map((prompt) => (
                                    <button
                                        key={prompt}
                                        onClick={() => sendMessage(prompt)}
                                        className="px-3 py-1.5 text-xs rounded-full border border-neon-green/30 text-neon-green hover:bg-neon-green/10 hover:border-neon-green/60 transition-all duration-200 font-mono"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((message, index) => (
                        <MessageBubble key={`${message.role}-${index}`} message={message} index={index} />
                    ))}

                    {isTyping && <TypingIndicator />}

                    <div ref={bottomRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <div className="max-w-2xl mx-auto w-full">
                <ChatInput onSend={sendMessage} disabled={isTyping} />
            </div>

            {/* Footer */}
            <footer className="text-center py-2 text-xs text-muted-foreground font-mono border-t border-border/50">
                © {new Date().getFullYear()} &nbsp;
                Built with{' '}
                <span className="text-neon-green">♥</span>{' '}
                using{' '}
                <a
                    href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'ai-assistant')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-green transition-colors underline underline-offset-2"
                >
                    caffeine.ai
                </a>
            </footer>
        </div>
    );
}
