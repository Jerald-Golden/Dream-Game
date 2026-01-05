# Dream Game - Server

The server application for Dream Game, built with Node.js, TypeScript, and Socket.io. (The backend that makes the magic happen ✨)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm start
```

The server will start on `http://localhost:2567`

## 📦 Scripts

- `npm start` - Start development server with watch mode (auto-restart on save!)
- `npm run build` - Build TypeScript to JavaScript (compiling magic 🔮)
- `npm run format` - Format code with Prettier (make it pretty!)
- `npm test` - Run tests (placeholder for now... I'll write them eventually, I promise 😅)

## 🛠️ Tech Stack

- **Node.js** (>=20.x) - Runtime environment (JavaScript on the server, wild!)
- **TypeScript** - Type safety (catch bugs before they catch you)
- **Express.js** - HTTP server framework (the classic choice)
- **Socket.io 4.8** - Real-time bidirectional communication (ping pong all day)
- **tsx** - TypeScript executor for development (no build step needed!)
- **CORS** - Cross-origin resource sharing (letting browsers play nice)

## 📁 Project Structure

```
src/
├── index.ts      # Main server file with Socket.io setup
├── lobbies.ts    # Lobby management logic
└── rooms.ts      # Room management logic
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for required environment variables:

```env
PORT=2567
NODE_ENV=development
ALLOWED_ORIGINS=https://dream-games.netlify.app
```

### TypeScript Configuration

The server uses CommonJS modules with the following key settings:

- **Target**: ES2016
- **Module**: CommonJS
- **Decorators**: Enabled
- **Strict mode**: Enabled
- **Output**: `build/` directory

## 🌐 API Architecture

## 🌐 API Architecture

The server provides two main communication channels (because one wasn't complicated enough):

### 1. Socket.io Namespaces

#### `/api` Namespace

Public API for fetching data without joining lobbies.

**Events:**

- `getLobbies` - Fetch all available lobbies
    - Emits: `lobbiesList`
- `getRooms` - Fetch all active game rooms
    - Emits: `roomsList`

#### `/lobby` Namespace

Lobby management and real-time communication.

**Client → Server Events:**

| Event                  | Payload                                                          | Description                           |
| ---------------------- | ---------------------------------------------------------------- | ------------------------------------- |
| `reconnectToLobby`     | `{ lobbyName, userId }`                                          | Reconnect to a lobby after disconnect |
| `createLobby`          | `{ lobbyName, username, userId, maxPlayers, private, password }` | Create a new lobby                    |
| `joinLobby`            | `{ lobbyName, username, userId, password }`                      | Join an existing lobby                |
| `leaveLobby`           | `{ lobbyName, userId }`                                          | Leave a lobby                         |
| `kickFromLobby`        | `{ lobbyName, targetUserId, senderUserId }`                      | Kick a player (admin only)            |
| `toggleReady`          | `{ lobbyName, userId }`                                          | Toggle ready status                   |
| `selectGame`           | `{ lobbyName, userId, gameId }`                                  | Select game type (admin only)         |
| `moveToRoom`           | `{ lobbyName, userId }`                                          | Move lobby to game room (admin only)  |
| `requestGameCountdown` | `{ lobbyName, userId }`                                          | Start game countdown (admin only)     |
| `cancelGameCountdown`  | `{ lobbyName, userId }`                                          | Cancel game countdown (admin only)    |
| `chat`                 | `{ lobbyName, message, userId }`                                 | Send chat message                     |

**Server → Client Events:**

| Event                    | Payload             | Description                |
| ------------------------ | ------------------- | -------------------------- |
| `reconnected`            | `{ lobby }`         | Successful reconnection    |
| `reconnected_error`      | `{ message }`       | Reconnection failed        |
| `lobbyCreated`           | `{ lobby }`         | Lobby created successfully |
| `lobbyUpdated`           | `{ lobby }`         | Lobby state updated        |
| `updatePlayers`          | `[players]`         | Player list updated        |
| `movedToRoom`            | `{ roomName }`      | Lobby moved to game room   |
| `gameCountdownTick`      | `{ seconds }`       | Countdown timer tick       |
| `gameCountdownCancelled` | -                   | Countdown cancelled        |
| `kicked`                 | -                   | Player was kicked          |
| `chat`                   | `{ from, message }` | Chat message received      |

## 💾 Data Models

### Lobby

```typescript
interface Lobby {
    name: string;
    admin: string; // userId of admin
    maxPlayers: number;
    private: boolean;
    password?: string;
    selectedGame: string | null;
    inRoom: boolean;
    players: Map<string, LobbyPlayer>;
    launchTimer: NodeJS.Timer | null;
}
```

### LobbyPlayer

```typescript
interface LobbyPlayer {
    username: string;
    userId: string;
    socketId: string;
    role: "admin" | "player";
    isReady: boolean;
}
```

### Room

```typescript
interface Room {
    name: string;
    gameType: string;
    players: Map<string, RoomPlayer>;
}
```

## 🎮 Game Flow

1. **Lobby Creation** (The Beginning)
    - Player creates lobby with settings
    - Becomes admin automatically (heavy lies the crown)
    - Lobby appears in public list (if not private, duh)

2. **Players Join** (The Gathering)
    - Players join via lobby name
    - Private lobbies require password (secret club)
    - Real-time player list updates (magic!)

3. **Ready System** (The "Waiting for Bob" Phase)
    - Players toggle ready status
    - Admin can see all ready states
    - Countdown cancels if anyone becomes unready (troll prevention)

4. **Game Start** (The Launch)
    - Admin selects game type
    - Admin starts countdown (10 seconds of anxiety)
    - Countdown cancels if:
        - Any player leaves (rude)
        - Any player joins (wait!)
        - Any player becomes unready (why would you do that?)
        - Admin cancels manually (changed my mind)
    - On countdown completion:
        - Lobby moves to game room
        - Socket.io room created
        - Players redirected to game (good luck!)

5. **Game Room**
    - Managed by Socket.io `/room` namespace
    - Real-time state synchronization
    - Game-specific logic

## 🔐 Security Considerations

### Current Implementation

- Password-protected lobbies (plain text)
- Admin-only actions verified server-side
- CORS enabled for development

### Production Recommendations

- Hash lobby passwords
- Implement rate limiting
- Add authentication tokens
- Validate all user inputs
- Use environment-specific CORS origins
- Add SSL/TLS encryption
- Implement proper session management

## 🚧 Development

### Adding New Socket Events

1. **Define event in appropriate namespace** (`/api` or `/lobby`)
2. **Add event handler** in `src/index.ts`
3. **Update data models** if needed in `lobbies.ts` or `rooms.ts`
4. **Emit updates** to relevant clients
5. **Document** in this README

Example:

```typescript
socket.on("customEvent", ({ lobbyName, data }) => {
    const lobby = lobbies.get(lobbyName);
    if (lobby) {
        // Handle event logic
        io.of("/lobby").to(lobbyName).emit("customEventResponse", { result });
    }
});
```

### Testing Socket Events

Use tools like:

- [Socket.io Client Tool](https://amritb.github.io/socketio-client-tool/)
- [Postman](https://www.postman.com/) (supports WebSocket)
- Custom test scripts with `socket.io-client`

### Debugging

Enable debug logs:

```bash
DEBUG=socket.io:* npm start
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 2567
netstat -ano | findstr :2567  # Windows
lsof -i :2567                  # macOS/Linux

# Kill the process or change PORT in .env (or just rage quit and try again)
```

### Socket Connection Refused

- Verify server is running (did you forget to start it? happens to the best of us)
- Check firewall settings (firewalls love blocking things)
- Ensure CORS is configured correctly (the eternal struggle)
- Verify client is using correct URL (typos are sneaky)

### Players Not Updating

- Check socket room joining: `socket.join(lobbyName)` (did they actually join?)
- Verify emit targets: `io.of("/lobby").to(lobbyName).emit(...)` (are you yelling into the void?)
- Check client-side listeners (are they even listening?)

## 🔄 State Management

### Lobby State

- Stored in-memory using `Map<string, Lobby>`
- Cleared when lobby is empty
- Moved to rooms when game starts

### Room State

- Managed by Socket.io
- Real-time synchronization via Socket.io events
- Persists during game session

### Cleanup

- Lobbies auto-delete when empty
- Timers cleared on lobby deletion
- Socket rooms cleaned up on disconnect

## 📈 Scalability Considerations

Current implementation is single-server. For production (when this thing blows up 🚀):

1. **Use Redis** for shared state across servers (because RAM doesn't grow on trees)
2. **Implement sticky sessions** for Socket.io (keep users glued to their server)
3. **Add load balancer** (nginx, HAProxy) - distribute that traffic!
4. **Database** for persistent lobbies/users (memory is volatile, just like my motivation)
5. **Message queue** for event processing (async all the things!)

## 🤝 Contributing

See the main [README](../README.md) for contribution guidelines.

## 📚 Learn More

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
