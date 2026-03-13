import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Responder } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Smartphone } from 'lucide-react';
import { VoiceAssistant } from '@/components/voice-assistant';
import { DualCameraView } from '@/components/dual-camera-view';

export default function JourneyPage() {
  const fullMapImage = PlaceHolderImages.find((img) => img.id === 'full-map');

  const responder: Responder = {
    name: 'Constable Mthembu',
    unit: 'Unit 247',
    eta: '4min 12s',
    avatarUrl: PlaceHolderImages.find((img) => img.id === 'responder-avatar')?.imageUrl || '',
    isStreaming: true,
  };

  return (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 grid auto-rows-max items-start gap-4 md:gap-8">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Live Journey Map</CardTitle>
            <CardDescription>Real-time tracking with dual-camera AI monitoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {fullMapImage && (
                <Image
                  src={fullMapImage.imageUrl}
                  alt={fullMapImage.description}
                  data-ai-hint={fullMapImage.imageHint}
                  width={1200}
                  height={900}
                  className="rounded-lg object-cover aspect-video"
                />
              )}
              <DualCameraView />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Responder Status</CardTitle>
                <CardDescription>Help is on the way.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="hidden h-12 w-12 sm:flex">
                    <AvatarImage src={responder.avatarUrl} alt="Avatar" />
                    <AvatarFallback>{responder.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-lg font-medium leading-none">{responder.name}</p>
                    <p className="text-sm text-muted-foreground">{responder.unit}</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">{responder.eta}</p>
                    <p className="text-xs text-muted-foreground">ETA</p>
                </div>
              </div>
              
              <div className='space-y-2'>
                <Progress value={33} aria-label="Responder progress" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Dispatched</span>
                    {responder.isStreaming && (
                        <div className="flex items-center gap-1 text-blue-400">
                            <Smartphone className="h-3 w-3" />
                            <span>Bodycam Streaming</span>
                        </div>
                    )}
                    <span>Arriving</span>
                </div>
              </div>

            </CardContent>
          </Card>
      </div>

      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
        <VoiceAssistant />
      </div>
    </div>
  );
}
