import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import type { Alert } from '@/lib/types';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Cash Heist 3km Ahead',
    description: 'A cash-in-transit heist has been reported on the R81. Authorities are on scene. Please avoid the area.',
    timestamp: '2024-07-29T14:30:00Z',
    thumbnailUrl: PlaceHolderImages.find((img) => img.id === 'alert-thumbnail')?.imageUrl || '',
    location: 'R81, Polokwane',
  },
  {
    id: '2',
    title: 'Pothole Repairs Ahead',
    description: 'Road maintenance and pothole repairs are causing delays on the N1 North. Expect a 15-minute delay.',
    timestamp: '2024-07-29T13:45:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/pothole/200/150',
    location: 'N1 North, near Mokopane',
  },
  {
    id: '3',
    title: 'Accident Reported',
    description: 'Minor collision involving two vehicles. No serious injuries reported, but traffic is slow.',
    timestamp: '2024-07-29T12:10:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/collision/200/150',
    location: 'Thabo Mbeki St, Polokwane',
  },
  {
    id: '4',
    title: 'Community Protest Action',
    description: 'A protest is underway near the Mall of the North. Roads are blocked. Use alternative routes.',
    timestamp: '2024-07-28T09:05:00Z',
    thumbnailUrl: 'https://picsum.photos/seed/protest/200/150',
    location: 'Mall of the North, Polokwane',
  },
];


function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds} seconds ago`;
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}

export default function AlertsPage() {
  return (
    <div className="container mx-auto p-4 md:p-0">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Recent Alerts</h1>
        <p className="text-muted-foreground">Live and recent incidents in your area.</p>
      </header>
      <div className="grid gap-6">
        {mockAlerts.map((alert, index) => (
          <Card
            key={alert.id}
            className="shadow-none animate-stagger-fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
          >
            <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
                <div className="space-y-1">
                    <CardTitle>{alert.title}</CardTitle>
                    <CardDescription>{alert.description}</CardDescription>
                </div>
                <div className="relative h-[110px] w-[110px] rounded-lg overflow-hidden">
                    <Image src={alert.thumbnailUrl} alt={alert.title} fill className="object-cover" data-ai-hint="road incident" />
                </div>
            </CardHeader>
            <CardFooter>
                <div className="flex text-sm text-muted-foreground items-center justify-between w-full">
                    <div className="flex items-center">
                        <MapPin className="mr-1 h-3 w-3"/>
                        {alert.location}
                    </div>
                    <time dateTime={alert.timestamp}>{formatTimeAgo(alert.timestamp)}</time>
                </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
