# Donorcraft Cloud Worlds — foundation

This directory documents the planned cloud-world service. The Firebase rules in this repository are a **security baseline**, not a deployed backend. These files alone do not create a Firebase project, credentials, game-server hosting, or playable cloud multiplayer.

## Target experience

1. A player signs in with Firebase Authentication.
2. The player creates a world and receives a revocable join code.
3. A trusted control service starts a dedicated Donorcraft/Horizon server for that world and returns a short-lived connection ticket.
4. The second player enters the code and joins the same authoritative server.
5. The server periodically saves a snapshot to Cloud Storage.
6. When the last player leaves, a five-minute idle timer starts. The server saves a final snapshot, verifies it, then shuts down.
7. A later join request starts a server from the latest verified snapshot.

The world must be simulated by a real game server process. Firestore, Realtime Database, and Cloud Storage are not game servers and cannot run the game tick.

Account design and the username/password trade-offs are documented in [AUTHENTICATION.md](AUTHENTICATION.md).\n\n## Firebase responsibilities

- **Authentication:** account registration and sign-in. Passwords must never be stored in Firestore or this repository.
- **Firestore:** private profile and world metadata. Join codes and server sessions are deliberately denied to direct client access; a trusted backend must validate and manage them.
- **Cloud Storage:** private world snapshot files. Current rules allow only the owner to access their own snapshot path. A trusted server will mediate shared world access in a later phase.

The Firebase CLI configuration connects to firestore.rules and storage.rules. The rules use deny-by-default behavior. Review and test them in the Firebase Emulator Suite before deploying.

## Server hosting is a separate decision

The server host must support the actual Horizon server runtime, persistent process/networking requirements, and safe start/stop orchestration. Cloud Run is not assumed to be compatible. A small VM or another container/VM host may be more appropriate. Free hosting is not guaranteed; check provider quotas, billing, network ingress, disk persistence, and idle shutdown behavior before deployment.

## Secrets — where they belong

Never commit any of these to Git:
- Firebase service-account JSON or private keys;
- cloud-provider service-account credentials;
- server control tokens, signing keys, or database admin credentials;
- player passwords or authentication tokens.

Use the hosting provider's secret manager for deployed services. GitHub Actions should receive only the minimum deployment credentials through repository Settings → Secrets and variables → Actions after a deployment workflow is designed. Do not paste secrets into issues, commits, chat, or source files.

Firebase web/client configuration is not a service-account secret, but it is not authorization: enforce access with Authentication and Security Rules, and never put admin credentials in a desktop client.

## Current status

- Firebase CLI configuration and restrictive starter rules: added.
- Firebase project and Auth providers: not created/configured.
- Backend API for join codes and server lifecycle: not implemented.
- Cloud game-server image/VM and idle controller: not implemented.
- Snapshot serialization/restore integration with Horizon: not implemented.
- Donorcraft desktop UI integration: not implemented.

Do not advertise cloud multiplayer as available until the complete server, snapshot/restore, access-control, and two-client test has passed.
