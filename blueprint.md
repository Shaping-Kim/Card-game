# Memory Card Game

## Overview

This project is a classic memory card game where the player flips cards to find matching pairs.

## Design and Features

### Visual Design
*   **Theme:** "Cosmic Glass" - A modern, dark-themed aesthetic with glassmorphism effects.
*   **Colors:** Deep blue/purple gradients for the background, semi-transparent white for glass elements, and neon accents (pink/cyan).
*   **Typography:** 'Poppins', sans-serif for a clean, geometric look.
*   **Layout:** Centered, responsive grid.
*   **Visual Effects:**
    *   Glassmorphism (backdrop-filter: blur) for the game board and cards.
    *   Soft glowing shadows.
    *   Smooth transitions and hover effects.

### Gameplay Features
*   **Card Content:** High-quality matching emojis instead of letters.
*   **Feedback:** Visual cues for matches and mismatches.
*   **Win State:** A celebratory overlay or modal when the game is won.
*   **Responsive:** Grid adjusts columns based on screen width.

## Current Plan

*   **Task:** Create a card matching game.
*   **Steps:**
    1.  **`index.html`:** Set up the basic HTML structure for the game board, score panel, and controls.
    2.  **`style.css`:** Style the game board, cards, and other UI elements. Implement card flip animations.
    3.  **`main.js`:**
        *   Create a web component for the game (`<card-game>`).
        *   Define the set of cards (e.g., using symbols or images).
        *   Implement the game logic: shuffling cards, handling flips, checking for matches, and tracking game state (moves, time).
        *   Add a restart functionality.
