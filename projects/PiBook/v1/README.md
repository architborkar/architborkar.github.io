Raspberry Pi 4B Monitor-Mounted Kiosk Dashboard

1. Project Overview
\nThis project is a compact, monitor-mounted smart display powered by a Raspberry Pi 4B. It acts as a dedicated kiosk dashboard that provides real-time information such as:
\nNews updates
\nCalendar events
\nStock market data
\nCustom widgets / dashboards
\nThe system is designed to sit neatly on top of a primary monitor, offering at-a-glance information without interrupting the main workflow.

2. Purpose
The primary goals of this project are:
Passive Information Display: View essential data continuously without switching tabs or devices
Productivity Enhancement: Keep track of meetings, schedules, and market movements in real time
Minimal Workspace Footprint: Utilize vertical monitor space instead of adding another screen on the desk
Customizability: Fully configurable dashboard tailored to personal needs

3. Key Features
Dedicated always-on display
Auto-boot into kiosk mode
Web-based dashboard (custom or hosted)
Clean cable management
3D-printed mounting system
Modular and upgradeable design

4. Hardware Components
Raspberry Pi 4B
Compact HDMI Display
MicroSD Card (OS + dashboard setup)
Power Supply (USB-C)
HDMI & USB cables
3D Printed Mount Assembly
Monitor clip mount
Display holder
Raspberry Pi enclosure
Adjustable support arm

5. Mechanical Design
The structure is fully 3D printed and consists of:
5.1 Monitor Mount Clip
Attaches securely to the top edge of the monitor
Designed to avoid damaging the screen
Provides stable support
5.2 Support Arm
Extends outward to position the display
Designed for rigidity and minimal vibration
5.3 Display Holder
Holds the screen at a comfortable viewing angle
Allows easy removal if needed
5.4 Raspberry Pi Enclosure
Mounted behind or above the setup
Provides ventilation and access to ports

6. Software Setup
6.1 Operating System
Raspberry Pi OS (Lite or Full)
6.2 Kiosk Mode Configuration
Auto-login enabled
Browser (Chromium) launches on boot
Full-screen mode with no UI distractions
Example startup behavior:
Boot → Auto login → Launch browser → Open dashboard URL
6.3 Dashboard Options
You can use:
Custom web dashboard (HTML/CSS/JS)
Tools like:
MagicMirror
Home Assistant dashboards
TradingView widgets
Google Calendar embed

7. Use Cases
7.1 Productivity
View upcoming meetings
Track tasks and reminders
7.2 Financial Monitoring
Live stock prices
Crypto tracking
Market trends
7.3 Information Display
News feeds
Weather updates
System stats
7.4 Smart Home Control (Optional)
Control IoT devices
Display sensor data

8. Advantages
No need for a second full monitor
Always-visible information
Low power consumption
Highly customizable
Clean and aesthetic setup

9. Limitations
Small screen size limits detailed interaction
Depends on stable internet for live data
Heat management needed for long uptime
Limited touch interaction (if non-touch display)

10. Future Improvements
Touchscreen integration
Voice assistant support
Gesture control
Dynamic screen rotation or tilting
Wireless power / cleaner cable routing
Custom PCB for power and cable management

11. Conclusion
This project transforms unused monitor space into a functional smart dashboard, improving productivity and accessibility of important information. It combines hardware design, 3D printing, and software automation into a practical everyday tool.
