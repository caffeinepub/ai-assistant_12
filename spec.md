# Specification

## Summary
**Goal:** Enable the AI in GameChat to generate and render playable 2D video games of any genre from user prompts, beyond the previously hardcoded set of six games.

**Planned changes:**
- Update backend AI logic to detect a wide range of game-creation intents (platformers, shooters, puzzle games, racing games, RPGs, etc.) and return a fully self-contained HTML/CSS/JS game payload along with a text response describing how to play
- Update the GameRenderer component to render any valid self-contained HTML game payload from the backend, not just the six hardcoded game types, with graceful error handling for malformed payloads
- Update the empty-state prompt suggestions in ChatInterface to show at least 4 varied game-building examples covering different genres (e.g., "Make me a platformer game", "Create a space shooter", "Build a tower defense game", "Make a puzzle game")

**User-visible outcome:** Users can type any game creation request into the chat (e.g., "make me a platformer", "create a space shooter") and receive a fully playable 2D game rendered directly in the chat interface, with expanded prompt suggestions guiding them to try different genres.
