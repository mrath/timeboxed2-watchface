# Timeboxed 2

> **Fork of [Timeboxed](https://github.com/lfhbento/timeboxed-watchface)** by [Luis Felipe Hussin Bento](https://github.com/lfhbento).  
> Updated for Pebble SDK 4.44, Pebble Time 2, and the new Pebble app by [Mikkel Rath Hansen](https://github.com/mrath).

A simple, clean and highly customizable watchface for all Pebble models, including the **Pebble Time 2**.

![Pebble Time 2 (emery)](assets/screenshot_emery.png) ![Pebble (basalt)](assets/screenshot_basalt.png)

---

## What's new in this fork

### Pebble Time 2 (emery) support
- Added `emery` and `flint` to `targetPlatforms`
- All fonts have a second entry with `pixelHeight` scaled to ~1.4× for the larger 200×228 screen
- All clock/date layout offsets scale with an `EMERY_Y()` macro so text never overlaps
- Widget slot height and icon positions adjusted for the wider display
- Builds and runs cleanly on all 6 platforms: aplite, basalt, chalk, diorite, flint, emery

### Weather — no API key required
The old weather providers (Yahoo, Wunderground, DarkSky, OpenWeatherMap) have been retired.
Weather now comes from the **Pebble app's built-in weather plugin** (`Pebble.subscribeToSource`).

Requirements:
1. Pebble app v1.16 or later
2. Enable **Settings → Plugins preview** in the Pebble app
3. Grant Location permission to the Pebble app

### Settings — fixed with Clay
The original React-based config page was broken (outdated dependencies, settings not syncing).
Replaced with **[@rebble/clay](https://github.com/pebble/clay)** — a lightweight offline settings library.

- All ~130 settings now save and sync reliably to the watch
- Config page opens in the phone browser, no server or API key needed
- Settings persist across watchface restarts via Pebble's `persist` storage

### SDK 4.44 fixes
- `HealthEventHRVUpdate` handled in switch (new enum in SDK 4.44, was a compile error)
- `sleep/deep/active` text buffers enlarged (were too small for `%dh%02dm` format)
- Empty `characterRegex: "[]"` removed from font entries (Python 3.12 rejects empty char class)
- AppMessage inbox set to `app_message_inbox_size_maximum()` to fit all Clay config keys
- `manifestVersion: 2` + `usesPermissions` for Location and CryptoCompare API

---

## Features

- **8 fonts**: Blocko, Blocko Large, System, Archivo Narrow, OSP-DIN, Prototype, LECO, Konstruct
- **Up to 6 widget slots** with 24 module types (weather, health, crypto, timezones, …)
- **4 display states**: normal, sleep, tap, wrist
- **Full color customization** for every element (20+ color pickers)
- **Health tracking**: steps, distance, calories, heart rate, sleep, deep sleep
- **Weather**: current temp, hi/lo, feels-like, wind speed/direction, sunrise/sunset
- **Cryptocurrency prices** for up to 4 pairs via [CryptoCompare](https://www.cryptocompare.com)
- **Dual timezone** display with custom labels
- **Bluetooth disconnect** icon and vibration alert
- **14 languages**: English, Portuguese, French, German, Spanish, Italian, Dutch, Danish, Turkish, Czech, Polish, Swedish, Finnish and Slovak
- **Quick View** support (Pebble Time)
- **Multiple date formats** and separators

---

## Building from source

### Prerequisites

```bash
# Install pebble-tool (requires uv)
uv tool install pebble-tool

# Install Pebble SDK 4.44
pebble sdk install latest

# Install JS dependencies
npm install
```

### Build

```bash
pebble build
```

The output bundle is at `build/timeboxed2.pbw`.

### Run in emulator

```bash
# Pebble Time 2
pebble install --emulator emery
pebble screenshot --emulator emery screenshot_emery.png

# Pebble Time (basalt)
pebble install --emulator basalt
pebble screenshot --emulator basalt screenshot_basalt.png
```

### Install on watch (over Wi-Fi)

1. In the Pebble app: Settings → Developer Mode → note the IP address
2. `pebble install --phone <IP>`

---

## Contributing

This repo lives at [github.com/mrath/timeboxed2-watchface](https://github.com/mrath/timeboxed2-watchface) — PRs welcome.  
Please open an issue before working on large changes.

---

## License

Copyright (c) 2016 Luis Felipe Hussin Bento.  
Modifications copyright (c) 2026 Mikkel Rath Hansen.  
Licensed under the [MIT License](LICENSE).
