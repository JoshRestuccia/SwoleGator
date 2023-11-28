import bleak
import asyncio
from bleak import BleakScanner, BleakClient

name = "SwoleGator Adapter"
UUID = "00001800-0000-1000-8000-00805f9b34fb"

async def main():
    
    dev = await BleakScanner.find_device_by_name(name)
    if(dev != None): print(dev)
    
    async with BleakClient(dev) as client:
        i = 0
        while i < 100:
            data =  await client.read_gatt_char(UUID)
            accel_data = data.decode('utf_8')
            accel_data = accel_data.split(",")
            x = float(accel_data[0])
            y = float(accel_data[1])
            z = float(accel_data[2])
            print("x = ", x, ", Y = ", y, ", Z = ", z)
            i = i + 1


asyncio.run(main())