#include <Adafruit_NeoPixel.h>
//#include "SSD1306Ascii.h"
//#include "SSD1306AsciiAvrI2c.h"
#include "DigitLedDisplay.h"

#define DEBUG  //COMMENT LINE TO DISABLE DEBUG

//************DEFINE PINS***********************************************************************
#define outputA 2     //Encoder DT
#define outputB 3     //Encoder CLK
int EncoderSwitch = 10; //Encoder SW

#define ledPIN 5      //Neopixel LED Single

int in1 = A4;           //Relay IN1
int in2 = A5;           //Relay IN2

int pumpStartpin = 4;  //to DB25 Pin 15
int PumpSetPin = 6;       //to voltageBooster which goes to DB 1
int pumpDirectionpin = 13; //to DB25 Pin 16

int PumpReadPin = A3;     //to voltage sensor

int Left_Footswitch_Pin = A0;  //to footswitch
int Right_Footswitch_Pin = A1; //to footswitch

/* Arduino Pin to Display Pin
   7 to DIN,
   4 to CS,
   5 to CLK */
DigitLedDisplay ld = DigitLedDisplay(9, 8, 7);

//************DEFINE VARS*************************************************************************
// For LEDS
#define NUM_LEDS 24
#define BRIGHTNESS 50
int targetPixel = 24;
const unsigned long Interval;   // milliseconds between updates
static unsigned long lastUpdate; // last update of position
uint32_t Color1, Color2;  // What colors are in use
int TotalSteps = 0;  // total number of steps in the pattern
uint16_t Index;  // current step within the pattern
String Direction = "FORWARD";
bool ClearLEDs = false;
bool BlinkLEDS = false;
Adafruit_NeoPixel Ring1 = Adafruit_NeoPixel(NUM_LEDS, ledPIN, NEO_GRBW + NEO_KHZ800);

// For SCREEN
//#define I2C_ADDRESS 0x3C
//#define RST_PIN -1
//SSD1306AsciiAvrI2c oled;
//boolean displayClear = true;

//FOR RELAY
String relayStatus = "on";
int countStatus = 1;

//FOR FOOTSWITCH
String Left_Footswitch_Status;
String Left_Footswitch_Status_Previous = "released";
int Left_Footswitch_Pin_Status = 1;
int Left_Footswitch_Pin_Status_Last = 1;
String Left_Footswitch_Status_Last;
String Right_Footswitch_Status;
String Right_Footswitch_Status_Previous = "released";
String Right_Footswitch_Status_Last;
int Right_Footswitch_Pin_Status = 1;
int Right_Footswitch_Pin_Status_Last = 1;

//FOR ENCODER
int encoder_switch_status = 0;
int encoder_switch_status_last = 0;
int counter = 0;
int angle = 0;
int aState;
int aLastState;
int val;
int encoder0PinA = 10;  //DT
int encoder0PinB = 12;  //CLK
int encoder0Pos = 0;
int encoder0PinALast = LOW;
int n = LOW;
int X = 100;
int Xold = 50;
int Y;

// TIMER
boolean startTimer = true;
float startTime = 0.00;
float elapsedTime = 0.00;
float elapsedTimeseconds = 0.00;
float elapsedTimesecondsOld = 0.00;
float elapsedTimesecondsNew = 0.00;
float elapsedTimesecondsOldLCD = 0.00;
float elapsedTimesecondsNewLCD = 0.00;
float elapsedTimesecondsOldLEDS = 0.00;
float elapsedTimesecondsNewLEDS = 0.00;
//PUMP INPUT and OUTPUT
int sendPumpSpeed = 2500;
int sendPumpVoltage = 0;
int sendPumpSpeedMax = 2900;
int sendPumpSpeedMin = 150; //slowest pump can reliable rotate
int currentPumpSpeed = 0;
float pumpVolume = 0;
int pumpVolumeTarget = 2000;
float pumpVolumeTargetMax = 4000;
int pumpVolumeTargetMin = 100;
int voltage = 0;
String pumpStatus = "stopped";
String pumpDirection = "CW";
String mode = "setPumpSpeed";

//AUDIO
#define msPerTick 1


//************SETUP*******************************************************************************
void setup() {
  // initialize serial communication with computer:
  Serial.begin(115200);
  Serial.println("Pump Controller Startup");

  pinMode(PumpSetPin, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  pinMode(pumpStartpin, OUTPUT);
  pinMode(pumpDirectionpin, OUTPUT);
  pinMode(Left_Footswitch_Pin, INPUT_PULLUP);
  pinMode(Right_Footswitch_Pin, INPUT_PULLUP);
  pinMode(EncoderSwitch, INPUT_PULLUP);
  pinMode (encoder0PinA, INPUT);
  pinMode (encoder0PinB, INPUT);

  //CLOSE PINCH VALVES, TURN PUMP OFF
  digitalWrite(in1, HIGH); //CLOSE VALVE
  digitalWrite(in2, HIGH); //CLOSE VALVE
  digitalWrite(pumpStartpin, HIGH);
  digitalWrite(pumpDirectionpin, HIGH);

  // START DISPLAY
  //#if RST_PIN >= 0
  //  oled.begin(&Adafruit128x64, I2C_ADDRESS, RST_PIN);
  //#else
  //  oled.begin(&Adafruit128x64, I2C_ADDRESS);
  //#endif
  //  oled.setFont(Adafruit5x7);

  //FOR LED
  Ring1.setBrightness(BRIGHTNESS);
  Ring1.begin();
  Ring1.show(); // Initialize all pixels to 'off'

  //FOR 7 SEGMENT
  ld.setBright(10);
  ld.setDigitLimit(8);

  // FOR ENCODER
  aLastState = digitalRead(outputA);
}

//************MAIN LOOP****************************************************************************
void loop() {

  //READ PUMP
  voltage = analogRead(PumpReadPin);
  currentPumpSpeed = map(voltage, 0, 405, 0, 2900);

  //START PUMP
  /* if (startTimer == true)
    {
     startTime = millis();
     startTimer = false;
     pumpVolume = 0;
    }
  */
  elapsedTime =   millis() - startTime;
  elapsedTimeseconds = (elapsedTime / 1000.00);
  elapsedTimesecondsNew = round(elapsedTimeseconds * 10) / 10.0;
  elapsedTimesecondsNewLCD = round(elapsedTimeseconds * 10) / 10.0;
  elapsedTimesecondsNewLEDS = round(elapsedTimeseconds * 10) / 10.0;

  if (elapsedTimesecondsNew > elapsedTimesecondsOld & pumpStatus == "pumping")
  {
    pumpVolume = pumpVolume + (currentPumpSpeed * ((1.00 / 60.00)) / 10);
    //Serial.print("Pumped volume update: ");
    //Serial.print(round(pumpVolume * 1) / 1.0);
    //Serial.println(" mL");
    elapsedTimesecondsOld = elapsedTimesecondsNew;
  }

  ReadFootswitch();
  ReadEncoder();
  ControlPump();
  UpdateLCD();
  //UpdateLEDS();
}

//************READ FOOTSWITCH *********************************************************************
// Writes value of footswitch for manipulation in additional loops
void ReadFootswitch() {

  // Read footswitch
  Left_Footswitch_Pin_Status = digitalRead(Left_Footswitch_Pin);
  Right_Footswitch_Pin_Status = digitalRead(Right_Footswitch_Pin);

  if (Left_Footswitch_Pin_Status == LOW && Left_Footswitch_Status_Previous == "released")
  {
    Left_Footswitch_Status = "pressed";
    ControlPump();
    delay(200);
    Left_Footswitch_Status_Previous = "pressed";
  }

  else if (Left_Footswitch_Pin_Status == HIGH)
  {
    Left_Footswitch_Status = "released";
    Left_Footswitch_Status_Previous = "released";
  }

  if (Right_Footswitch_Pin_Status == LOW && Left_Footswitch_Status_Previous == "released")
  {
    Right_Footswitch_Status = "pressed";
    ControlPump();
    delay(200);
    Right_Footswitch_Status_Previous = "pressed";
  }
  else if (Right_Footswitch_Pin_Status == HIGH)
  {
    Right_Footswitch_Status = "released";
    Right_Footswitch_Status_Previous = "released";
  }
}

//************READ ENCODER***********************************************************************
// Reads encoder to set pump speed and volume in further loops
void ReadEncoder() {

  encoder_switch_status = digitalRead(EncoderSwitch);

  n = digitalRead(encoder0PinA);

  if ((encoder0PinALast == LOW) && (n == HIGH)) {

    if (digitalRead(encoder0PinB) == LOW && encoder_switch_status == HIGH && pumpVolumeTarget > pumpVolumeTargetMin) {
      pumpVolumeTarget = pumpVolumeTarget - 50;

      Serial.print("Pump Volume Set To: ");
      Serial.println(pumpVolumeTarget);

    } else if (encoder_switch_status == HIGH && pumpVolumeTarget < pumpVolumeTargetMax) {
      pumpVolumeTarget = pumpVolumeTarget + 50;

      Serial.print("Pump Volume Set To: ");
      Serial.println(pumpVolumeTarget);
    }

    if (digitalRead(encoder0PinB) == LOW && encoder_switch_status == LOW && sendPumpSpeed > sendPumpSpeedMin) {
      sendPumpSpeed = sendPumpSpeed - 50;

      Serial.print("Pump Speed Set To: ");
      Serial.println(sendPumpSpeed);

    } else if (encoder_switch_status == LOW && sendPumpSpeed < sendPumpSpeedMax) {
      sendPumpSpeed = sendPumpSpeed + 50;

      Serial.print("Pump Speed Set To: ");
      Serial.println(sendPumpSpeed);
    }
  }
  encoder0PinALast = n;

}

//************UPDATE LCD***********************************************************************
// Writes vlaues to LCD
void UpdateLCD() {

  if (elapsedTimesecondsNewLCD > elapsedTimesecondsOldLCD && encoder_switch_status == LOW)
  {
    ld.clear();
    ld.printDigit(int(sendPumpSpeed), 4);
    elapsedTimesecondsOldLCD = elapsedTimesecondsNewLCD;
  }
  else if (elapsedTimesecondsNewLCD > elapsedTimesecondsOldLCD && encoder_switch_status == HIGH)
  {
    ld.clear();
    ld.printDigit(int(pumpVolume), 0);
    ld.printDigit(int(pumpVolumeTarget), 4);
    elapsedTimesecondsOldLCD = elapsedTimesecondsNewLCD;
  }
}

void UpdateLEDS() {
  int targetPixel = round(((pumpVolume / pumpVolumeTarget) * NUM_LEDS + 0.5) * 10) / 10.0;
  //Serial.println(targetPixel);

  if (pumpDirection == "CW" && BlinkLEDS == false)
  {
    for (int i = 0; i < targetPixel; i++) {
      Ring1.setPixelColor(i, Ring1.Color(0, 255, 0) );
      Ring1.show();
    }
  }
  else if (pumpDirection == "CCW" && BlinkLEDS == false)
  {
    for (int i = 0; i < targetPixel + 1; i++) {
      Ring1.setPixelColor(NUM_LEDS - i, Ring1.Color(255, 0, 255) );
      Ring1.show();
    }
  }

  if (elapsedTimesecondsNewLEDS > elapsedTimesecondsOldLEDS + 1 && pumpStatus == "stopped" && BlinkLEDS == true) {

    for (int i = 0; i < targetPixel + 1; i++) {
      Ring1.setPixelColor(NUM_LEDS, Ring1.Color(255, 0, 0) );
      Ring1.show();
    }
    elapsedTimesecondsOldLEDS = elapsedTimesecondsNewLEDS;
  }


  //RELAYS
  if (pumpStatus == "pumping" && pumpDirection == "CCW")
  {
    digitalWrite(in1, HIGH);   //FLOP RELAYS
    digitalWrite(in2, LOW);
  }
  else if ( pumpStatus == "pumping" && pumpDirection == "CW") {
    digitalWrite(in1, LOW);   //FLOP RELAYS
    digitalWrite(in2, HIGH);
  }
  else {
    digitalWrite(in1, HIGH); //CLOSE VALVE
    digitalWrite(in2, HIGH); //CLOSE VALVE
  }





  if (ClearLEDs == true)
  {
    for (int i = 0; i < NUM_LEDS; i++) {
      Ring1.setPixelColor(i, Ring1.Color(0, 0, 0));
      Ring1.show();
    }
    ClearLEDs = false;
  }
}


//************CONTROLS PUMP*********************************************************************
// Sets pump speed and start/stop
void ControlPump()  {

  // Stops pump when footswitch is pressed and the pump is running
  if (Left_Footswitch_Status == "pressed" && pumpStatus == "pumping" && Left_Footswitch_Status_Previous == "released")
  {
    digitalWrite(pumpStartpin, HIGH);  //stop pump
    Serial.println("stop pump!");
    pumpStatus = "stopped";
    BlinkLEDS = true;
  }


  // Starts pump when footswitch is pressed and the pump is stopped
  else if (Left_Footswitch_Status == "pressed" && pumpStatus == "stopped" && Left_Footswitch_Status_Previous == "released")
  {
    digitalWrite(pumpStartpin, LOW);  //start pump
    Serial.println("start pump!");
    pumpStatus = "pumping";
    BlinkLEDS = false;
  }


  // Stops pump when pump volume reaches pump target
  if (pumpVolume > pumpVolumeTarget)
  {
    //startTimer = true;
    digitalWrite(pumpStartpin, HIGH); //STOP PUMP
    elapsedTimesecondsOld = 1;  //RESET TIMER
    pumpVolume = 0;  //REST PUMP VOLUME
    pumpStatus = "stopped";
    BlinkLEDS = false;
  }


  // Changes pump direction to counter clock-wise when right footswitch is pressed, pump is stopped, and current direction is clock-wise
  if (Right_Footswitch_Status == "pressed" && pumpStatus == "stopped" && pumpDirection == "CW" && Right_Footswitch_Status_Previous == "released" )
  {
    pumpDirection = "CCW";
    digitalWrite(pumpDirectionpin, LOW);
    Serial.println("set pump diresction: CCW");
    elapsedTimesecondsOld = 1;  //RESET TIMER
    pumpVolume = 0;  //REST PUMP VOLUME
    BlinkLEDS = false;
    ClearLEDs = true;
  }


  // Changes pump direction to clock-wise when right footswitch is pressed, pump is stopped, and current direction is cpunter clock-wise
  else if (Right_Footswitch_Status == "pressed" && pumpStatus == "stopped" && pumpDirection == "CCW" && Right_Footswitch_Status_Previous == "released")
  {
    pumpDirection = "CW";
    Serial.println("set pump diresction: CW");
    digitalWrite(pumpDirectionpin, HIGH);
    elapsedTimesecondsOld = 1;  //RESET TIMER
    pumpVolume = 0;  //REST PUMP VOLUME
    BlinkLEDS = false;
    ClearLEDs = true;
  }


  // Changes to pump speed to set value
  sendPumpVoltage = map(sendPumpSpeed, 0, sendPumpSpeedMax, 0, 255);
  analogWrite(PumpSetPin, sendPumpVoltage);
}
