# Dream Game - Client

The client application for Dream Game, built with React, TypeScript, and Vite.

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

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run format` - Format code with Prettier

## 🛠️ Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite 7.3** - Build tool and dev server
- **Three.js** - 3D graphics
- **React Three Fiber** - React renderer for Three.js
- **React Three Rapier** - Physics engine
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **React Router DOM** - Routing
- **Radix UI** - Accessible UI components
- **Tailwind CSS** - Utility-first CSS

## 📁 Project Structure

```
src/
├── assets/          # Game assets (models, textures, styles)
│   ├── glts/        # 3D models
│   ├── images/      # Images
│   └── styles/      # CSS files
├── components/      # React components
│   ├── auth/        # Authentication components
│   ├── loading/     # Loading screens
│   ├── pages/       # Page components
│   └── ui/          # Reusable UI components
├── contexts/        # React contexts
│   ├── AuthContext.tsx
│   ├── LobbyContext.tsx
│   ├── PlayerContext.tsx
│   └── SocketContext.tsx
├── core/            # Core game logic
│   ├── store/       # Zustand stores
│   ├── types/       # Core types
│   └── utils/       # Core utilities
├── features/        # Feature modules
│   └── games/       # Game implementations
│       └── among-us/
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
│   ├── functions/   # Helper functions
│   └── hooks/       # Custom React hooks
├── App.tsx          # Main app component
└── index.tsx        # Entry point
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

- User login/registration
- Protected routes
- Session management

### Lobby System

- Create lobbies with custom settings
- Join public/private lobbies
- Real-time player list updates
- Admin controls (kick, start game)
- Ready/unready system
- Game countdown timer

### Chat System

- Real-time messaging
- Auto-scroll to latest messages
- Custom scrollbar styling
- Username display

### 3D Game

- First-person and third-person controls
- Physics-based movement
- Stamina system
- Minimap
- Character models
- Map with collision detection

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

If port 3000 is in use, modify `vite.config.ts`:

```typescript
server: {
    port: 3001, // Change to any available port
}
```

### 3D Models Not Loading

Ensure `.glb` files are in `src/assets/glts/` and properly imported.

### Socket Connection Issues

Verify `VITE_SERVER_URL` and `VITE_SOCKET_URL` in `.env` match your server configuration.

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## 🤝 Contributing

See the main [README](../README.md) for contribution guidelines.
