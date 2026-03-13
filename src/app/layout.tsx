import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FamilyAlertHandler } from '@/components/family-alert-handler';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Provincial Intelligent Safety',
  description: 'Your 24/7 Guardian Angel for Limpopo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgImage = PlaceHolderImages.find((img) => img.id === 'app-background');

  return (
    <html lang="en" className="dark">
      <body className={cn('relative min-h-screen bg-background font-sans antialiased', inter.variable)}>
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt={bgImage.description}
                data-ai-hint={bgImage.imageHint}
                fill
                className="object-cover blur-xl brightness-[.3]"
            />
        )}
        <div className="relative z-0">
          {children}
        </div>
        <Toaster />
        <FamilyAlertHandler />
      </body>
    </html>
  );
}
