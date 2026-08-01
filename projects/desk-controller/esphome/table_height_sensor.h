#include "esphome.h"

using namespace esphome;
using namespace esphome::uart;

class TableHeightSensor : public PollingComponent, public UARTDevice, public sensor::Sensor {
 public:
  TableHeightSensor(UARTComponent *parent) : PollingComponent(1000), UARTDevice(parent) {}

  float value = 0;
  float lastPublished = -1;

  void setup() override {
  }

  void loop() override {
    while (available()) {
      byte in = read();
      if (in > 5 && in != 170) {
        value = (in + 256.00) / 10.00;
      }
      yield();
    }
  }

  void update() override {
    if (value != lastPublished) {
      publish_state(value);
      lastPublished = value;
    }
  }
};
