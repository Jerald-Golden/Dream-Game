# 🎮 Dream Game

A multiplayer social deduction game built with React, TypeScript, and Socket.io. Experience real-time gameplay with stunning 3D graphics powered by Three.js and React Three Fiber. (Yes, it's as cool as it sounds!)

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![React](https://img.shields.io/badge/React-18.x-blue) ![Node](https://img.shields.io/badge/Node-%3E%3D20.x-green) ![Caffeine](https://img.shields.io/badge/Powered%20by-Coffee-brown)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Electron.js Desktop Application](#electronjs-desktop-application)
- [Environment Variables](#environment-variables)
- [Roadmap & Planned Features](#roadmap--planned-features)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎯 **Real-time Multiplayer** - Powered by Socket.io for seamless multiplayer experience (lag optional, based on your WiFi)
- 🎨 **3D Graphics** - Immersive gameplay with Three.js and React Three Fiber (fancy words for "it looks pretty")
- 🔐 **Authentication System** - Secure user authentication (no password = no entry, sorry hackers)
- 🏠 **Lobby System** - Create, join, and manage game lobbies (like a virtual waiting room, but fun)
- 💬 **Real-time Chat** - In-lobby chat functionality (trash talk responsibly)
- 🎮 **Multiple Games** - Support for various game types (currently just one, but I'm optimistic!)
- 📱 **Responsive Design** - Works across different screen sizes (yes, even on your ancient tablet)
- ⚡ **Fast Development** - Built with Vite for lightning-fast HMR (Hot Module Replacement, not some new sandwich)
- 🖥️ **Desktop Application** - Native desktop app built with Electron (because browsers are so 2020)
- 📦 **Cross-Platform** - Available as web app or native desktop application for Windows, macOS, and Linux (I don't discriminate against operating systems)

## 🛠️ Tech Stack

### Client (`Dream-Game`)

- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 7.3
- **Desktop Framework**: Electron.js (Electron Vite integration)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Physics**: React Three Rapier
- **Routing**: React Router DOM 7.11
- **State Management**: Zustand, React Context API
- **Real-time Communication**: Socket.io Client
- **Styling**: Tailwind CSS (via utilities), Custom CSS
- **UI Components**: Radix UI, Lucide React

### Server (`Dream-Server`)

- **Runtime**: Node.js (>=20.x)
- **Language**: TypeScript
- **Framework**: Express.js
- **Real-time**: Socket.io 4.8
- **Development**: tsx (TypeScript executor)

## 📁 Project Structure

```
Dream-Game/
├── Dream-Game/              # Client application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── assets/          # Game assets (models, textures, styles)
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── loading/     # Loading screens
│   │   │   ├── pages/       # Page components
│   │   │   └── ui/          # UI components
│   │   ├── contexts/        # React contexts
│   │   ├── core/            # Core game logic
│   │   ├── features/        # Game features
│   │   │   └── games/       # Individual game implementations
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── electron/            # Electron main process files
│   │   ├── main.ts          # Electron main process entry
│   │   └── preload.ts       # Preload script
│   ├── build/               # Build resources
│   │   └── icons/           # Application icons for desktop
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts       # Web app Vite config
│   └── electron.vite.config.ts  # Electron Vite config
│
├── Dream-Server/            # Server application
│   ├── src/
│   │   ├── index.ts         # Main server file
│   │   ├── lobbies.ts       # Lobby management
│   │   └── rooms.ts         # Room management
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── .gitattributes
├── LICENSE
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Before you dive in, make sure you have:

- Node.js (>= 20.x) - _The latest and greatest, not that dusty v14 you installed in 2021_
- npm or yarn - _Pick your poison_
- Git - _For pretending you know how to use version control_
- A sense of adventure - _Things might break, but that's half the fun!_

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Jerald-Golden/Dream-Game.git
   cd Dream-Game
   ```

2. **Install Client Dependencies**

   ```bash
   cd Dream-Game
   npm install
   ```

3. **Install Server Dependencies**

   ```bash
   cd ../Dream-Server
   npm install
   ```

4. **Set up Environment Variables**

   Copy the `.env.example` files and configure them:

   ```bash
   # In Dream-Game directory
   cp .env.example .env

   # In Dream-Server directory
   cd ../Dream-Server
   cp .env.example .env
   ```

   Edit the `.env` files with your configuration.

5. **Start the Development Servers**

   Time to fire up this bad boy! You'll need TWO terminals (I know, multitasking is hard).

   **Terminal 1 - Start the Server:**

   ```bash
   cd Dream-Server
   npm start
   ```

   **Terminal 2 - Start the Client:**

   ```bash
   cd Dream-Game
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000` and pray everything works! 🤞

## 💻 Development

### Client Development

#### Web Application

```bash
cd Dream-Game

# Start web development server (browser-based)
npm run dev

# Build web app for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format
```

#### Desktop Application (Electron)

```bash
cd Dream-Game

# Start Electron app in development mode
npm run electron:dev

# Build Electron app for current platform
npm run electron:build

# Build for Windows
npm run electron:build:win

# Build for macOS
npm run electron:build:mac

# Build for Linux
npm run electron:build:linux

# Preview Electron production build
npm run electron:preview
```

**Note**: The project supports both web and desktop modes. Use `npm run dev` for web development (boring old browser) and `npm run electron:dev` for desktop application development (fancy native app). Choose your fighter! ⚔️

### Server Development

```bash
cd Dream-Server

# Start development server with watch mode
npm start

# Build TypeScript
npm run build

# Format code
npm run format
```

## �️ Electron.js Desktop Application

The Dream Game client has been built as a hybrid application using **Electron Vite**, supporting both web browser and native desktop platforms.

### Architecture

The application uses a unified codebase that can run in two modes:

1. **Web Mode** (`npm run dev`) - Runs in browser with Vite dev server
2. **Desktop Mode** (`npm run electron:dev`) - Runs as native Electron application

### Key Features

- **Native Desktop Experience** - Full native window controls and OS integration
- **Offline Capable** - Desktop app can work with cached resources
- **Enhanced Performance** - Direct access to system resources
- **Auto-Updates** - Built-in support for application updates (when configured)
- **Custom Icons** - Platform-specific application icons in `build/icons/`

### Electron Structure

```
electron/
├── main.ts       # Main process (Node.js environment)
└── preload.ts    # Preload script (bridge between main and renderer)
```

- **Main Process**: Manages application lifecycle, windows, and system integration
- **Renderer Process**: The React application running in Chromium
- **Preload Script**: Securely exposes APIs from main to renderer process

### Build Output

When you build the Electron app, it creates platform-specific installers:

- **Windows**: `.exe` installer and portable executable
- **macOS**: `.dmg` disk image and `.app` bundle
- **Linux**: `.AppImage`, `.deb`, or `.rpm` packages

Build artifacts are located in `Dream-Game/dist-electron/` and `Dream-Game/out/`.

### Configuration

- `electron.vite.config.ts` - Electron-specific Vite configuration
- `package.json` - Contains `build` section for electron-builder settings
- `build/icons/` - Application icons for different platforms

## �🔐 Environment Variables

### Client (`Dream-Game/.env`)

```env
VITE_DREAMSERVER_URL=https://dream-game.onrender.com
```

### Server (`Dream-Server/.env`)

```env
PORT=2567
NODE_ENV=production
ALLOWED_ORIGINS=https://dream-games.netlify.app
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

See `.env.example` files in each directory for complete configuration options.

## 🗺️ Roadmap & Planned Features

Here's what's cooking in the Dream Game kitchen (send help):

### 🎯 High Priority

- **Visual Map Builder Tool** 🛠️

  - Create a new project that spits out R3F `.tsx` files for maps
  - Why? Because I don't know and **don't wanna know** how to use Blender
  - Life's too short for 3D modeling software with 47 keyboard shortcuts
  - Just drag, drop, and pray it works

- **Game Overhaul: "The Floor is Lava"** 🔥

  - Yeeting the entire "Among Us" clone out the window
  - Replacing it with something way cooler: **The Floor is Lava**
  - Because who doesn't love pretending the floor is lava?
  - Nostalgia meets 3D gaming chaos

- **Stick Figure Character** 🏃
  - Creating a character that looks like a stick man
  - Simple, elegant, definitely not because I can't model realistic humans
  - It's a _design choice_, okay?
  - Plus they're adorable

### � The REAL Challenge

- **Stay Focused** 🎯
  - DO NOT GET DISTRACTED while doing the above things
  - No "just one more feature" energy
  - No opening 17 YouTube tutorials at once
  - Seriously... FOCUS.
  - (This is the hardest task on this entire list)

---

_This roadmap is 100% real and definitely not just organized procrastination. Check back for updates... if I don't get distracted!_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. (Yes, even if you think your code is "not good enough" - we've all been there!)

1. Fork the project (that button up there ↗️)
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request (and cross your fingers 🤞)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. (TL;DR: Do whatever you want, but don't blame me if it breaks! 😅)

## 🙏 Acknowledgments

- Socket.io for real-time communication (because WebSockets are magic 🪄)
- Stack Overflow for saving my life at 3 AM
- Coffee ☕ - The true MVP
- Me, Myself and I (solo dev life hits different 💪)

## 📧 Contact

Want to roast my code or suggest features? Hit me up!

**Email**: jeraldgolden00@gmail.com

Project Link: [https://github.com/Jerald-Golden/Dream-Game](https://github.com/Jerald-Golden/Dream-Game)

---

Made with ❤️ (and lots of debugging 🐛) by the Dream Game Team (population: 1)
