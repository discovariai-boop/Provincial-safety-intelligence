'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import React, { useRef, useState } from 'react';
import { Upload, Shield, User } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  idNumber: z.string().length(13, 'South African ID number must be 13 digits.'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function WelcomePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', idNumber: '', phone: ''},
    mode: 'onChange',
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'Profile Created!',
      description: 'Welcome to Provincial Intelligent Safety. Your profile is set up.',
    });
    console.log(data);
    // In a real app, you would redirect to the main dashboard here
    // e.g., router.push('/');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
                <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle>Welcome to Your Guardian</CardTitle>
            <CardDescription>Create your profile to activate your 24/7 protection. This information is vital for emergency services.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col items-center gap-4">
                  <div className='relative'>
                    <Avatar className="h-24 w-24 border-2 border-primary/50">
                      <AvatarImage src={avatarPreview || ''} />
                      <AvatarFallback>
                        <User className="h-10 w-10 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      type="button" 
                      size="icon" 
                      variant="outline"
                      className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                      onClick={() => fileInputRef.current?.click()}
                      >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleAvatarChange} 
                      className="hidden" 
                      accept="image/*"
                    />
                  </div>
                  <FormDescription>Upload your headshot</FormDescription>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>South African ID Number</FormLabel>
                      <FormControl>
                        <Input placeholder="13-digit ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mobile Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 0821234567" {...field} />
                      </FormControl>
                       <FormDescription>We'll use this to contact you in an emergency.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <p className="text-xs text-muted-foreground text-center pt-2">
                    By clicking "Activate Protection", you agree to our Terms of Service.
                </p>

                <Button type="submit" className="w-full" size="lg">Activate Protection</Button>

                <div className='text-center'>
                    <Button variant="link" asChild>
                        <Link href="/">I already have an account</Link>
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );
}
