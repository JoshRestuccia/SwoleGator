# SwoleGator Alpha Build
James Blackmon
Maria Carmona
Joshua Restuccia
Jenna Sheldon
Mary Williams

Repository Link: https://github.com/JoshRestuccia/SwoleGator

## Project Summary
At the time of the Alpha Build, the SwoleGator device successfully measures velocity and repetition count of the motion done by a weightlifter. It communciates this data to the SwoleGator application through Bluetooth to be displayed and stored to the user's profile in the application. The app features functional profile login and logout, the ability to view a user's profile, connect to the SwoleGator device, and view lift data in real time. The application is also setup to eventually feature a social environment, where users can post their lifts to be viewed and shared by friends or trainers. In addition, while the hardware only measures a single direction of velocity, in the future it will be calibrated by exercise type to measure the useful velocity of that particular exercise to be a more widely adaptable and useful product. 

## Navigation & Other Useful Instructions
The application opens to a login screen, where the user can choose to login with an existing account or create a new account. Once either of these actions is completed, the user is taken to a home screen. On this screen, the user should connect to the hardware device using the top button, titled "connect device". This is as simple as clicking "scan for devices" and then clicking on the SwoleGator option when it pops up. The application will only display a compatible SwoleGator device to avoid connections to extraneous Bluetooth devices in the area. Once connected, the SwoleGator button will change colors, showing successful connection. The user can then go back to the home screen and navigate to "start lift", where they will choose an exercise type and follow instructions for calibration, and then begin their lift and view lift data in real time. Once a lift has been completed, the user can return to the homescreen once again and view their profile to see all past lift data. The final button is a logout option, which is self-explanatory to users.


# Alpha Build Required Components
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
- User Profiles are able to be created, accessed, logged in and out of in a persistent state format through firebase. Profile is visible and will contain historical lift data. If logged in, the app acknowledges user by name, and otherwise displays a guest message. 
- Exercise Type & Calibration is visible on external interface, and will remain as lift is performed and data is gathered that is then stored to profile for future use. These options are shown as the user chooses the begin lift option.
- Maximum Velocity & Repetition Count are displayed in the app as lift is in progress, giving the user useful feedback on their exercise. This is stored in persistent state for future use and analysis.
- Device Connection to the physical hardware is performed on one screen and remains as other screens are navigated to and data is gathered and displayed.
  
### Persistent State
- User Profiles are stored in firebase, so that an account created in one use of the app can be accessed and edited in a future use. The data is not wiped after each lift, instead stored so that profiles can be useful in long term to show trends. Ideally this will be expanded upon to display to other users in social features. User profiles are processed within the software internal systems.
- Exercise Type & Calibration is stored as it affects the way that velocity is measured within internal systems and the users' goals. This data is stored in firebase persistent state as well, to show specific trends per exercise.
- Maximum Velocity & Repetition Count is stored to the profiles as well as exercise type, again to see trends and improvement over time, which is the main usefulness of our device- to track improvement (or any change) over time and assess their fitness. This data is calculated in internal systems based on sensors within the hardware.
- Device connection to the physical hardware is persistent in that once connected, the chip showing the SwoleGator device name remains a different color. We hope to eventually implement an icon that is visible on all screens of the app to show this state, which will take place as a process in internal systems.
### Internal Systems
- User Profiles are processed within the software communicating with firebase, allowing for the account creation, logging in and logging out. The profile is able to remain logged in on the same device by storing the profile in internal systems of the software. The profile and data attached is used to calculate goals for the user and eventually to communicate with other accounts in a social environment hosted within the app.
- Exercise Type & Calibration changes how velocity is processed and reps are counted. For example, different exercises have different directions of velocity that are important and will have different goals over time. This calibration isinitiated by the software within the app, and affects the handling of the data performed in the arduino code on the esp32.
- Maximum Velocity & Repition Count is performed, along with calibration, on the arduino side on the hardware. This data is then sent to the application through bluetooth to be displayed and stored, as well as analyzed to allow the user to create and track goals. As the app is perfected there will ideally be more calculations performed on the data with different exercises to give recommendations.
- Device connection between the application and esp32 is handled through bluetooth connection code in the software and attributes given in the hardware side. It is stored in persistent state and used to display to the user the connection, and whether or not this connection has been broken, which is processed through the internal systems.

