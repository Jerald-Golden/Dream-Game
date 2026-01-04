# 🎮 Dream Game

A multiplayer social deduction game built with React, TypeScript, and Socket.io. Experience real-time gameplay with stunning 3D graphics powered by Three.js and React Three Fiber.

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![React](https://img.shields.io/badge/React-18.x-blue) ![Node](https://img.shields.io/badge/Node-%3E%3D20.x-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🎯 **Real-time Multiplayer** - Powered by Socket.io for seamless multiplayer experience
- 🎨 **3D Graphics** - Immersive gameplay with Three.js and React Three Fiber
- 🔐 **Authentication System** - Secure user authentication
- 🏠 **Lobby System** - Create, join, and manage game lobbies
- 💬 **Real-time Chat** - In-lobby chat functionality
- 🎮 **Multiple Games** - Support for various game types
- 📱 **Responsive Design** - Works across different screen sizes
- ⚡ **Fast Development** - Built with Vite for lightning-fast HMR

## 🛠️ Tech Stack

### Client (`Dream-Game`)

- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 7.3
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
│   ├── .env.example         # Environment variables template
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
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

- Node.js (>= 20.x)
- npm or yarn
- Git

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

   Navigate to `http://localhost:3000`

## 💻 Development

### Client Development

```bash
cd Dream-Game

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format
```

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

## 🔐 Environment Variables

### Client (`Dream-Game/.env`)

```env
VITE_DREAMSERVER_URL=https://dream-game.onrender.com
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Server (`Dream-Server/.env`)

```env
PORT=2567
NODE_ENV=production
ALLOWED_ORIGINS=https://dream-games.netlify.app
```

See `.env.example` files in each directory for complete configuration options.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- All contributors and testers

## 📧 Contact

Project Link: [https://github.com/Jerald-Golden/Dream-Game](https://github.com/Jerald-Golden/Dream-Game)

---

Made with ❤️ by the Dream Game Team
