'use client';

import { contextualVoiceAssistant, type ContextualVoiceAssistantOutput } from '@/ai/flows/contextual-voice-assistant-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, LoaderCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

export function VoiceAssistant() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<ContextualVoiceAssistantOutput | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: 'destructive',
        title: 'Browser Not Supported',
        description: 'Your browser does not support voice recognition.',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setResponse(null);
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      toast({
        variant: 'destructive',
        title: 'Voice Recognition Error',
        description: event.error,
      });
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [toast]);

  const handleVoiceCommand = async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const location = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const res = await contextualVoiceAssistant({
        question,
        currentLocation: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        routeContext: 'N1 Northbound',
      });
      setResponse(res);
    } catch (error) {
      console.error(error);
      let errorMessage = 'Failed to get AI response.';
      if (error instanceof GeolocationPositionError) {
        errorMessage = `Geolocation error: ${error.message}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      handleVoiceCommand(transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]);


  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };
  
  return (
    <Card className="shadow-none w-full max-w-lg mx-auto" id="voice-emergency">
      <CardHeader>
        <CardTitle className="text-center">Voice Emergency</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground text-center">
          Tap the button and speak your emergency.
          <br />
          e.g., "There's an accident ahead" or "Is the R81 safe?"
        </p>

        <Button
          onClick={toggleListening}
          size="icon"
          className="w-24 h-24 rounded-full bg-accent hover:bg-accent/90 relative transition-all duration-300 ease-in-out"
        >
          {isListening && <div className="absolute inset-0 rounded-full bg-accent/50 animate-pulse-scale" />}
          {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
        </Button>

        <div className="w-full min-h-[80px] p-4 rounded-lg bg-background border border-border flex items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-center text-foreground font-medium">
              {response ? response.answer : (transcript || '...') }
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
