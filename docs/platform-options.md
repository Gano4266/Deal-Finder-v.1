# Platform Options

## Next.js/PWA

Best first choice for the MVP.

Pros:

- fastest iteration
- shareable pages
- SEO and local discovery
- simple admin tooling
- easy path to static demo data and later API integration

Cons:

- less native retention than App Store apps
- iOS web push requires Home Screen installation
- limited background behavior

## SwiftUI/Xcode

Best later if Deal Finder becomes deeply Apple-native.

Pros:

- best iOS feel
- strong Apple Maps, notification, widget, and system integration
- clear App Store presence

Cons:

- slower MVP iteration
- App Store review overhead
- duplicates web/admin work unless API contracts are stable

## React Native/Expo

Best later if native iOS and Android both matter.

Pros:

- shared TypeScript-friendly product surface
- good native distribution path
- can reuse API contracts and validation concepts from the web MVP

Cons:

- still requires native build and store workflow
- more complexity than web for the first inventory-validation milestone

## Thin Web Wrapper

Not recommended.

Apple expects app-like utility beyond a repackaged website. If native distribution is pursued, it should add real native value such as saved deal alerts, location-aware flows, or platform-specific interactions.
