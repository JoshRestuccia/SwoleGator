# SwoleGator
CEN3907C Design Project - SwoleGator 

## Download & Run Program

- Steps (Hardware):
  1. Download Arduino IDE
  2. Download "Windows drivers" (not universal) from https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers?tab=downloads and install with the x64.exe file.
  3. Download the board to Arduino IDE with this tutorial https://randomnerdtutorials.com/getting-started-with-esp32/.
  4. Download the program in the "Pre-Alpha" folder called "Send_IMU_BLE_App.ino" and upload it to the ESP32 using Arduino IDE and a micro USB connection.
  5. (If needed) Reset the microcontroller by hitting the "EN" button to reset the connection.
- Steps (Software):
  1. Follow directions included in "Application ReadMe" to download app using react-native
  2. Once downloaded, the follow instructions in the app to connect to hardware using BLE and view output data

## Completed Work
- Implemented ESP32-WROOM-32 and MPU6050 I2C communication to send accelerometer data from IMU to ESP32 continuously
- Implemented Bluetooth-Low-Energy functionality on the Arduino side to set up BLE characteristics of ESP32 so that it's recognized by other devices.
- Implemented Bluetooth-Low-Energy functionality on the simulated app made with Thunkable platform to connect to ESP32 device.
- Implemented continuous accelerometer data transmission and handling on the app.
- Implemented real-time graphing of the accelerometer data by integrating QuickChart.
- Created Firebase Project for user Authentication.
- Integrate React Native Firebase into app for login/signup.
- Created a signup screen where users include their credentials and these credentials are then saved in the Firebase database.
- Started implementation of React Native app. Successfully scans for nearby BLE devices.
- Started implementation of UI for the React Native app
- more detailed descriptions included on Trello https://trello.com/b/A4x3SKxs/swolegator

## Limitations & Bugs
- React Native app ssuccessfully connects to hardware in BLE but displays as if not connected until using the button "retrieve connected peripherals"
- occasionally a bug in the hardware will cause a BLE disconnection

## Project Architecture
The Pre-Alpha Build elements consist of an ESP32-WROOM-32 microcontroller and an MPU6050 IMU unit. These units are wired together through an I2C connection to send X, Y, and Z accelerometer data from the IMU to the ESP32. this communication protocol is implemented by using an MPU6050 library on Arduino IDE. The ESP32 then sends this data to the SwoleGator phone app made with Thunkable by utilizing BLE communication, which is set up by using a BLE library on Arduino IDE. The app is set up so that it only connects to the device with the name "MyESP32" by clicking the "Connect" button. The ESP32 continuously transmits data received from the IMU to the app through the implementation of a loop/timer by clicking the "Receive" button. The app continuously reads this data and plots it using a line graph from QuickChart. The app also has a signup page where the users can add their credentials (email and password). These credentials are then stored in a Firebase database. 


