'use client';

import { useState, useRef, useEffect } from 'react';
import type { MouseEvent, TouchEvent } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

const COUNTDOWN_SECONDS = 5;

interface SosButtonProps {
  onDispatch?: () => void;
  onCancel?: () => void;
}

export function SosButton({ onDispatch, onCancel }: SosButtonProps) {
  const { toast } = useToast();
  const [isHolding, setIsHolding] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [hasDispatched, setHasDispatched] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHolding = () => {
    if(isDispatching) return;
    setIsHolding(true);
    setCountdown(COUNTDOWN_SECONDS);
    setProgress(0);

    // Progress interval for the circle
    progressIntervalRef.current = setInterval(() => {
      setProgress((p: number) => {
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
    }, COUNTDOWN_SECONDS * 1000);
  };

  const dispatchHelp = () => {
    console.log('Dispatching help!');
    setIsDispatching(true);
    setHasDispatched(true);
    setIsHolding(false);

    if (onDispatch) {
      onDispatch();
    }

    toast({
      title: 'Help Dispatched',
      description: 'Responders are on their way. Live ETA will be provided shortly.',
      variant: 'destructive',
      duration: 10000,
    });
    
    // Reset after a delay to show the dispatched state
    setTimeout(() => {
        reset();
    }, 5000);
  };

  const reset = () => {
    setIsHolding(false);
    setIsDispatching(false);
    setHasDispatched(false);
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
        title: 'Cancelled – You are Safe',
        description: 'The emergency request was not sent.',
      });

      if (onCancel) {
        onCancel();
      }

      reset();
    }
  };
  
  useEffect(() => {
    if (!isHolding) return;

    const interval = setInterval(() => {
      setCountdown((c: number) => (c > 1 ? c - 1 : 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isHolding]);


  return (
    <div className="relative flex flex-col items-center justify-center gap-4 w-64 h-64 md:w-80 md:h-80">
      {/* Outer pulse */}
      {!isHolding && !isDispatching && (
        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-[pulse-scale_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
      )}
     
      {/* Progress Ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-500/30"
          stroke="currentColor"
          strokeWidth="2"
          cx="50"
          cy="50"
          r="48"
          fill="transparent"
        />
        <circle
          className={cn(
            'transition-all duration-100 ease-linear',
            isHolding && 'text-blue-400',
            isDispatching && 'text-red-500',
            !isHolding && !isDispatching && 'text-gray-400/60'
          )}
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
          style={{ filter: `drop-shadow(0 0 8px hsl(var(--accent)))` }}
        />
      </svg>
      
      {/* Main Button */}
      <button
        onMouseDown={startHolding}
        onMouseUp={cancelHolding}
        onMouseLeave={cancelHolding}
        onTouchStart={(e: TouchEvent<HTMLButtonElement>) => {
          e.preventDefault();
          startHolding();
        }}
        onTouchEnd={(e: TouchEvent<HTMLButtonElement>) => {
          e.preventDefault();
          cancelHolding();
        }}
        className={cn(
            "relative w-56 h-56 md:w-72 md:h-72 rounded-full text-3xl md:text-4xl font-bold transition-all duration-300 ease-in-out flex items-center justify-center text-center",
            "border-2 border-gray-500/50 bg-black/65 backdrop-blur-md text-white shadow-2xl",
            "active:scale-95",
            !isDispatching && "hover:scale-105",
            isHolding && "shadow-[0_0_30px_#00BFFF] scale-105",
            isDispatching && "bg-red-600/90 scale-110 shadow-[0_0_50px_#ff0000] border-red-300"
        )}
      >
        {isDispatching ? (
          <div className="flex flex-col items-center gap-1">
            <ShieldAlert className="w-16 h-16" />
            <span className="text-lg font-semibold tracking-wide uppercase">
              SOS ACTIVE
            </span>
            <span className="text-xs font-normal opacity-80">
              Recording 20s video • Multi-agency dispatch
            </span>
          </div>
        ) : isHolding ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-5xl font-extrabold tabular-nums">
              {countdown}
            </span>
            <span className="text-xs font-normal tracking-[0.2em] uppercase">
              Hold {COUNTDOWN_SECONDS}s to blast SOS
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-4xl font-extrabold tracking-wide">
              SOS
            </span>
            <span className="text-xs font-normal tracking-[0.25em] uppercase opacity-80">
              Press & Hold 5s
            </span>
          </div>
        )}
      </button>

      {/* Micro copy for the futuristic workflow */}
      <div className="mt-2 text-center text-xs text-muted-foreground space-y-1">
        {!hasDispatched ? (
          <p className="tracking-wide uppercase">
            5 → 4 → 3 → 2 → 1 → <span className="font-semibold">SOS Blast</span>
          </p>
        ) : (
          <p className="tracking-wide uppercase">
            Responders en route • AR bubble & live ETA available
          </p>
        )}
      </div>
    </div>
  );
}
