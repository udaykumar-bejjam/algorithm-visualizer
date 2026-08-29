# Overview

## What this project is

**Algorithm Visualizer** is an interactive web platform that visualizes algorithms **from code**. Users browse curated algorithms or write their own (JavaScript, C++, Java). Visualization libraries (`tracers.*`) instrument the code; this React app interprets the resulting command stream and animates data structures step by step.

This repository is **only the web client**. Compiling/running code, OAuth, and algorithm content live in sibling repositories.

## Ecosystem

```
┌─────────────────────────────────────────────────────────────────┐
│                     algorithm-visualizer.org                     │
├──────────────────┬──────────────────┬───────────────────────────┤
│  This repo       │  server          │  algorithms               │
│  (React UI +     │  (APIs, OAuth,   │  (curated demos in the    │
│   command→viz)   │   compile/run,   │   side-menu)              │
│                  │   static host)   │                           │
├──────────────────┴──────────────────┴───────────────────────────┤
│  tracers.js / tracers.cpp / tracers.java                         │
│  (language libraries that emit visualization commands)           │
└─────────────────────────────────────────────────────────────────┘
```

| Repository | Responsibility |
|------------|----------------|
| [`algorithm-visualizer`](https://github.com/algorithm-visualizer/algorithm-visualizer) | UI components; interprets commands into visualizations |
| [`server`](https://github.com/algorithm-visualizer/server) | Serves the app; GitHub sign-in; compile/run tracers |
| [`algorithms`](https://github.com/algorithm-visualizer/algorithms) | Algorithm files shown in the navigator |
| [`tracers.js`](https://github.com/algorithm-visualizer/tracers.js) / [`.cpp`](https://github.com/algorithm-visualizer/tracers.cpp) / [`.java`](https://github.com/algorithm-visualizer/tracers.java) | Per-language visualization libraries |

## Tech stack (as of this codebase)

| Layer | Choice |
|-------|--------|
| UI | React 16.8 (class components), react-helmet |
| State | Redux 4 + redux-actions |
| Routing | react-router / react-router-dom v5 (+ unused react-router-redux) |
| Build | Create React App 3 (`react-scripts`) |
| Styles | SCSS modules + shared tokens in `src/common/stylesheet` |
| Editor | react-ace / brace (Tomorrow Night Eighties theme) |
| Charts | chart.js 2 + react-chartjs-2 |
| HTTP | axios 0.19 (response interceptor unwraps `.data`) |
| Icons | Font Awesome (legacy free packages + svg-core) |
| Auth storage | js-cookie (`access_token`, `ext`) |
| Languages | JavaScript, C++, Java |

**Node engine:** `>=10.15.3` (historical; modern Node may need toolchain updates, especially for `node-sass`).

## Design language

Dark IDE-like chrome:

- Backgrounds: `#242424` / `#393939` / `#505050`
- Font: Roboto; code: Monaco / Menlo / Consolas
- Selection highlight: `#2962ff`; patch: `#c51162`; active: `#00e676`
- Full-bleed app (`overflow: hidden`); resizable three-pane workspace

## High-level user value

1. **Learn** algorithms by watching curated visualizations with code synced to each step.
2. **Create** (“Scratch Paper”) visualizations in JS/C++/Java using the tracer API.
3. **Share** scratch papers via GitHub Gists (sign-in required to save).
4. **Scrub** playback: play, pause, step, speed, progress bar, and current-line highlight in the editor.
