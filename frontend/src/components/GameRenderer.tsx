import { useState } from 'react';
import { Gamepad2, AlertTriangle, Maximize2, Minimize2 } from 'lucide-react';

interface GameRendererProps {
    gamePayload: string;
}

function extractGameHTML(gamePayload: string): string | null {
    if (!gamePayload || gamePayload.trim() === '') return null;

    // Try to parse as JSON and extract a payload field (legacy format)
    try {
        const parsed = JSON.parse(gamePayload);
        if (parsed && typeof parsed.payload === 'string' && parsed.payload.trim() !== '') {
            const html = parsed.payload;
            // If the payload looks like HTML, return it directly
            if (html.includes('<html') || html.includes('<!DOCTYPE') || html.includes('<canvas') || html.includes('<script')) {
                return html;
            }
        }
    } catch {
        // Not JSON — fall through
    }

    // If the payload itself looks like raw HTML, use it directly
    const trimmed = gamePayload.trim();
    if (
        trimmed.startsWith('<!DOCTYPE') ||
        trimmed.startsWith('<html') ||
        trimmed.includes('<canvas') ||
        trimmed.includes('<script')
    ) {
        return trimmed;
    }

    return null;
}

export function GameRenderer({ gamePayload }: GameRendererProps) {
    const [expanded, setExpanded] = useState(false);

    const gameHTML = extractGameHTML(gamePayload);

    if (!gameHTML) {
        return (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Game payload is invalid or empty.</span>
            </div>
        );
    }

    return (
        <div className={`mt-3 rounded-xl overflow-hidden border border-neon-green/30 bg-background/80 shadow-neon-green-sm transition-all duration-300 ${expanded ? 'fixed inset-4 z-50 flex flex-col' : 'relative'}`}>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-3 py-2 bg-background/90 border-b border-neon-green/20 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-neon-green text-xs font-mono">
                    <Gamepad2 className="w-4 h-4" />
                    <span className="tracking-wider uppercase">Playable Game</span>
                </div>
                <button
                    onClick={() => setExpanded((v) => !v)}
                    className="text-neon-green/70 hover:text-neon-green transition-colors p-1 rounded hover:bg-neon-green/10"
                    title={expanded ? 'Collapse' : 'Expand'}
                >
                    {expanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
            </div>

            {/* Game iframe */}
            <iframe
                srcDoc={gameHTML}
                sandbox="allow-scripts"
                className={`w-full border-0 bg-black ${expanded ? 'flex-1' : 'h-[380px]'}`}
                title="Playable Game"
                scrolling="no"
            />
        </div>
    );
}
