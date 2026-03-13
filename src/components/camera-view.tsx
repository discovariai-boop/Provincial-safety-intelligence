'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CameraOff, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function CameraView({ title, facingMode }: { title: string; facingMode: 'user' | 'environment' }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let stream: MediaStream;
    const getCameraStream = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported.');
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        console.error(`Error accessing ${facingMode} camera:`, err);
        setHasPermission(false);
        if (err instanceof Error && (err.name === 'NotAllowedError' || err.name === 'NotFoundError')) {
          // Don't toast for permission denied or not found, as the user actively denied it or camera doesn't exist.
          // The UI will show the 'camera off' state.
        } else {
          toast({
            variant: 'destructive',
            title: `Camera Error (${title})`,
            description: `Could not access the ${facingMode === 'user' ? 'cabin' : 'road'} camera.`,
          });
        }
      }
    };

    getCameraStream();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode, title]);

  return (
    <Card className="w-48 md:w-56 bg-black/60 backdrop-blur-sm border-white/20 text-white pointer-events-auto shadow-lg">
      <CardContent className="p-0 relative aspect-video">
        <p className="absolute top-2 left-3 z-10 text-sm font-bold">{title}</p>
        <video ref={videoRef} className="w-full h-full object-cover rounded-lg" autoPlay playsInline muted />
        {hasPermission === null && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
            <LoaderCircle className="w-8 h-8 text-muted-foreground animate-spin" />
          </div>
        )}
        {hasPermission === false && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg">
            <CameraOff className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs text-muted-foreground mt-1 text-center px-2">Camera unavailable</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
