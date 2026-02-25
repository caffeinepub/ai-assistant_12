# Specification

## Summary
**Goal:** Enable the AI chat assistant to generate and render playable mini-games (e.g., Snake, Pong, Memory Match, Breakout) directly inside the chat window when the user requests a game.

**Planned changes:**
- Extend the backend chat actor to detect game-building requests and return a structured response with a `gamePayload` field containing a self-contained HTML/JS game alongside the normal text message.
- Update `ChatInterface` and `MessageBubble` frontend components to detect `gamePayload` responses and render the game in an embedded sandbox (iframe with srcdoc) inside the AI message bubble, with a visible game title/label.
- Add at least three gaming-themed prompt suggestion chips to the empty-state UI (e.g., "Build me a Snake game", "Create a Pong game", "Make a memory card game") styled with the existing neon-green gaming theme.

**User-visible outcome:** Users can type a request like "Build me a Snake game" in the chat and receive a fully playable mini-game embedded directly in the chat window, with keyboard/mouse controls working in-place. Game-building suggestions are visible on the empty chat screen to help users discover the feature.
