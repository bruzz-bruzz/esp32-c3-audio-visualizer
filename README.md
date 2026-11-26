# FFT Audio Visualizer

[Link](https://esp32-c3-audio-visualizer.vercel.app/)

A web-based audio and video visualizer that processes input in real-time using the Web Audio API and HTML5 Canvas.

## Features

- **Dual Input Modes**:
    - **Microphone**: Visualize audio directly from your microphone.
    - **File Upload**: Upload any audio or video file to visualize its audio track.
- **Interactive Controls**:
    - Play/Pause toggle for file-based playback.
    - Seek slider to scrub through uploaded audio/video.
    - Responsive "Main Menu" navigation to switch between input modes.
- **Theme Support**: Easily toggle between Light and Dark modes.
- **Performance**: Real-time FFT (Fast Fourier Transform) visualization using the browser's native `AnalyserNode`.

## Technologies Used

- **React**: Frontend framework.
- **Vite**: Build tool and development server.
- **Tailwind CSS**: Styling and responsive design.
- **Web Audio API**: For audio processing and analysis.
- **TypeScript**: Type-safe development.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Installation

1. Clone the repository.
2. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the URL provided in the terminal (usually `http://localhost:5173/`).

## How it works

The application creates an `AudioContext` and an `AnalyserNode`. When a microphone or file input is provided, it connects the stream or media element as a source to the analyser. The analyser provides real-time frequency data, which is then drawn onto an HTML5 `<canvas>` element using a requestAnimationFrame loop.

