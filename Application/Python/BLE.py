import bleak
import asyncio
from bleak import BleakScanner, BleakClient

address = "48:E7:29:B3:C8:82"
UUID = "00001800-0000-1000-8000-00805f9b34fb"
async def main():
    devices = await BleakScanner.discover()
    for d in devices:
        print(d)
    async with BleakClient(address) as client:
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