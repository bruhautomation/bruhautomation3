/*
  .______   .______    __    __   __    __          ___      __    __  .___________.  ______   .___  ___.      ___   .___________. __    ______   .__   __.
  |   _  \  |   _  \  |  |  |  | |  |  |  |        /   \    |  |  |  | |           | /  __  \  |   \/   |     /   \  |           ||  |  /  __  \  |  \ |  |
  |  |_)  | |  |_)  | |  |  |  | |  |__|  |       /  ^  \   |  |  |  | `---|  |----`|  |  |  | |  \  /  |    /  ^  \ `---|  |----`|  | |  |  |  | |   \|  |
  |   _  <  |      /  |  |  |  | |   __   |      /  /_\  \  |  |  |  |     |  |     |  |  |  | |  |\/|  |   /  /_\  \    |  |     |  | |  |  |  | |  . `  |
  |  |_)  | |  |\  \-.|  `--'  | |  |  |  |     /  _____  \ |  `--'  |     |  |     |  `--'  | |  |  |  |  /  _____  \   |  |     |  | |  `--'  | |  |\   |
  |______/  | _| `.__| \______/  |__|  |__|    /__/     \__\ \______/      |__|      \______/  |__|  |__| /__/     \__\  |__|     |__|  \______/  |__| \__|


*/



/************ Enable Parts of the Code ******************/
#define DHTenabled    //add two slashes to #define line to disable that section of code
#define PIRenabled
//#define LEDenabled
#define LDRenabled
#define BLINDSenabled

/************ Libraries to Use ******************/
//general
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <ESP8266mDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <ArduinoJson.h>


#ifdef DHTenabled
#include <DHT.h>
#endif

#ifdef BLINDSenabled
#include <AccelStepper.h>
#include<Wire.h>
#endif



/**************************** Remove Any Digits You Aren't Using ********************************************/
#define redPin    D1  //not in use
#define greenPin  D2  //not in use
#define bluePin   D3  //not in use

#define PIRPIN    D0

#define DHTPIN    D1
#define DHTTYPE   DHT22
#define LDRPIN    A0

#define IN1       D4     // IN1 on the ULN2003 driver 
#define IN2       D5     // IN2 on the ULN2003 driver 
#define IN3       D6     // IN3 on the ULN2003 driver 
#define IN4       D7     // IN4 on the ULN2003 driver 
#define FULLSTEP 8  //leave this unless you know what you're doing

//Gyro SDA must go on D2 and Gyro SCL on D3.

/************ Set your WIFI and MQTT Information ******************/
#define wifi_ssid "YourSSID" //enter your WIFI SSID
#define wifi_password "YourWIFIpassword" //enter your WIFI Password

#define mqtt_server "your.mqtt.server.ip" //
int mqtt_port = 1883;
#define mqtt_user "yourMQTTusername" //enter your username
#define mqtt_password "yourMQTTpassword" //enter your password
#define mqtt_client_name "blinds2"


/************* MQTT TOPICS (change these topics as you wish)  **************************/
#define state_topic "bruh/blind2/cover/sensor"
#define command_topic "bruh/sensornode1/set" //only needed for LED

#define blind_tilt_state_topic "bruh/blind2/cover/tilt-status"   //comment out these linds
#define blind_tilt_command_topic "bruh/blind2/cover/tilt"        //if not using for blinds




/**************************** FOR OTA **************************************************/
#define SENSORNAME "blinds2"
#define OTApassword "yourOTApassword" // change this to whatever password you want to use when you upload OTA
int OTAport = 8266;




/**************************** SENSOR DEFINITIONS *******************************************/

//LDR
float ldrValue;
int LDR;
float calcLDR;
float diffLDR = 25;

//DHTT22
float diffTEMP = 0.2;
float tempValue;
float diffHUM = 1;
float humValue;

//PIR
int pirValue;
int pirStatus;
String pirState;
int calibrationTime = 0;

bool updateState;

//Gyro
float diffGyro = 20;
float gyroValue;

/**************************** JSON DEFINITIONS *******************************************/

char message_buff[300];
const int BUFFER_SIZE = 300;
#define MQTT_MAX_PACKET_SIZE 512
const char* on_cmd = "ON";
const char* off_cmd = "OFF";

/******************************** GLOBALS for LED *******************************/
byte red = 255;
byte green = 255;
byte blue = 255;
byte brightness = 255;
byte realRed = 0;
byte realGreen = 0;
byte realBlue = 0;
bool stateOn = false;
bool startFade = false;
unsigned long lastLoop = 0;
int transitionTime = 0;
bool inFade = false;
int loopCount = 0;
int stepR, stepG, stepB;
int redVal, grnVal, bluVal;
bool flash = false;
bool startFlash = false;
int flashLength = 0;
unsigned long flashStartTime = 0;
byte flashRed = red;
byte flashGreen = green;
byte flashBlue = blue;
byte flashBrightness = brightness;


/******************************** GLOBALS for Blinds *******************************/

/********ADJUST THESE********/
int slatsup = 255; //gryo readout when slats are up
int slatsmiddle = 180; //gryo readout when slats are up
int slatsdown = 110; //gryo readout when slats are up

int deadband = 3; //deadbands when blinds are "close enough"
bool inDeadBand = true;
int tiltmax = 100; //defined in HA
int tiltmin = 1; //defined in HA

int gyrosensitivity = 10; //the higher the number the less sensitive

/******** NO ADJUSTMENTS NEEDED ********/
int stepstotake;
int stepstotakenew;
int oldDirection;
int newDirection;
int stepsneeded = 4096 * 4;
String tiltpercentagestring;
int tiltpercentageint;
float tiltpercentagedecimal;
float moveup = -800;
float movedown = 800;
int motoracceleration = 800;
int motormaxspeed = 800;
int currentangle = slatsdown;
int setTilt = slatsdown;
int setTiltJSON;
const char* setStateJSON;
String motionX = "standby";
String motionY = "standby";
String motionZ = "standby";
String motion = "standby";
String motionLastSent = "startup";
String motionXold;
String motionYold;
String motionZold;
String motionold;
bool Tiltset;
bool movingstatus = false;

/******** Globals for Gyro ********/
const int MPU_addr = 0x68;
int16_t AcX, AcY, AcZ, Tmp, GyX, GyY, GyZ;
int minVal = 265;
int maxVal = 402;
double x = 1;
double y = 1;
double newGyroValue = 1;
double ysensitivity = 3;
double z = 1;
double xold = 1;
double yold = 1;
double zold = 1;
unsigned long timer1; // the timer1
unsigned long INTERVAL1 = 200; // the INTERVAL1 to poll the gyro
unsigned long timer2; // the timer1
unsigned long INTERVAL2 = 150; // the INTERVAL1 to poll the gyro

WiFiClient espClient;
PubSubClient client(espClient);

#ifdef DHTenabled
DHT dht(DHTPIN, DHTTYPE);
#endif

#ifdef BLINDSenabled
AccelStepper stepper(FULLSTEP, IN1, IN3, IN2, IN4);
#endif


/********************************** START SETUP*****************************************/
void setup() {

  Serial.begin(115200);

#ifdef PIRenabled
  pinMode(PIRPIN, INPUT);
  Serial.print("calibrating sensor ");
  for (int i = 0; i < calibrationTime; i++) {
    Serial.print(".");
    delay(1000);
  }
#endif

#ifdef DHTenabled
  pinMode(DHTPIN, INPUT);
#endif

#ifdef LDRenabled
  pinMode(LDRPIN, INPUT);
#endif

#ifdef BLINDSenabled
  Wire.begin(D2, D3);
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);
  Wire.write(0);
  Wire.endTransmission(true);
  timer1 = millis(); // start timer1 for gyro loop
  steppersetup();
#endif

#ifdef LEDenabled
  setColor(0, 0, 0);
#endif

  Serial.begin(115200);
  delay(10);


  //*******************************OTA SETUP
  ArduinoOTA.setPort(OTAport);
  ArduinoOTA.setHostname(SENSORNAME);
  ArduinoOTA.setPassword((const char *)OTApassword);

  Serial.println("Starting Node named " + String(SENSORNAME));


  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);


  ArduinoOTA.onStart([]() {
    Serial.println("Starting");
  });
  ArduinoOTA.onEnd([]() {
    Serial.println("\nEnd");
  });
  ArduinoOTA.onProgress([](unsigned int progress, unsigned int total) {
    Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
  });
  ArduinoOTA.onError([](ota_error_t error) {
    Serial.printf("Error[%u]: ", error);
    if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
    else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
    else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
    else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
    else if (error == OTA_END_ERROR) Serial.println("End Failed");
  });
  ArduinoOTA.begin();
  Serial.println("Ready");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  reconnect();

  pollGyro();
  sensorRead();

}



void steppersetup()

#ifdef BLINDSenabled
{
  stepper.setMaxSpeed(motormaxspeed);
  stepper.setAcceleration(motoracceleration);
  stepper.setSpeed(oldDirection);
  //stepper.moveTo(stepstotake);
}
#endif

/********************************** START SETUP WIFI*****************************************/
void setup_wifi() {

  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(wifi_ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(wifi_ssid, wifi_password);

  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}



/********************************** START CALLBACK*****************************************/
void callback(char* topic, byte* payload, unsigned int length) {
  int i = 0;

  //receieves messages of blind_tilt_command_topic
#ifdef BLINDSenabled
  if (String(topic) == blind_tilt_command_topic) {
    for (i = 0; i < length; i++) {
      message_buff[i] = payload[i];
    }
    message_buff[i] = '\0';
    String setTiltRec = String(message_buff);
    Serial.println("Tilt Percentage: " + setTiltRec);
    setTilt = map(setTiltRec.toInt(), tiltmin, tiltmax, slatsdown, slatsup);
    inDeadBand = false;
  }
#endif

  //receieves messages on command topic
  if (String(topic) == command_topic) {
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    char message[length + 1];
    for (int i = 0; i < length; i++) {
      message[i] = (char)payload[i];
    }
    message[length] = '\0';
    Serial.println(message);

    if (!processJson(message)) {
      return;
    }

    if (stateOn) {
      // Update lights
      realRed = map(red, 0, 255, 0, brightness);
      realGreen = map(green, 0, 255, 0, brightness);
      realBlue = map(blue, 0, 255, 0, brightness);
    }
    else {
      realRed = 0;
      realGreen = 0;
      realBlue = 0;
    }
    startFade = true;
    inFade = false; // Kill the current fade

    sendState();
  }
}



/********************************** START PROCESS JSON*****************************************/
bool processJson(char* message) {
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;

  JsonObject& root = jsonBuffer.parseObject(message);

  if (!root.success()) {
    Serial.println("parseObject() failed");
    return false;
  }

  if (root.containsKey("state")) {
    if (strcmp(root["state"], on_cmd) == 0) {
      stateOn = true;
    }
    else if (strcmp(root["state"], off_cmd) == 0) {
      stateOn = false;
    }
  }

  // If "flash" is included, treat RGB and brightness differently
  if (root.containsKey("flash")) {
    flashLength = (int)root["flash"] * 1000;

    if (root.containsKey("brightness")) {
      flashBrightness = root["brightness"];
    }
    else {
      flashBrightness = brightness;
    }

    if (root.containsKey("color")) {
      flashRed = root["color"]["r"];
      flashGreen = root["color"]["g"];
      flashBlue = root["color"]["b"];
    }
    else {
      flashRed = red;
      flashGreen = green;
      flashBlue = blue;
    }

    flashRed = map(flashRed, 0, 255, 0, flashBrightness);
    flashGreen = map(flashGreen, 0, 255, 0, flashBrightness);
    flashBlue = map(flashBlue, 0, 255, 0, flashBrightness);

    flash = true;
    startFlash = true;
  }
  else { // Not flashing
    flash = false;

    if (root.containsKey("color")) {
      red = root["color"]["r"];
      green = root["color"]["g"];
      blue = root["color"]["b"];
    }

    if (root.containsKey("brightness")) {
      brightness = root["brightness"];
    }

    if (root.containsKey("transition")) {
      transitionTime = root["transition"];
    }
    else {
      transitionTime = 0;
    }
  }

  return true;
}



/********************************** START SEND STATE*****************************************/
void sendState() {
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;

  JsonObject& root = jsonBuffer.createObject();

#ifdef LEDenabled
  root["state"] = (stateOn) ? on_cmd : off_cmd;
  JsonObject& color = root.createNestedObject("color");
  color["r"] = red;
  color["g"] = green;
  color["b"] = blue;
  root["brightness"] = brightness;
#endif

#ifdef DHTenabled
  root["humidity"] = (String)humValue;
  root["temperature"] = (String)tempValue;
  root["heatIndex"] = (String)calculateHeatIndex(humValue, tempValue);
#endif

#ifdef PIRenabled
  root["pir"] = (String)pirState;
#endif

#ifdef LDRenabled
  root["ldr"] = (String)LDR;
#endif

#ifdef BLINDSenabled
  root["motion"] = motion.c_str();
  motionLastSent = motion;
#endif

  char buffer[root.measureLength() + 1];
  root.printTo(buffer, sizeof(buffer));

  Serial.println(buffer);

  if (humValue != 0.0 && tempValue != 0.0 & LDR != 0) { //keeps sensor for throwing zeros and killing the graph on startup
    client.publish(state_topic, buffer, true);
  }
  else {
    Serial.println("ERROR - sensor reporting zero state");
  }

#ifdef BLINDSenabled
sendTilt(); 
#endif
}

void sendTilt() {
#ifdef BLINDSenabled

  String tilt_percentage_actual = String(map(newGyroValue, slatsdown, slatsup, tiltmin, tiltmax));

  if (newGyroValue > slatsdown - deadband) {  //keeps gyro from sending abnormal states
    client.publish(blind_tilt_state_topic, tilt_percentage_actual.c_str(), true);
  }
  else {
    Serial.println("ERROR - gyro reporting abnormal state");
  }
#endif

}


/*
   Calculate Heat Index value AKA "Real Feel"
   NOAA heat index calculations taken from
   http://www.wpc.ncep.noaa.gov/html/heatindex_equation.shtml
*/
float calculateHeatIndex(float humidity, float temp) {
  float heatIndex = 0;
  if (temp >= 80) {
    heatIndex = -42.379 + 2.04901523 * temp + 10.14333127 * humidity;
    heatIndex = heatIndex - .22475541 * temp * humidity - .00683783 * temp * temp;
    heatIndex = heatIndex - .05481717 * humidity * humidity + .00122874 * temp * temp * humidity;
    heatIndex = heatIndex + .00085282 * temp * humidity * humidity - .00000199 * temp * temp * humidity * humidity;
  } else {
    heatIndex = 0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094));
  }

  if (humidity < 13 && 80 <= temp <= 112) {
    float adjustment = ((13 - humidity) / 4) * sqrt((17 - abs(temp - 95.)) / 17);
    heatIndex = heatIndex - adjustment;
  }

  return heatIndex;
}


/********************************** START SET COLOR *****************************************/
void setColor(int inR, int inG, int inB) {
#ifdef LEDenabled
  analogWrite(redPin, inR);
  analogWrite(greenPin, inG);
  analogWrite(bluePin, inB);

  Serial.println("Setting LEDs:");
  Serial.print("r: ");
  Serial.print(inR);
  Serial.print(", g: ");
  Serial.print(inG);
  Serial.print(", b: ");
  Serial.println(inB);

#endif
}



/********************************** START RECONNECT*****************************************/
void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(SENSORNAME, mqtt_user, mqtt_password)) {
      Serial.println("connected");
      client.subscribe(command_topic);

#ifdef BLINDSenabled
      client.subscribe(blind_tilt_command_topic);
#endif

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}



/********************************** START CHECK SENSOR **********************************/
bool checkBoundSensor(float newValue, float prevValue, float maxDiff) {
  return newValue < prevValue - maxDiff || newValue > prevValue + maxDiff;
}


/********************************** START MAIN LOOP***************************************/
void loop() {

  ArduinoOTA.handle();

  if (!client.connected()) {
    // reconnect();
    software_Reset();
  }
  client.loop();

  ArduinoOTA.handle();

#ifdef LEDenabled
  if (!inFade) {
    sensorRead;
  }

  if (flash) {
    if (startFlash) {
      startFlash = false;
      flashStartTime = millis();
    }

    if ((millis() - flashStartTime) <= flashLength) {
      if ((millis() - flashStartTime) % 1000 <= 500) {
        setColor(flashRed, flashGreen, flashBlue);
      }
      else {
        setColor(0, 0, 0);
        // If you'd prefer the flashing to happen "on top of"
        // the current color, uncomment the next line.
        // setColor(realRed, realGreen, realBlue);
      }
    }
    else {
      flash = false;
      setColor(realRed, realGreen, realBlue);
    }
  }

  if (startFade) {
    // If we don't want to fade, skip it.
    if (transitionTime == 0) {
      setColor(realRed, realGreen, realBlue);

      redVal = realRed;
      grnVal = realGreen;
      bluVal = realBlue;

      startFade = false;
    }
    else {
      loopCount = 0;
      stepR = calculateStep(redVal, realRed);
      stepG = calculateStep(grnVal, realGreen);
      stepB = calculateStep(bluVal, realBlue);

      inFade = true;
    }
  }

  if (inFade) {
    startFade = false;
    unsigned long now = millis();
    if (now - lastLoop > transitionTime) {
      if (loopCount <= 1020) {
        lastLoop = now;

        redVal = calculateVal(stepR, redVal, loopCount);
        grnVal = calculateVal(stepG, grnVal, loopCount);
        bluVal = calculateVal(stepB, bluVal, loopCount);

        setColor(redVal, grnVal, bluVal); // Write current values to LED pins

        Serial.print("Loop count: ");
        Serial.println(loopCount);
        loopCount++;
      }
      else {
        inFade = false;
      }
    }
  }
#endif

#ifdef BLINDSenabled

  pollGyro();

  if (!movingstatus) {
    sensorRead();
  }

  //****************************************************************motor commands

  if (!inDeadBand) {   //keep motor from jittering when +- one degree and if slats are manually moved
    if (currentangle > setTilt) {
      newDirection = moveup;
      //Serial.println("Current Angle is : " + currentangle);
      //Serial.println("Moving Up");
      motion = "moving";
      movingstatus = true;
    }
    if (currentangle < setTilt) {
      newDirection = movedown;
      //Serial.println("Current Angle is : " + currentangle);
      //Serial.println("Moving Down");
      motion = "moving";
      movingstatus = true;
    }

    if (abs(currentangle - setTilt) <= deadband) {
      inDeadBand = true;
      movingstatus = false;
      motion = "standby";
      newDirection = 0;
    }

    if (newDirection != oldDirection) {
      oldDirection = newDirection;
      Serial.println(oldDirection);
      steppersetup();
    }

    //stepper.run();  //Start
    stepper.runSpeed();  //Start

    if ((millis() - timer1) > INTERVAL1) {
    timer1 += INTERVAL1;
    sendTilt();
    }

    if (movingstatus && motionLastSent != "moving") { //ensures that moving status is send to sensor topic
    sendState();
  }
       
  }

#endif


#ifdef BLINDSenabled
  //do not read sensor
#else
  sensorRead():
#endif


}

void pollGyro() {
#ifdef BLINDSenabled
  if ((millis() - timer1) > INTERVAL1) {
    timer1 += INTERVAL1;

    Wire.beginTransmission(MPU_addr);
    Wire.write(0x3B);
    Wire.endTransmission(false);
    Wire.requestFrom(MPU_addr, 14, true);
    AcX = Wire.read() << 8 | Wire.read();
    AcY = Wire.read() << 8 | Wire.read();
    AcZ = Wire.read() << 8 | Wire.read();

    int xAng = map(AcX, minVal, maxVal, -90, 90);
    int yAng = map(AcY, minVal, maxVal, -90, 90);
    int zAng = map(AcZ, minVal, maxVal, -90, 90);

    x = RAD_TO_DEG * (atan2(-yAng, -zAng) + PI);
    y = RAD_TO_DEG * (atan2(-xAng, -zAng) + PI);
    z = RAD_TO_DEG * (atan2(-yAng, -xAng) + PI);

    if (x > xold + gyrosensitivity || x + gyrosensitivity < xold) {
      Serial.print("motion alarm = ");
      Serial.println("xaxis");
      Serial.println("-----------------------------------------");
      xold = x;
      motionX = "motion";
    }
    else
    {
      xold = x;
      motionX = "standby";
    }

    if (y > yold + gyrosensitivity || y + gyrosensitivity < yold) {
      Serial.print("motion alarm = ");
      Serial.println("yaxis");
      Serial.println("-----------------------------------------");
      yold = y;
      motionY = "motion";
    }
    else
    {
      yold = y;
      motionY = "standby";
    }

    if (z > zold + gyrosensitivity || z + gyrosensitivity < zold) {
      Serial.print("motion alarm = ");
      Serial.println("zaxis");
      Serial.println("-----------------------------------------");
      zold = z;
      motionZ = "motion";
    }
    else
    {
      zold = z;
      motionZ = "standby";
    }

    if (motionLastSent != "moving" && motionZ == "motion" && motionLastSent != "startup") { //if the blinds aren't moving, set motion parameters
      motion = "motion";
    }
    else {
      motion = "standby";
    }

    newGyroValue = y;
    currentangle = newGyroValue;

#endif
}
}

void sensorRead() {

#ifdef DHTenabled
  float newTempValue = dht.readTemperature(true); //to use celsius remove the true text inside the parentheses
  float newHumValue = dht.readHumidity();

  if (checkBoundSensor(newTempValue, tempValue, diffTEMP)) {
    tempValue = newTempValue;
    updateState = true;
  }

  if (checkBoundSensor(newHumValue, humValue, diffHUM)) {
    humValue = newHumValue;
    updateState = true;
  }
#endif

#ifdef PIRenabled
  pirValue = digitalRead(PIRPIN); //read state of the PIR Pin

  if (pirValue == LOW && pirStatus != 1) {
    pirState = "standby";
    updateState = true;
    pirStatus = 1;
  }

  else if (pirValue == HIGH && pirStatus != 2) {
    pirState = "motion detected";
    updateState = true;
    pirStatus = 2;
  }

#endif


#ifdef LDRenabled
  int newLDR = 1024 - analogRead(LDRPIN);

  if (checkBoundSensor(newLDR, LDR, diffLDR)) {
    LDR = newLDR;
    updateState = true;
  }
#endif

#ifdef BLINDSenabled

  if (checkBoundSensor(newGyroValue, gyroValue, diffGyro)) {
    gyroValue = newGyroValue;
    updateState = true;
  }
#endif

  if (updateState) {
    sendState();
    updateState = false;
  }

}




/**************************** START TRANSITION FADER *****************************************/
// From https://www.arduino.cc/en/Tutorial/ColorCrossfader
/* BELOW THIS LINE IS THE MATH -- YOU SHOULDN'T NEED TO CHANGE THIS FOR THE BASICS

  The program works like this:
  Imagine a crossfade that moves the red LED from 0-10,
    the green from 0-5, and the blue from 10 to 7, in
    ten steps.
    We'd want to count the 10 steps and increase or
    decrease color values in evenly stepped increments.
    Imagine a + indicates raising a value by 1, and a -
    equals lowering it. Our 10 step fade would look like:

    1 2 3 4 5 6 7 8 9 10
  R + + + + + + + + + +
  G   +   +   +   +   +
  B     -     -     -

  The red rises from 0 to 10 in ten steps, the green from
  0-5 in 5 steps, and the blue falls from 10 to 7 in three steps.

  In the real program, the color percentages are converted to
  0-255 values, and there are 1020 steps (255*4).

  To figure out how big a step there should be between one up- or
  down-tick of one of the LED values, we call calculateStep(),
  which calculates the absolute gap between the start and end values,
  and then divides that gap by 1020 to determine the size of the step
  between adjustments in the value.
*/
int calculateStep(int prevValue, int endValue) {
  int step = endValue - prevValue; // What's the overall gap?
  if (step) {                      // If its non-zero,
    step = 1020 / step;          //   divide by 1020
  }

  return step;
}

/* The next function is calculateVal. When the loop value, i,
   reaches the step size appropriate for one of the
   colors, it increases or decreases the value of that color by 1.
   (R, G, and B are each calculated separately.)
*/
int calculateVal(int step, int val, int i) {
  if ((step) && i % step == 0) { // If step is non-zero and its time to change a value,
    if (step > 0) {              //   increment the value if step is positive...
      val += 1;
    }
    else if (step < 0) {         //   ...or decrement it if step is negative
      val -= 1;
    }
  }

  // Defensive driving: make sure val stays in the range 0-255
  if (val > 255) {
    val = 255;
  }
  else if (val < 0) {
    val = 0;
  }
  return val;
}

/****reset***/
void software_Reset() // Restarts program from beginning but does not reset the peripherals and registers
{
  Serial.print("resetting");
  ESP.reset();
}
