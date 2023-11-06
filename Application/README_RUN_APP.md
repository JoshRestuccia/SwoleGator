# RUNNING THE SWOLEGATOR APPLICATION

#### IMPORTANT NOTE: Depenging on where you installed the Android SDK and Java on your system, some system level variables may need to be set differently than what is set in this codebase. Please ensure the following system environment variables are set: 
1. JAVA_HOME
2. ANDROID_HOME
3. Path (add element to include path to adb.exe so we can use it in command line)
##### EXAMPLES:
1. JAVA_HOME=`C:\Program Files (x86)\Java\jdk-11` 
2. ADROID_HOME=`C:\AndroidStudio`
3. Path=`C:\Program Files (x86)\Java\jdk-11` AND `C:\Program Files (x86)\Java\jdk-11`
* NOTE: these are my paths and yours will likely be different.
#### You may also need to change the path in [this file](./android/local.properties) to the path that points to your Android SDK (which should match the ANDROID_HOME system environment variable) 
#### MAKE SURE TO USE DOUBLE BACKSLASH (I DONT KNOW WHY BUT THIS CAUSED ME A TON OF PROBLEMS)


## Installations
1. After doing the above, ensure you have node installed by running `node --version`
2. Ensure adb is seen by the system environment by running `adb`

## Running the Application on a Physical Device
1. Put phone into developer mode
2. Plug in and in PowerShell run the following command and ensure you see the device `adb devices`
   * Take note of the device ID listed by adb.
3. Navigate to ./SwoleGator/Application and run `npm install`
4. Run the following command in a PowerShell terminal
   * `npx react-native run-android --deviceId <The device Id shown with adb devices>`  

## Running the Application on Android Emulator
1. Start the Emulator by opening Android Studio and navigating to the Virtual Device Manager.
2. Create an emulator or use one you have already created.
3. Ensure adb has access to the device by running `adb devices` in PowerShell
   * Take note of the device ID listed by adb. 
4. Navigate to ./SwoleGator/Application and run `npm install`
5. Run the following command in a PowerShell terminal
   * `npx react-native run-android --deviceId <The device Id shown with adb devices>` 