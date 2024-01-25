# SwoleGator Alpha Build
James Blackmon
Maria Carmona
Joshua Restuccia
Jenna Sheldon
Mary Williams

## Usability
### Interface
All interface elements have been implemented and are accessible. At this point, the UI is entirely contained in the software elements, with an intuitive app that is able to connect to the hardware remotely. The app has a simple login and usage interface, with clear buttons and responses as with any other app. In addition, persistent state is evident in the highlight of buttons (such as the ESP32 once it hs been connected remaining a darker color) and pages on the app such as the graphing consistently sending calls in order to update and display data.
### Navigation
The app now begins at the login state and the user is able to login and navigate between functional screens, starting a lift or connecting to the device through bluetooth on different pages, and then logout and navigate back and forth. This is all built to be easily understood and accesible to users. Progress has been made from ongoing bug related to delayed response to button presses, and should be improved as we continue to improve rendering of screens. Every feature is easily discovered from the home page. Popups are also in the process of being improved to make errors more easily understood by users.
### Perception
The app and device are very intuitive and easy to use for intended purpose. The context of logging in, connecting to the device, and beginning the lift makes logical sense and is easy to follow. The buttons are easily visually understood, and since the hardware requires no interaction through button presses/ other physical interaction, it reduces frustration from the user. Application state changes with logged in users/ guests, as well as connected and disconnected device being persistently accessible on the "connect device" screen.
### Responsiveness
So far in the building of our application, no busy wait loops have been discovered. The bluetooth search feature continues for a defined amount of time, and displays that it is searching until it finishes, reducing confusion from the user. 
## Build Quality 
### Robustness
No major crashes or glitches are apparent in this build. The app connects to Bluetooth for an extended period of time and is able to continuously receive and store data, as well as display the data on the app screens. Any delay from rendering does not block background processes and is being improved upon as data display is optimized. In addition, bluetooth calls between software and hardware do not cause any waiting loops, even if the connection breaks.
### Consistency
There is consistency in the software aspects of logins and app behavior in our build. The app will predictably find our device to connect to, and only our app. The hardware aspect is calibrated with each use to ensure consistency in measurements from sensors. 
### Aesthetic Rigor
No major cosmetic sofware issues are currently present. A bug that did not show all of the buttons redirecting to various pages was addressed and fixed in this alpha build.  The app successfully displays useful values to the user, including max veloocity and rep count for the exercise, and plans are in place to visually improve chosing an exercise. As for the physical artifact, it was made into a compact design for attachment to the weight bar that can be printed and tested in order to be perfected in the beta build.
## Vertical Features
### External Interface
- User Profiles
- Exercise Type & Calibration
  
### Persistent State
- User Profiles
- Exercise Type & Calibration
- 
### Internal Systems
- User Profiles
- Exercise Type & Calibration

