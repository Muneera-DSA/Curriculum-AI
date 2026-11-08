import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Bell, Timer, Volume2 } from 'lucide-react';

interface CookingTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMinutes: number;
  label: string;
}

export const CookingTimerModal: React.FC<CookingTimerModalProps> = ({
  isOpen,
  onClose,
  initialMinutes,
  label,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSecondsRemaining(initialMinutes * 60);
    setIsRunning(true);
    setHasFinished(false);
  }, [initialMinutes, label, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            playAlarmChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const playAlarmChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Create pleasant two-tone chime
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.setValueAtTime(880, now + 0.2); // A5
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio chime failed:', e);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalSecs = Math.max(1, initialMinutes * 60);
  const progressPercent = ((totalSecs - secondsRemaining) / totalSecs) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Background glow when finished */}
        {hasFinished && (
          <div className="absolute inset-0 bg-emerald-500/10 dark:bg-emerald-500/20 animate-pulse pointer-events-none" />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-3">
          <Timer className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-stone-900 dark:text-white mb-1">
          Kitchen Timer
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 max-w-[240px] mx-auto truncate mb-4">
          {label}
        </p>

        {/* Big Countdown */}
        <div className="py-4 my-2 relative">
          <div className="text-5xl font-mono font-black tracking-wider text-emerald-900 dark:text-emerald-200">
            {formattedTime}
          </div>

          {/* Progress bar */}
          <div className="w-48 mx-auto mt-3 h-2 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {hasFinished && (
          <div className="mb-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5">
            <Bell className="w-4 h-4 animate-bounce" /> Time is up! Ready for next step!
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setSecondsRemaining(initialMinutes * 60);
              setHasFinished(false);
              setIsRunning(true);
            }}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Resume
              </>
            )}
          </button>

          <button
            onClick={playAlarmChime}
            className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors"
            title="Test chime"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
