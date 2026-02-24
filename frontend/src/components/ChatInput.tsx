import { useState, useRef, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSend = () => {
        if (!value.trim() || disabled) return;
        onSend(value.trim());
        setValue('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = () => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    };

    return (
        <div className="flex items-end gap-3 p-4 border-t border-border bg-background/80 backdrop-blur-sm">
            <div className="flex-1 relative">
                <Textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onInput={handleInput}
                    placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                    disabled={disabled}
                    rows={1}
                    className="
                        resize-none min-h-[44px] max-h-40 py-3 pr-4
                        bg-card border-border text-foreground placeholder:text-muted-foreground
                        focus-visible:ring-1 focus-visible:ring-neon-green/60 focus-visible:border-neon-green/50
                        focus-visible:shadow-neon-green-sm
                        transition-all duration-200 font-sans text-sm
                        rounded-xl
                    "
                />
            </div>
            <Button
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                size="icon"
                className="
                    h-11 w-11 rounded-xl flex-shrink-0
                    bg-neon-green text-background
                    hover:bg-neon-green/90 hover:shadow-neon-green
                    disabled:opacity-40 disabled:cursor-not-allowed
                    transition-all duration-200
                    shadow-neon-green-sm
                "
            >
                <Send className="h-4 w-4" />
            </Button>
        </div>
    );
}
