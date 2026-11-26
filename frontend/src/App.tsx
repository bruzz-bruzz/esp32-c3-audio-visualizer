import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import './App.css';
import Github from './Github';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const themeClass = isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black';
  const canvasBg = isDarkMode ? 'bg-black' : 'bg-white';

  const setupAudioContext = (sourceNode: MediaStreamAudioSourceNode | MediaElementAudioSourceNode, audioContext: AudioContext) => {
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyserRef.current = analyser;
    audioContextRef.current = audioContext;

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);

      if (canvas && ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = (canvas.width / dataArray.length) * 2.5;
          let x = 0;
          for (let i = 0; i < dataArray.length; i++) {
              const barHeight = (dataArray[i] / 255) * canvas.height;
              ctx.fillStyle = isDarkMode ? 'rgb(50, 100, 255)' : 'rgb(100, 50, 200)';
              ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
              x += barWidth + 1;
          }
      }
      animationFrameRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Add event listeners to update time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);


  const [isFile, setIsFile] = useState(false);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      const source = audioContext.createMediaStreamSource(stream);
      setupAudioContext(source, audioContext);
      setIsFile(false);
      setIsStarted(true);
    } catch (err) {
      console.error('Error accessing mic', err);
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
      
      const audioContext = new AudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const source = audioContext.createMediaElementSource(audioRef.current);
      setupAudioContext(source, audioContext);
      setIsFile(true);
      setIsStarted(true);
    }
  };

  const resetApp = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsStarted(false);
    setIsPlaying(false);
    setIsFile(false);
  };


  useEffect(() => {
    return () => {
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div className={`min-h-screen ${themeClass} flex flex-col items-center justify-center p-4 transition-colors duration-300`}>
      <button onClick={() => setIsDarkMode(!isDarkMode)} className='absolute top-4 right-4 px-4 py-2 bg-gray-500 rounded-lg text-sm'>
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
          {isStarted && (
        <div className='flex flex-col items-center gap-4 mb-4'>
           {isFile ? (
             <div className='flex flex-col items-center gap-2 mb-4 w-full max-w-md'>
                <div className='flex gap-4'>
                  <button onClick={() => {
                     if (isPlaying) {
                         audioRef.current?.pause();
                         setIsPlaying(false);
                     } else {
                         audioRef.current?.play();
                         setIsPlaying(true);
                     }
                  }} className='px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-lg font-semibold transition text-white'>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={resetApp} className='px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold transition text-white'>
                  Main Menu
                </button>
                </div>
                <input 
                  type='range' 
                  min={0} 
                  max={duration} 
                  value={currentTime} 
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = parseFloat(e.target.value);
                      setCurrentTime(parseFloat(e.target.value));
                    }
                  }}
                  className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all'
                />
             </div>
           ) : (
              <button onClick={resetApp} className='px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-semibold transition text-white'>
                Main Menu
              </button>
           )}
        </div>
      )}
      <h1 className='text-4xl font-bold mb-8'>FFT Audio Visualizer</h1>
      {!isStarted && (
        <div className='flex gap-4'>
          <button onClick={startMicrophone} className='px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-lg font-semibold transition text-white'>
            Start Microphone
          </button>
          <input type='file' accept='audio/*,video/*' onChange={handleFileUpload} className='px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold transition text-white' />
        </div>
      )}
      <audio ref={audioRef} className='hidden' controls />
      <canvas ref={canvasRef} width={800} height={400} className={`${canvasBg} mt-4 rounded-lg shadow-xl`} />
      <div className='mt-auto w-full'>
        <Github profileURL='https://github.com/bruzz-bruzz' repoURL='https://github.com/bruzz-bruzz/esp32-c3-audio-visualizer' />
      </div>
    </div>
  );
}

export default App;