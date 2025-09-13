# AngularSignalRSample

This project demonstrates the differences between **WebSocket** and **Long Polling** transport mechanisms in real-time applications, focusing on the challenges of JWT renewal—especially in long polling scenarios.

## Project Structure

- **SignalRBackEnd/**: ASP.NET Core backend with SignalR, JWT authentication, and message dispatching.
- **signalRFrontEnd/**: Angular frontend for connecting, dispatching, and receiving real-time messages.

## Disclaimer

Some implementations are done "on the fly" for demonstration purposes only. This is not production code—certain shortcuts and simplifications are intentional to highlight concepts.

## Key Features & Behaviors

- **JWT Expiry for Admin**: If you log in as `admin`, the JWT token lasts only **10 seconds** before expiring.
- **Reconnect Delay**: When reconnecting, the frontend waits **3 seconds** to allow time for backend messages to be enqueued.
- **Backend Message Queue**: Uses an in-memory, thread-safe queue for recent messages. In real scenarios, a distributed cache like Redis should be used to avoid holding state in a pod.

## WebSocket vs Long Polling

| Feature         | WebSocket                                    | Long Polling                                 |
|-----------------|----------------------------------------------|----------------------------------------------|
| **Connection**  | Persistent, full-duplex                      | Repeated HTTP requests                       |
| **Latency**     | Low, real-time                               | Higher, depends on polling interval          |
| **Efficiency**  | Fewer headers, less overhead                 | More HTTP overhead, less efficient           |
| **JWT Renewal** | Token sent only on initial handshake         | Token sent on every poll, easier to renew    |
| **Scalability** | Requires sticky sessions or distributed state| Easier to scale statelessly                  |
| **Pros**        | Fast, bidirectional, efficient               | Simple, works everywhere, easier JWT refresh |
| **Cons**        | Harder to scale, JWT renewal is tricky       | Higher latency, less efficient               |

## Frontend

The frontend is built in Angular and connects to the backend to dispatch and receive real-time messages using SignalR. It demonstrates both transport types and handles authentication, reconnection, and message display.

---
**Note:** This repository is for educational purposes and not intended for production use.
