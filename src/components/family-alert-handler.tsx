'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

// This is a placeholder. In a real app, you'd use a global state management
// or an event bus driven by Firebase Cloud Messaging.
const useFamilyAlert = () => {
  const [alert, setAlert] = useState<any | null>(null);

  useEffect(() => {
    // Demo: Trigger an alert after 15 seconds for demonstration purposes
    const timer = setTimeout(() => {
      setAlert({
        memberName: 'John Doe',
        location: 'N1 KM45, near Polokwane',
        requestType: 'Ambulance',
        eta: '4min 12s',
      });
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return { alert, clearAlert: () => setAlert(null) };
};


export function FamilyAlertHandler() {
  const { alert, clearAlert } = useFamilyAlert();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (alert) {
      setIsExiting(false);
    }
  }, [alert]);
  
  if (!alert) {
    return null;
  }

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
        clearAlert();
    }, 500);
  }

  return (
    <div 
        className={cn(
            "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm",
            "animate-in fade-in-0",
            isExiting && "animate-out fade-out-0"
        )}
    >
      <div className={cn(
        "absolute inset-0 z-0 h-full w-full bg-gradient-to-br from-red-500/80 via-green-500/60 to-red-500/80",
        "animate-[screen-flash_1.5s_ease-in-out_infinite]"
      )}></div>
      
      <Card className={cn(
        "relative z-10 w-[90vw] max-w-md border-2 border-primary/50 shadow-2xl",
        "animate-in zoom-in-90 duration-500"
        )}>
        <CardHeader>
          <CardTitle className="text-3xl text-center text-primary">Family Alert!</CardTitle>
          <CardDescription className="text-center text-lg">
            {alert.memberName} has triggered an emergency alert.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
            <div className='text-center'>
                <p><span className='font-bold'>Location:</span> {alert.location}</p>
                <p><span className='font-bold'>Request:</span> {alert.requestType}</p>
                <p className='text-2xl font-bold mt-2'>ETA: {alert.eta}</p>
            </div>
            <div className="flex justify-around gap-4 mt-4">
                <Button variant="outline" className="flex-1 gap-2">
                    <Video/> View Clip
                </Button>
                 <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                    <Phone /> Stay on Call
                </Button>
            </div>
             <Button variant="ghost" onClick={handleClose} className='mt-4'>
                Dismiss
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
