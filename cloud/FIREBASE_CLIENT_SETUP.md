# Firebase client configuration for Donorcraft

This is a setup checklist for the desktop client's future Firebase Authentication integration. It does not enable Firebase sign-in by itself.

## Create the Firebase app

1. Open the Firebase console and select the project used for Donorcraft.
2. In Project settings → General → Your apps, register a **Web app** named `Donorcraft Desktop`. A Web app registration is also used to obtain the Firebase client configuration for a native desktop client using the Authentication REST API.
3. In Authentication → Sign-in method, enable **Email/Password**.
4. Do not enable anonymous sign-in as a substitute for player accounts.
5. Keep Firestore and Storage rules deployed from this repository; do not loosen them to make sign-in work.

## Configuration fields

The client configuration consists of these public Firebase app values:

- `apiKey`
- `authDomain`
- `projectId`
- `appId`
- `messagingSenderId` (if present in the console config)

The Firebase Web API key is an identifier for the project, not an admin credential. It may be included in a desktop client, but restrict it in Google Cloud where supported and rely on Firebase Authentication, App Check where practical, and Security Rules for authorization.

**Never put these in the desktop client or Git:**
- Firebase service-account JSON/private key;
- Admin SDK credentials;
- database passwords;
- player passwords, refresh tokens, or ID tokens.

## How to provide the configuration

When the Web app is registered and Email/Password is enabled, provide only the public app configuration fields listed above. Do not provide a service-account file or anyone's password. The configuration should ultimately be supplied through build-time configuration or a local ignored config file, not committed as a secret.

## Integration status

The repository currently has Firestore/Storage rules and passing emulator tests, but the launcher does not yet have Firebase registration, sign-in, token refresh, or account UI. Adding the app configuration alone will not make those features work; the client integration and UI still need implementation and tests.
