# **App Name**: Limpopo Guardian

## Core Features:

- SOS Trigger & Dispatch: One-tap large red SOS button to instantly alert emergency contacts and provincial command with live location, audio, and video streams. Initiates responder dispatch.
- AI Hotword Detection: Always-listening background mode uses AI to detect predefined emergency phrases ('Provincial Intelligent Safety Emergency' or 'emergency'), automatically triggering alerts and a deterrent audio.
- Live Journey Tracking & Dual Camera: Interactive map with live user position, glowing neon routes, and real-time overlays for hazards. Continuously records road and cabin views via dual-camera for incident context, ensuring minimal battery drain.
- Real-time Alerts & Geo-Fencing: Receive immediate push notifications and visual alerts via Firebase from provincial command (e.g., 'Pothole repairs ahead,' 'Cash heist 3km ahead'). Alerts trigger map pins and visual banners, integrating with AR rerouting.
- Augmented Reality Rerouting: AR camera view displays floating 3D arrows and textual guidance for reroutes based on detected alerts, such as 'Exit R81 – 1.2km,' providing intuitive navigational assistance.
- Emergency Profile Management: Securely manage personal medical information (allergies, blood type), emergency contacts (auto-call family), and vehicle registration for quick access by first responders.
- Responder ETA & Live Tracking: Displays real-time ETA and live GPS tracking of dispatched emergency responders on the map, along with their unit identification and confirmation of bodycam streaming where applicable.

## Style Guidelines:

- Dark color scheme to reflect premium, modern, and lifesaving intent. Primary accent: Vivid Electric Violet (#9900FF), suggesting glowing intelligence and futuristic tech. Background: Deep Indigo-Gray (#19191F), a desaturated variant of the primary hue for a calm, professional backdrop. Secondary Accent: Bright Electric Blue (#0066FF), providing high contrast for crucial information and glowing elements like map routes.
- A single sans-serif font, 'Inter,' is recommended for all text. Its modern, machined, and neutral aesthetic provides excellent readability across various content types, aligning with a high-tech, functional user interface. Note: currently only Google Fonts are supported.
- Use high-contrast, flat, and sharp line-art or subtly filled icons to complement the overall clean and minimalistic design. Icons should be easily discernible against the dark theme and clearly communicate their function.
- Clean card-based design with a consistent 16px border radius on all interactive elements and content containers. Utilise large touch targets and ensure high contrast (WCAG AA compliant) for optimal usability. Implement a bottom navigation bar (Home, Journey, Alerts, Profile) with smooth fade-through transitions for content.
- All animations must be physics-based and lively: springy scale for button presses (stiffness 150, damping 12), gravity-drop for alerts and modals (velocity 200), ripple effect on SOS tap with friction slowdown. Incorporate a pulsing voice circle (scale 1.0 to 1.05 with easeInOut repeat), smooth fade-through page transitions, stagger-fade for lists, and subtle Lottie pulses for status indicators.