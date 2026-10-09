
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from threading import Lock

app = FastAPI(title="MCU Pin Board API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pins = [
    {"id": "pin-01", "pinNumber": 1, "pinName": "VCC", "type": "Power", "side": "left", "position": 1, "description": "Main power input", "locked": False},
    {"id": "pin-02", "pinNumber": 2, "pinName": "GND", "type": "Ground", "side": "left", "position": 2, "description": "Ground connection", "locked": False},
    {"id": "pin-03", "pinNumber": 3, "pinName": "GPIO1", "type": "GPIO", "side": "left", "position": 3, "description": "General purpose input/output 1", "locked": False},
    {"id": "pin-04", "pinNumber": 4, "pinName": "GPIO2", "type": "GPIO", "side": "left", "position": 4, "description": "General purpose input/output 2", "locked": False},
    {"id": "pin-05", "pinNumber": 5, "pinName": "SDA", "type": "I2C", "side": "left", "position": 5, "description": "I2C data", "locked": False},
    {"id": "pin-06", "pinNumber": 6, "pinName": "SCL", "type": "I2C", "side": "left", "position": 6, "description": "I2C clock", "locked": False},
    {"id": "pin-07", "pinNumber": 7, "pinName": "MOSI", "type": "SPI", "side": "left", "position": 7, "description": "SPI controller output", "locked": False},
    {"id": "pin-08", "pinNumber": 8, "pinName": "MISO", "type": "SPI", "side": "left", "position": 8, "description": "SPI controller input", "locked": False},
    {"id": "pin-09", "pinNumber": 9, "pinName": "TX", "type": "UART", "side": "right", "position": 8, "description": "UART transmit", "locked": False},
    {"id": "pin-10", "pinNumber": 10, "pinName": "RX", "type": "UART", "side": "right", "position": 7, "description": "UART receive", "locked": False},
    {"id": "pin-11", "pinNumber": 11, "pinName": "GPIO3", "type": "GPIO", "side": "right", "position": 6, "description": "General purpose input/output 3", "locked": False},
    {"id": "pin-12", "pinNumber": 12, "pinName": "GPIO4", "type": "GPIO", "side": "right", "position": 5, "description": "General purpose input/output 4", "locked": False},
    {"id": "pin-13", "pinNumber": 13, "pinName": "PWM", "type": "PWM", "side": "right", "position": 4, "description": "Pulse-width modulation output", "locked": False},
    {"id": "pin-14", "pinNumber": 14, "pinName": "ADC", "type": "Analog", "side": "right", "position": 3, "description": "Analog input", "locked": False},
    {"id": "pin-15", "pinNumber": 15, "pinName": "RST", "type": "Reset", "side": "right", "position": 2, "description": "Reset signal", "locked": False},
    {"id": "pin-16", "pinNumber": 16, "pinName": "3V3", "type": "Power", "side": "right", "position": 1, "description": "3.3V power output", "locked": False},
]

pins_lock = Lock()


@app.get("/api/pins")
def get_pins():
    with pins_lock:
        return [pin.copy() for pin in pins]


@app.patch("/api/pins/{pin_id}")
def lock_pin(pin_id: str):
    with pins_lock:
        pin = next((p for p in pins if p["id"] == pin_id), None)

        if pin is None:
            raise HTTPException(status_code=404, detail="Pin not found")

        if pin["locked"]:
            raise HTTPException(status_code=409, detail="Pin is already locked")

        pin["locked"] = True

        return {
            "message": f"P{pin['pinNumber']:02d} ({pin['pinName']}) locked successfully",
            "pin": pin.copy(),
        }
