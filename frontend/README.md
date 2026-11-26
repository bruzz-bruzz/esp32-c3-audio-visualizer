# React + TypeScript + Vite Audio Visualizer

![React](https://img.shields.io/badge/React-19.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3-38B2AC?logo=tailwindcss)

This is the frontend portion of the Audio Visualizer project, a web-based interface for processing and visualizing audio streams using the Web Audio API and HTML5 Canvas.

## Features

- **Microphone Input**: Real-time visualization from your microphone.
- **File Upload**: Support for audio and video files.
- **Interactive Controls**: Play, pause, and seek functionality.
- **Theme Support**: Integrated Light/Dark mode.
- **Performance**: High-performance rendering via `requestAnimationFrame` and `AnalyserNode`.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Configuration

This project is configured with Vite, React 19, and Tailwind CSS. Type checking is enforced via TypeScript.
