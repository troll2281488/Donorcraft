# Donorcraft accounts — username and password

## Player experience

Registration and sign-in use only:
- a unique username (login);
- a password.

No email address and no Microsoft account are required. The player never has to see or manually handle Firebase tokens.

## Authentication design

A small trusted authentication API will:
1. accept registration with username and password over HTTPS;
2. validate and normalize usernames and enforce uniqueness;
3. hash passwords with Argon2id and a unique random salt;
4. verify passwords on sign-in with constant-time password-hash verification;
5. rate-limit registration and login attempts and return generic errors that do not reveal whether a username exists;
6. issue a short-lived signed session credential to the Donorcraft client and support safe refresh/revocation.

The desktop client sends credentials only over HTTPS. Passwords must never be stored in Firestore, Cloud Storage, client configuration, logs, or source control. Password hashes and authentication secrets must not be readable by clients.

## Firebase integration

Firebase remains responsible for profile/world metadata and Cloud Storage, not for the username/password form itself. The trusted backend can authorize access to Firebase-owned resources using server-side credentials and/or exchange its verified session for Firebase Custom Auth credentials where Firebase client SDK access is needed. These credentials are an internal implementation detail; players do not enter or copy them.

A Firebase service-account private key must remain on the backend and must never be embedded in the launcher or committed to Git.

## Account fields

- username: unique login, 3–24 characters, case-insensitive uniqueness;
- password: accepted at registration, stored only as an Argon2id hash on the trusted backend;
- nickname: public display name, may be the same as username initially;
- uid: stable internal account identifier, not chosen by the client.

## Account recovery

Because there is no email address, password recovery cannot be automatic by email. The product needs an explicit recovery approach (for example, recovery codes shown once at registration or a carefully designed support flow). Never promise recovery until implemented.

## Current implementation status

- Firestore profile/world rules and emulator tests: present.
- Username/password registration API: not implemented.
- Argon2id credential database and session management: not implemented.
- Launcher registration/login UI: not implemented.
- Firebase profile integration and cloud world backend: not implemented.

This document is the target design, not a claim that registration is already working.
