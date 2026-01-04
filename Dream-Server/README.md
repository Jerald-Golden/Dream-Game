# Dream Game - Server

The server application for Dream Game, built with Node.js, TypeScript, and Socket.io.

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

- `npm start` - Start development server with watch mode
- `npm run build` - Build TypeScript to JavaScript
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (placeholder)

## 🛠️ Tech Stack

- **Node.js** (>=20.x) - Runtime environment
- **TypeScript** - Type safety
- **Express.js** - HTTP server framework
- **Socket.io 4.8** - Real-time bidirectional communication
- **tsx** - TypeScript executor for development
- **CORS** - Cross-origin resource sharing

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

The server provides two main communication channels:

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

1. **Lobby Creation**
    - Player creates lobby with settings
    - Becomes admin automatically
    - Lobby appears in public list (if not private)

2. **Players Join**
    - Players join via lobby name
    - Private lobbies require password
    - Real-time player list updates

3. **Ready System**
    - Players toggle ready status
    - Admin can see all ready states
    - Countdown cancels if anyone becomes unready

4. **Game Start**
    - Admin selects game type
    - Admin starts countdown (10 seconds)
    - Countdown cancels if:
        - Any player leaves
        - Any player joins
        - Any player becomes unready
        - Admin cancels manually
    - On countdown completion:
        - Lobby moves to game room
        - Socket.io room created
        - Players redirected to game

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

# Kill the process or change PORT in .env
```

### Socket Connection Refused

- Verify server is running
- Check firewall settings
- Ensure CORS is configured correctly
- Verify client is using correct URL

### Players Not Updating

- Check socket room joining: `socket.join(lobbyName)`
- Verify emit targets: `io.of("/lobby").to(lobbyName).emit(...)`
- Check client-side listeners

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

Current implementation is single-server. For production:

1. **Use Redis** for shared state across servers
2. **Implement sticky sessions** for Socket.io
3. **Add load balancer** (nginx, HAProxy)
4. **Database** for persistent lobbies/users
5. **Message queue** for event processing

## 🤝 Contributing

See the main [README](../README.md) for contribution guidelines.

## 📚 Learn More

- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
