# Dream Game - Client

The client application for Dream Game, built with React, TypeScript, and Vite. Now also comes in desktop flavor thanks to Electron! ⚡

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 📦 Scripts

### Web App (Browser Mode)

- `npm run dev` - Start development server with HMR (watch those modules reload!)
- `npm run build` - Build for production (minified and optimized 🚀)
- `npm run preview` - Preview production build (test before you deploy!)
- `npm run format` - Format code with Prettier (because messy code is sad code)

### Desktop App (Electron Mode)

- `npm run electron:dev` - Start Electron app in development mode
- `npm run electron:build` - Build Electron app for your current platform
- `npm run electron:build:win` - Build for Windows
- `npm run electron:build:mac` - Build for macOS
- `npm run electron:build:linux` - Build for Linux
- `npm run electron:preview` - Preview Electron production build

## 🛠️ Tech Stack

- **React 18.2** - UI framework (hooks for days)
- **TypeScript** - Type safety (goodbye random runtime errors!)
- **Vite 7.3** - Build tool and dev server (so fast it's unfair)
- **Electron.js** - Desktop app framework (native feels)
- **Three.js** - 3D graphics (making cubes look cool since forever)
- **React Three Fiber** - React renderer for Three.js (JSX goes 3D!)
- **React Three Rapier** - Physics engine (gravity is a thing)
- **Socket.io Client** - Real-time communication (WebSockets but easier)
- **Zustand** - State management (Redux's chill younger sibling)
- **React Router DOM** - Routing (SPA navigation magic)
- **Radix UI** - Accessible UI components (a11y ftw)
- **Tailwind CSS** - Utility-first CSS (classes go brrrr)

## 📁 Project Structure

```
src/
├── assets/          # Game assets (the pretty stuff)
│   ├── glts/        # 3D models (don't touch my polygons)
│   ├── images/      # Images (memes go here... kidding)
│   └── styles/      # CSS files (painting the walls)
├── components/      # React components (Legos of the web)
│   ├── auth/        # Authentication components (the bouncer)
│   ├── loading/     # Loading screens (please wait...)
│   ├── pages/       # Page components (the big views)
│   └── ui/          # Reusable UI components (copy-paste heroes)
├── contexts/        # React contexts (state management black magic)
│   ├── AuthContext.tsx
│   ├── LobbyContext.tsx
│   ├── PlayerContext.tsx
│   └── SocketContext.tsx
├── core/            # Core game logic (the brain)
│   ├── store/       # Zustand stores (state of mind)
│   ├── types/       # Core types (making TS happy)
│   └── utils/       # Core utilities (helper gnomes)
├── features/        # Feature modules (the meat and potatoes)
│   └── games/       # Game implementations
│       └── among-us/ # (sus)
├── types/           # TypeScript type definitions (interface chaos)
├── utils/           # Utility functions (random stuff that works)
│   ├── functions/   # Helper functions
│   └── hooks/       # Custom React hooks
├── App.tsx          # Main app component (the root of all evil)
└── index.tsx        # Entry point (start here)
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for required environment variables:

```env
VITE_DREAMSERVER_URL=https://dream-game.onrender.com
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### TypeScript Path Aliases

The project uses path aliases for cleaner imports:

- `@components/*` → `src/components/*`
- `@features/*` → `src/features/*`
- `@core/*` → `src/core/*`
- `@assets/*` → `src/assets/*`

Example:

```typescript
import Button from "@components/ui/Button";
import Game from "@features/games/among-us/game/game";
```

### Vite Configuration

Key configurations in `vite.config.ts`:

- **Port**: 3000
- **Auto-open**: Browser opens automatically
- **Build output**: `build/` directory
- **Assets**: Includes `.glb` files for 3D models
- **Optimizations**: Excludes `@react-three/rapier` from pre-bundling

## 🎮 Features

### Authentication

- User login/registration (who are you again?)
- Protected routes (VIP access only 🚫)
- Session management (because logging in every 5 seconds is annoying)

### Lobby System

- Create lobbies with custom settings (your house, your rules)
- Join public/private lobbies (party crashers welcome if public)
- Real-time player list updates (stalk your friends in real-time)
- Admin controls (kick that annoying player... we won't judge)
- Ready/unready system (are we there yet?)
- Game countdown timer (the final countdown!)

### Chat System

- Real-time messaging (slide into the global chat)
- Auto-scroll to latest messages (no manual scrolling, we got you)
- Custom scrollbar styling (because default scrollbars are ugly)
- Username display (so you know who to blame)

### 3D Game

- First-person and third-person controls (choose your perspective)
- Physics-based movement (try not to trip)
- Stamina system (cardio is important)
- Minimap (for when you inevitably get lost)
- Character models (looking sharp!)
- Map with collision detection (no walking through walls... usually)

## 🔌 API Integration

The client connects to the Dream Server via Socket.io for all real-time functionality including lobbies, chat, and game rooms.

### Socket Namespaces

- `/api` - Fetch lobbies and rooms
- `/lobby` - Lobby management and chat

## 📱 Responsive Design

The application is designed to work across different screen sizes with responsive layouts and mobile-friendly controls.

## 🎨 Styling

The project uses a combination of:

- **Custom CSS** - Component-specific styles in `src/assets/styles/`
- **Tailwind Utilities** - Via `tailwind-merge` and `class-variance-authority`
- **CSS Variables** - For theming and consistency

## 🚧 Development

### Adding a New Page

1. Create component in `src/components/pages/`
2. Add route in `src/App.tsx`
3. Update navigation if needed

### Adding a New Game

1. Create game directory in `src/features/games/`
2. Implement game logic and components
3. Add to game selection in lobby

### Code Formatting

The project uses Prettier with these settings:

- Tab width: 4 spaces
- Semicolons: Required
- Single quotes: No
- Trailing commas: All
- Print width: 100

Run `npm run format` to format all files.

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is in use (probably some old dev server you forgot about), modify `vite.config.ts`:

```typescript
server: {
    port: 3001, // Change to any available port
}
```

### 3D Models Not Loading

Ensure `.glb` files are in `src/assets/glts/` and properly imported. (Did you remember to commit them? 👀)

### Socket Connection Issues

Verify `VITE_SERVER_URL` and `VITE_SOCKET_URL` in `.env` match your server configuration. When in doubt, check the console – it never lies!

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

See the main [README](../README.md) for contribution guidelines.
