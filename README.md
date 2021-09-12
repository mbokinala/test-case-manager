# Test Case Manager

This project is a work in progress

To run it for yourself, clone the repository, then create a file called `.env.local` and fill it in with the following values:
```
NEXT_PUBLIC_FIREBASE_API_KEY=###
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=###
NEXT_PUBLIC_FIREBASE_PROJECT_ID=###
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=###
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=###
NEXT_PUBLIC_FIREBASE_APP_ID=###
```

Replace the `###`s with the values from your firebase config object (create a web app, not a service account for the admin sdk)

Then run the following commands:
```
yarn 
yarn dev
```
