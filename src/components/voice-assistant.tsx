'use client';

import { contextualVoiceAssistant, type ContextualVoiceAssistantOutput } from '@/ai/flows/contextual-voice-assistant-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, LoaderCircle, ShieldAlert } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';

const HOTWORD = 'guardian';

export function VoiceAssistant() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState<ContextualVoiceAssistantOutput | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [hotwordDetected, setHotwordDetected] = useState(false);

  const handleVoiceCommand = useCallback(async (question: string) => {
    if (!question.trim()) return;

    setIsLoading(true);
    setResponse(null);
    setTranscript(question); // Show the question being processed

    try {
      const location = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
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
      setResponse({ answer: "Sorry, I couldn't get a response." });
    } finally {
      setIsLoading(false);
      setHotwordDetected(false); // Reset hotword detection
    }
  }, [toast]);

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
    recognition.continuous = true; // Listen continuously
    recognition.interimResults = false; // Only get final results
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      // Automatically restart listening unless it was manually stopped
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    };
    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
      }
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript.trim().toLowerCase();

      if (hotwordDetected) {
        // If hotword was just said, the next phrase is the command
        handleVoiceCommand(text);
      } else if (text.includes(HOTWORD)) {
        // Hotword detected, now wait for the command
        setHotwordDetected(true);
        setTranscript(`Guardian is listening...`);
        // We don't need to call the AI yet, just wait for the next result.
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // prevent restart on unmount
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotwordDetected, handleVoiceCommand]);

  const toggleListeningManually = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setHotwordDetected(true); // Manually activate listening for command
      setTranscript('Guardian is listening...');
      recognitionRef.current.start();
    }
  };
  
  return (
    <Card className="shadow-none w-full max-w-lg mx-auto" id="voice-emergency">
      <CardHeader>
        <CardTitle className="text-center">Voice Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        <p className="text-muted-foreground text-center">
          Say <span className="font-bold text-foreground">"{HOTWORD}"</span> then ask a question,
          <br />
          or tap the button to speak.
        </p>

        <Button
          onClick={toggleListeningManually}
          size="icon"
          className="w-24 h-24 rounded-full bg-accent hover:bg-accent/90 relative transition-all duration-300 ease-in-out"
        >
          {hotwordDetected && <div className="absolute inset-0 rounded-full bg-blue-500/50 animate-pulse-scale" />}
          {isListening ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10" />}
        </Button>

        <div className="w-full min-h-[80px] p-4 rounded-lg bg-background border border-border flex items-center justify-center">
          {isLoading ? (
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          ) : (
            <p className="text-center text-foreground font-medium">
              {response ? response.answer : (transcript || 'Say "Guardian" to start...') }
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
