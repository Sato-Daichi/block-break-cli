# block-break-cli

[![npm version](https://badge.fury.io/js/block-break-cli.svg)](https://www.npmjs.com/package/block-break-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D14.0.0-green.svg)](https://nodejs.org/)

> A classic breakout game that runs in your terminal

```
┌──────────────────────────────────────────────────────────────┐
│  ######  ######  ######  ######  ######  ######  ######      │
│  ######  ######  ######  ######  ######  ######  ######      │
│  ######  ######  ######  ######  ######  ######  ######      │
│                                                              │
│                           O                                  │
│                                                              │
│                                                              │
│                        ==========                            │
└──────────────────────────────────────────────────────────────┘
 Score: 120  |  Lives: ♥♥♥  |  Level: 1  |  High Score: 450
```

## Features

- **Classic Gameplay** - The nostalgic breakout experience, right in your terminal
- **10 Levels** - Progressive difficulty with increasing block rows
- **Colorful Blocks** - 6 vibrant colors: red, yellow, green, cyan, blue, magenta
- **Score System** - Earn more points for blocks at the top
- **Lives System** - Start with 3 lives, don't let the ball fall!
- **High Score** - Your best scores are saved locally
- **Responsive Controls** - Smooth paddle movement with arrow keys

## Installation

```bash
npm install -g block-break-cli
```

## Usage

```bash
block-break
```

## Controls

| Key | Action |
|-----|--------|
| `←` `→` | Move paddle |
| `a` `d` | Move paddle (alternative) |
| `Space` | Launch ball / Pause game |
| `q` | Quit game |

## Menu Options

- **Start Game** - Begin a new game
- **High Scores** - View the top 10 scores
- **Quit** - Exit the application

## Gameplay

1. Launch the game with `block-break`
2. Select "Start Game" from the menu
3. Press `Space` to launch the ball
4. Move the paddle to bounce the ball and destroy blocks
5. Clear all blocks to advance to the next level
6. Don't let the ball fall below the paddle!

## Tech Stack

- **TypeScript** - Type-safe development
- **Blessed** - Terminal UI rendering
- **Conf** - Persistent high score storage

## Development

```bash
# Clone the repository
git clone https://github.com/Sato-Daichi/block-break-cli.git
cd block-break-cli

# Install dependencies
npm install

# Build
npm run build

# Link for local testing
npm link

# Run the game
block-break
```

## Project Structure

```
block-break-cli/
├── src/
│   ├── index.ts          # Application entry point
│   ├── game/
│   │   ├── Game.ts       # Main game loop & logic
│   │   ├── Paddle.ts     # Paddle control
│   │   ├── Ball.ts       # Ball physics
│   │   ├── Block.ts      # Block management
│   │   └── Level.ts      # Level progression
│   ├── ui/
│   │   ├── Screen.ts     # Game rendering
│   │   ├── Menu.ts       # Main menu
│   │   └── ScoreBoard.ts # High score display
│   └── utils/
│       ├── Config.ts     # Game configuration
│       └── HighScore.ts  # Score persistence
├── bin/
│   └── cli.js            # CLI entry point
└── dist/                 # Compiled JavaScript
```

## Requirements

- Node.js >= 14.0.0
- A terminal that supports colors and Unicode

## License

MIT

---

Made with ♥ in the terminal
