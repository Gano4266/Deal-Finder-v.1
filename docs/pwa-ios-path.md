# PWA And iOS Path

## Decision

Start with a mobile-first Next.js/PWA path. Do not build the first version in Xcode.

## Why Web First

- The main MVP risk is deal accuracy, not native UI.
- Web pages are shareable and discoverable.
- Admin tooling is simpler to build on the web.
- The team can validate operations before App Store review.

## PWA Expectations

The eventual web app should include:

- responsive iPhone-first layout
- installable manifest
- app icons
- fast route transitions
- source and freshness metadata visible on mobile
- no reliance on push notifications for core value

## iOS Notes

iOS Home Screen web apps can support richer app-like behavior than plain browser pages, but native iOS still has different capabilities, review requirements, entitlements, and background behavior.

Do not submit a thin website wrapper to the App Store. A native app should add real app-specific utility.

## Future Native Triggers

Consider Expo/React Native if:

- iOS and Android both matter.
- push notifications become central.
- saved deals, alerts, and location-aware browsing prove useful.
- API contracts are stable.

Consider SwiftUI if:

- iOS is the clear primary platform.
- Apple-native polish becomes strategically important.
- features such as widgets, Wallet-like passes, Shortcuts, Live Activities, or advanced notification flows become central.
