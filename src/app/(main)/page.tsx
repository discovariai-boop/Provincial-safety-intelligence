import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, Map, Mic } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Dashboard() {
  const mapPreviewImage = PlaceHolderImages.find((img) => img.id === 'map-preview');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Provincial Intelligent Safety</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-green-400">Protected</span>
          <div className="relative h-4 w-4">
            <div className="absolute h-full w-full rounded-full bg-green-500 animate-ping"></div>
            <div className="h-full w-full rounded-full bg-green-500"></div>
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full bg-destructive/20 animate-pulse-scale"></div>
          <Button
            variant="destructive"
            className="relative w-56 h-56 md:w-72 md:h-72 rounded-full text-3xl md:text-4xl font-bold shadow-none hover:scale-105 active:scale-95 transition-transform"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            SOS
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <Card className="md:col-span-2 shadow-none transition-transform hover:scale-[1.02]">
            <CardHeader>
              <CardTitle>Live Journey</CardTitle>
            </CardHeader>
            <CardContent>
              {mapPreviewImage && (
                <Image
                  src={mapPreviewImage.imageUrl}
                  alt={mapPreviewImage.description}
                  data-ai-hint={mapPreviewImage.imageHint}
                  width={800}
                  height={600}
                  className="rounded-lg object-cover aspect-[4/3]"
                />
              )}
              <p className="mt-4 text-muted-foreground">Guardian Active: Monitoring Polokwane Routes.</p>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-6">
            <Link href="/journey">
              <Card className="shadow-none hover:bg-accent/50 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Start Journey</CardTitle>
                  <Map className="w-6 h-6 text-accent" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Activate full protection mode.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/journey#voice-emergency">
              <Card className="shadow-none hover:bg-accent/50 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">Voice Emergency</CardTitle>
                  <Mic className="w-6 h-6 text-accent" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Use your voice to call for help.</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/alerts">
              <Card className="shadow-none hover:bg-accent/50 transition-colors h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">View Alerts</CardTitle>
                  <Bell className="w-6 h-6 text-accent" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">See recent safety notifications.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
