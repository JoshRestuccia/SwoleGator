#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <floatToString.h>
//#include <elapsedMillis.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
Adafruit_MPU6050 mpu;
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "00001800-0000-1000-8000-00805f9b34fb"
struct Button {
  const uint8_t PIN;
  bool pressed;
};

Button calb = {23, false};

const int WINDOW_SIZE = 100;
// Filter Variables
int ind = 0;
int totalx = 0;
int READX[WINDOW_SIZE];
int averagex = 0;
int totaly = 0;
int READY[WINDOW_SIZE];
int averagey = 0;
int totalz = 0;
int READZ[WINDOW_SIZE];
int averagez = 0;

//Velocity variables
float prevvx = 0;
//elapsedMillis timeElapsed;
unsigned long starttime = 0;
unsigned long elapsedtime = 0;
float prev;
float av = 0;
float x_aa = 0;
float maxx = 0.0;
float minn = 0.0;
float currv[10];
float currvx[30];
float reps = 0;
float t;
float vv;
int state = 0;
int orn;

static BLECharacteristic *pCharacteristicx;
//static BLECharacteristic *pCharacteristicy;
//static BLECharacteristic *pCharacteristicz;
class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();

      if (value.length() > 0) {
        for (int i = 0; i < value.length(); i++)
          Serial.print(value[i]);

        Serial.println();
      }
    }
};
int orientation(float accx, float accy, float accz){
  if ((accx >= -10.00) && (accx <= -7.00)){
    Serial.println("Negative x");
    return 0;
  }
  else if ((accx >= 7.00) && (accx <= 10.00)){
    Serial.println("Positive x");
    return 1;
  }
  else if ((accy >= -10.00) && (accy <= -7.00)){
    Serial.println("Negative y");
    return 2;
  }
  else if ((accy >= 7.00) && (accy <= 10.00)){
    Serial.println("Positive y");
    return 3;
  }
  else if ((accz >= -10.00) && (accz <= -7.00)){
    Serial.println("Negative z");
    return 4;
  }
  else {
    Serial.println("Positive z");
    return 5;
  }
}
void calibrate(int ori){
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float x_a = a.acceleration.x;
  float z_a = a.acceleration.z;
  float y_a = a.acceleration.y;
  if ((ori == 0)) { //-x, -y
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float x_a = a.acceleration.x;
      totalx = totalx - READX[ind];
      READX[ind] = x_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) + 81.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
  else if (ori == 2) { // -y
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float y_a = a.acceleration.y;
      totalx = totalx - READX[ind];
      READX[ind] = y_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) + 81.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;

  }
  else if (ori == 1){ // +x
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float x_a = a.acceleration.x;
      totalx = totalx - READX[ind];
      READX[ind] = x_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) - 81.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
  else if (ori == 3) { // +y
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float y_a = a.acceleration.y;
      totalx = totalx - READX[ind];
      READX[ind] = y_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) - 81.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
  else if (ori == 4) { // -z
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float z_a = a.acceleration.z;
      totalx = totalx - READX[ind];
      READX[ind] = z_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) + 72.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
  else { // +z
    for (int n = 0; n < 10; n++){
      // Moving average filter
      float z_a = a.acceleration.z;
      totalx = totalx - READX[ind];
      READX[ind] = z_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001); // rate of change 
      prevvx = currv[n];
    }
    vv = ((currv[9] - currv[0]) * 1000) - 90.0; // velocity from rate of change
    Serial.print("v: ");
    Serial.println(vv);
    if (vv > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = vv;
      Serial.print("max: ");
      Serial.println(maxx);
    }
    if (vv < minn){ // if less than minimum, set as min
      minn = vv;
      Serial.print("min: ");
      Serial.println(minn);
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
}

int cal(){
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  float x_a = a.acceleration.x;
  float z_a = a.acceleration.z;
  float y_a = a.acceleration.y;
  bool st = false;
  Serial.println("Detecting Orientation in 5 seconds");
  delay(5000);
  int orient = orientation(x_a, y_a, z_a);
  Serial.println("Starting calibration in 5 seconds...");
  delay(5000);
  while (st == false){
    elapsedtime = millis() - starttime;
    if (elapsedtime < 30000) {
      calibrate(orient);
    }
    else {
      st = true;
    }
  }
  t = (maxx + minn) / 2.0;
  return orient;
}

void setup() {
  Serial.begin(115200);
  while (!Serial)
    delay(10);
  for (int i = 0; i < WINDOW_SIZE; i++){
    READX[i] = 0;
    READY[i] = 0;
    READZ[i] = 0;
  }
  
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setFilterBandwidth(MPU6050_BAND_5_HZ);
  BLEDevice::init("SwoleGator");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristicx = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  /**pCharacteristicy = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pCharacteristicz = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );**/
  pCharacteristicx->setValue("Hello SwoleGator");
  pService->start();
  // BLEAdvertising *pAdvertising = pServer->getAdvertising();  // this still is working for backward compatibility
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Characteristic defined!");
  pinMode(calb.PIN, INPUT_PULLUP);
  delay(100);
}

void loop() {
  // put your main code here, to run repeatedly:
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float xx_a = a.acceleration.x;
  float y_a = a.acceleration.y;
  float z_a = a.acceleration.z;
  char S[15];
  char x[50];
  char y[15];
  char z[15];
  char del[15];
  if (digitalRead(calb.PIN) == LOW){
    calb.pressed = true;
  }
  if (calb.pressed){ // calibrate when button is pressed
    // restart threshold variables and rep counter
    maxx = 0;
    minn = 0;
    reps = 0;
    starttime = millis();
    orn = cal();
    calb.pressed = false;
  }
  //Stores 10 velocity values in array
  else {
    if ((orn == 0)) { //-x, -y
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float x_a = a.acceleration.x;
        totalx = totalx - READX[ind];
        READX[ind] = x_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) + 81.0; // velocity from rate of change
    }
    else if (orn == 2) { // -y
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float y_a = a.acceleration.y;
        totalx = totalx - READX[ind];
        READX[ind] = y_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) + 81.0; // velocity from rate of change
    }
    else if (orn == 1){ // +x
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float x_a = a.acceleration.x;
        totalx = totalx - READX[ind];
        READX[ind] = x_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) - 81.0; // velocity from rate of change
    }
    else if (orn == 3) { // +y
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float y_a = a.acceleration.y;
        totalx = totalx - READX[ind];
        READX[ind] = y_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) - 81.0; // velocity from rate of change
    }
    else if (orn == 4) { // -z
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float z_a = a.acceleration.z;
        totalx = totalx - READX[ind];
        READX[ind] = z_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) + 72.0; // velocity from rate of change
    }
    else { // +z
      for (int n = 0; n < 10; n++){
        // Moving average filter
        float z_a = a.acceleration.z;
        totalx = totalx - READX[ind];
        READX[ind] = z_a;
        totalx = totalx + READX[ind];
        ind = ind + 1;
        if (ind >= WINDOW_SIZE){
          ind = 0;
        }
        averagex = totalx / WINDOW_SIZE;
        currv[n] = (prevvx + (averagex)*0.001); // rate of change 
        prevvx = currv[n];
      }
      vv = ((currv[9] - currv[0]) * 1000) - 90.0; // velocity from rate of change
    }

    if (state == 0 && vv > t){ // if current velocity goes above threshold, increase rep
      state = 1;
      reps = reps + 1;
    }
    if (state == 1 && vv < t - 10){ //if below, set state to 0 (ready for new rep count)
      state = 0;
    }
    for (int k = 0; k < 10; k++){ // reset array of rates to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;

    // Sends max velocity, reps, and current velocity separated by delimeter in that order
    strcpy(x, floatToString(maxx, S, sizeof(S), 1));
    strcpy(y, floatToString(reps, S, sizeof(S), 1));
    strcpy(z, floatToString(vv, S, sizeof(S), 1));

    strcpy(del, ",");
    strcat(x,del);
    strcat(x,y);
    strcat(x,del);
    strcat(x,z);
    
    pCharacteristicx->setValue(x); // send over BLE (max v, reps, current v)
    
    Serial.print(x);
    Serial.print(" ");
    Serial.print(xx_a);
    Serial.print(" ");
    Serial.print(y_a);
    Serial.print(" ");
    Serial.print(z_a);
    Serial.print(" ");
    Serial.println(t);
  }
  
  delay(25);
}