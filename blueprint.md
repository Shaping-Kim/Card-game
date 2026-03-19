# Memory Card Game

## Overview

This project is a classic memory card game where the player flips cards to find matching pairs.

## Design and Features

### Visual Design
*   **Theme:** A clean and modern design with a playful feel.
*   **Colors:** A vibrant color palette will be used for the cards and background.
*   **Typography:** Clear and readable fonts for game status and scores.
*   **Layout:** A responsive grid layout for the card board that adapts to different screen sizes.
*   **Animations:** Smooth card flip animations.

### Gameplay Features
*   A deck of cards with matching pairs of images or symbols.
*   Cards are shuffled and laid out face down.
*   Players flip two cards at a time.
*   If the cards match, they remain face up.
*   If they don't match, they are flipped back down.
*   A "moves" counter to track the number of attempts.
*   A timer to track the game duration.
*   A restart button to start a new game.

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
