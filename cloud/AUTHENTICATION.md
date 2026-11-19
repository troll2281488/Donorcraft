# Donorcraft accounts — authentication plan

This document defines the account flow before it is connected to the launcher. It does not create accounts or enable sign-in yet.

## Desired player experience

Players should be able to sign in with a username and password, without needing a Microsoft account. The public username is a nickname; it is not a password and must be unique if the product promises unique names.

## Safe implementation choices

### Option A — Firebase email/password (simplest first release)

- Firebase Authentication creates and verifies the account and handles password storage.
- The launcher asks for an email and password; a separate nickname is stored in `users/{uid}`.
- Firebase returns the authenticated UID. Firestore rules use that UID to protect profiles and worlds.
- The app never writes passwords to Firestore, Cloud Storage, logs, crash reports, or source files.

This option is the easiest to ship, but it requires an email address and therefore is not a pure username-only login.

### Option B — username/password without email

A trusted backend must own the username-to-account mapping and authenticate the password. It must use a reputable password-hashing scheme (for example Argon2id with per-account salts), rate-limit login attempts, protect sessions, and provide a safe account-recovery plan. The desktop client must send credentials only over TLS to that backend.

Do not implement this by storing plaintext passwords, reversible-encrypted passwords, or password hashes in a client-readable Firestore collection. Do not put a privileged Firebase service-account key in the launcher.

## Data boundary

- Firebase Authentication (or a dedicated trusted auth service) owns credentials.
- Firestore `users/{uid}` stores only public/profile metadata such as nickname and avatar reference.
- The existing Firestore rules reject extra profile fields such as `password`.
- World ownership is tied to the authenticated UID, never to a nickname supplied by the client.
- Join codes are generated, rate-limited, revocable, and checked by the trusted backend; clients cannot read or write the `joinCodes` or `serverSessions` collections directly.

## Current implementation status

- Firestore profile rules and emulator tests: present; the GitHub Actions emulator test run passed.
- Firebase project and Authentication provider: not configured.
- Launcher registration/login screens and token handling: not implemented.
- Username-only authentication backend: not implemented.
- Account recovery, abuse/rate limits, and production monitoring: not implemented.

The first practical release should use Option A unless a username-only login is an absolute requirement. Never ask a player to send a password to support or store it in a world/profile document.
