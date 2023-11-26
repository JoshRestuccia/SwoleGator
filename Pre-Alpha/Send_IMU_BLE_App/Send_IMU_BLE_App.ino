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
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
static BLECharacteristic *pCharacteristicx;
static BLECharacteristic *pCharacteristicy;
static BLECharacteristic *pCharacteristicz;
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
  
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  BLEDevice::init("ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristicx = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pCharacteristicy = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
  pCharacteristicz = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );
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
  /**Serial.print("Acceleration X: ");
  Serial.print(x_a);
  Serial.print(", Y: ");
  Serial.print(y_a);
  Serial.print(", Z: ");
  Serial.print(z_a);
  Serial.println(" m/s^2");**/

  //pCharacteristic->setValue(Serial.readString().c_str());
  delay(500);
}