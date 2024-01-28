#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>
#include <floatToString.h>

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/
Adafruit_MPU6050 mpu;
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "00001800-0000-1000-8000-00805f9b34fb"
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
unsigned long period = 60000; //1 min
float prev;
float av = 0;
float x_aa = 0;
float maxx = 0;
float minn = 0;
float currv[10];
float currvx[30];
float reps = 0;
float t;
float vv;
int state = 0;

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
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  Serial.println("Starting Calibration!");
  // 1 minute calibration to calculate max velocity and threshold for rep counter
  for (unsigned long str = millis(); (millis()-str) < period; ){
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
    float v = ((currv[9] - currv[0]) * 1000) + 81.0; // velocity from rate of change
    if (v > maxx){ // if current velocity is greater than the max, set max to that velocity
      maxx = v;
    }
    if (v < minn){ // if less than minimum, set as min
      minn = v;
    }
    for (int k = 0; k < 10; k++){ // reset rate of change array to account for accumulating errors
      currv[k] = 0;
    }
    prevvx = 0;
  }
  t = (maxx + minn) / 2; // Threshold
  Serial.println("Calibration ended");
  delay(100);
}

void loop() {
  // put your main code here, to run repeatedly:
  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);

  float x_a = a.acceleration.x;
  float y_a = a.acceleration.y;
  float z_a = a.acceleration.z;
  char S[15];
  char x[50];
  char y[15];
  char z[15];
  char del[15];

  //Stores 10 velocity values in array
  for (int n = 0; n < 10; n++){
    // Apply moving average filter
    float x_a = a.acceleration.x;
    totalx = totalx - READX[ind];
    READX[ind] = x_a;
    totalx = totalx + READX[ind];
    ind = ind + 1;
    if (ind >= WINDOW_SIZE){
      ind = 0;
    }
    averagex = totalx / WINDOW_SIZE; //Filtered acceleration (x)
    currv[n] = (prevvx + (averagex)*0.001);
    prevvx = currv[n];
  }
  vv = ((currv[9] - currv[0]) * 1000) + 81.0; //Calculates velocity and accounts for accumulating errors
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
  
  pCharacteristicx->setValue(x); // send over BLE
  
  Serial.print(x);
  Serial.print(" ");
  Serial.print(t);
  Serial.print(" ");
  Serial.println(reps);
  
  delay(25);
}