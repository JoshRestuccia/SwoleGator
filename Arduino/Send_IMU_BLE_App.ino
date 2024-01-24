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
const int WINDOW_SIZE = 20;
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
//float currvx;
float prev;
float av = 0;
float x_aa = 0;
float currv[10];
float currvx[20];
int reps = 0;

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

  

  /**totalx = totalx - READX[ind];
  totaly = totaly - READY[ind];
  totalz = totalz - READZ[ind];
  READX[ind] = x_a;
  READY[ind] = y_a;
  READZ[ind] = z_a;
  totalx = totalx + READX[ind];
  totaly = totaly + READY[ind];
  totalz = totalz + READZ[ind];
  ind = ind + 1;

  if (ind >= WINDOW_SIZE){
    ind = 0;
  }

  averagex = totalx / WINDOW_SIZE;
  averagey = totaly / WINDOW_SIZE;
  averagez = totalz / WINDOW_SIZE;**/
  //Stores 10 velocity values in array
  for (int i = 0; i < 20; i++){
    for (int n = 0; n < 10; n++){
      float x_a = a.acceleration.x;
      totalx = totalx - READX[ind];
      READX[ind] = x_a;
      totalx = totalx + READX[ind];
      ind = ind + 1;
      if (ind >= WINDOW_SIZE){
        ind = 0;
      }
      averagex = totalx / WINDOW_SIZE;
      currv[n] = (prevvx + (averagex)*0.001);
      prevvx = currv[n];
    }
    currvx[i] = ((currv[9] - currv[0]) * 10) - 0.81;
  }
  //currvx = ((currv[19] - currv[10]) * 10) - 0.81;
  //prev = ((currv[9] - currv[0]) * 10) - 0.81;
  if ((currvx[0] > currvx[19])){
    reps = reps + 1;
  }
  

  /**float currv = (prevvx + (averagex)*0.001);
  prevvx = currv;
  for (i)**/

  strcpy(x, floatToString(x_a, S, sizeof(S), 1));
  strcpy(y, floatToString(y_a, S, sizeof(S), 1));
  strcpy(z, floatToString(z_a, S, sizeof(S), 1));
  //String accely = floatToString(y_a, S, sizeof(S), 1);
  //String accelz = floatToString(z_a, S, sizeof(S), 1);
  strcpy(del, ",");
  strcat(x,del);
  strcat(x,y);
  strcat(x,del);
  strcat(x,z);
  //String accel = accelx + del + accely + del + accelz;
  //char buf[50];
  //accel.toCharArray(buf, 50);
  // + ',' + floatToString(y_a, S, sizeof(S), 1) + ',' + floatToString(z_a, S, sizeof(S), 1);
  //std::string accelsi = String(accel);
  //string xa = String(floatToString(x_a, S, sizeof(S), 1));
  pCharacteristicx->setValue(x);
  //pCharacteristicy->setValue(floatToString(y_a, S, sizeof(S), 1));
  //pCharacteristicz->setValue(floatToString(z_a, S, sizeof(S), 1));
  //pCharacteristicx->setValue(x_a);
  //pCharacteristicz->setValue(z_a);
  //Serial.print(accel);
  //Serial.println();
  /**Serial.print("Acceleration: ");
  Serial.print(x);
  Serial.println();**/
  Serial.print(currvx[0]);
  Serial.print(" ");
  Serial.print(currvx[19]);
  Serial.print(" ");
  Serial.println(reps);
  /**Serial.print(" ");
  Serial.print(averagey);
  Serial.print(" ");
  Serial.print(z_a);
  Serial.print(" ");
  Serial.println(averagez);**/
  /**Serial.print(" ");
  Serial.println(z_a);**/

  //pCharacteristic->setValue(Serial.readString().c_str());
  delay(25);
}