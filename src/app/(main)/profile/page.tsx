'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
});

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  idNumber: z.string().length(13, 'South African ID number must be 13 digits.'),
  bloodType: z.string().min(1, 'Blood type is required (e.g., A+, O-).'),
  allergies: z.string().optional(),
  vehicleReg: z.string().min(3, 'Vehicle registration is required.'),
  emergencyContacts: z.array(emergencyContactSchema).min(1, 'At least one emergency contact is required.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: 'John Doe',
  idNumber: '8501015800087',
  bloodType: 'O+',
  allergies: 'Peanuts',
  vehicleReg: 'JG 12 PX GP',
  emergencyContacts: [{ name: 'Jane Doe', phone: '0821234567' }],
};

export default function ProfilePage() {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
    mode: 'onChange',
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
    console.log(data);
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your personal and emergency information. This data is encrypted and shared only during an emergency.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>ID Number</FormLabel>
                    <FormControl>
                      <Input placeholder="990101..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator/>

            <CardTitle className="text-lg">Medical Information</CardTitle>
            <div className="grid md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="bloodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., O+, AB-" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="allergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Penicillin, Peanuts" {...field} />
                    </FormControl>
                    <FormDescription>Leave blank if none.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator/>
            
            <CardTitle className="text-lg">Vehicle Information</CardTitle>
            <FormField
              control={form.control}
              name="vehicleReg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Registration</FormLabel>
                  <FormControl>
                    <Input placeholder="AB 12 CD GP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator/>

            <CardTitle className="text-lg">Emergency Contact</CardTitle>
            <div className="grid md:grid-cols-2 gap-8">
                <FormField
                    control={form.control}
                    name="emergencyContacts.0.name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="emergencyContacts.0.phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                        <Input placeholder="082..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>


            <Button type="submit">Save Changes</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
