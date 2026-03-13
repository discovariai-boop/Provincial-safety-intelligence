'use client';

import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const COUNTDOWN_SECONDS = 5;

export function SosButton() {
  const { toast } = useToast();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startHolding = () => {
    setIsHolding(true);
    setCountdown(COUNTDOWN_SECONDS);
    setProgress(0);

    // Progress interval for the circle
    progressIntervalRef.current = setInterval(() => {
      setProgress(p => {
        const newProgress = p + (100 / (COUNTDOWN_SECONDS * 10)); // update every 100ms
        if (newProgress >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Countdown timer for dispatch
    timerRef.current = setTimeout(() => {
      dispatchHelp();
      reset();
    }, COUNTDOWN_SECONDS * 1000);
  };

  const dispatchHelp = () => {
    console.log('Dispatching help!');
    toast({
      title: 'Help Dispatched',
      description: 'Responders are on their way. Live ETA will be provided shortly.',
      variant: 'destructive',
    });
  };

  const reset = () => {
    setIsHolding(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(0);
    setCountdown(COUNTDOWN_SECONDS);
  };

  const cancelHolding = () => {
    if (isHolding && progress < 100) {
      toast({
        title: 'Cancelled',
        description: 'You are safe. The emergency request was not sent.',
      });
    }
    reset();
  };
  
  useEffect(() => {
    if (isHolding) {
      const interval = setInterval(() => {
        setCountdown(c => (c > 1 ? c - 1 : 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isHolding]);


  return (
    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
      {/* Outer pulse */}
      <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-scale"></div>

      {/* Progress Ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-green-500/50"
          stroke="currentColor"
          strokeWidth="4"
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
        />
        <circle
          className="text-blue-400 transition-all duration-100 ease-linear"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
          strokeDasharray={2 * Math.PI * 48}
          strokeDashoffset={(2 * Math.PI * 48) * (1 - progress / 100)}
          transform="rotate(-90 50 50)"
        />
      </svg>
      
      {/* Main Button */}
      <button
        onMouseDown={startHolding}
        onMouseUp={cancelHolding}
        onMouseLeave={cancelHolding}
        onTouchStart={(e) => { e.preventDefault(); startHolding(); }}
        onTouchEnd={(e) => { e.preventDefault(); cancelHolding(); }}
        className={cn(
            "relative w-56 h-56 md:w-72 md:h-72 rounded-full text-3xl md:text-4xl font-bold transition-all duration-300 ease-in-out flex items-center justify-center text-center",
            "border-2 border-gray-500/50 bg-black/50 backdrop-blur-md text-white shadow-2xl",
            "hover:scale-105 active:scale-95",
            isHolding && "shadow-[0_0_30px_#00BFFF] scale-105"
        )}
      >
        {isHolding ? (
          <div className='flex flex-col items-center'>
            <span className='text-5xl font-bold'>{countdown}</span>
            <span className='text-sm font-normal tracking-wider'>Hold to send</span>
          </div>
        ) : (
          "SOS"
        )}
      </button>
    </div>
  );
}
