#include <dht.h>
#include <RCSwitch.h>
#include <Wire.h>
#include <rgb_lcd.h>

rgb_lcd lcd;
RCSwitch mySwitch = RCSwitch();
const int colorR = 255;
const int colorG = 0;
const int colorB = 0;

#define DHT11_PIN 5

void setup() {
  Serial.begin(115200);
  mySwitch.enableReceive(0);  // Receiver on interrupt 0 => that is pin #2
  lcd.begin(16, 2);
  lcd.setRGB(colorR, colorG, colorB);
  // Print a message to the LCD.
  lcd.setCursor(0,0);
  lcd.print("Hey, There!");
}

void loop() {
  // put your main code here, to run repeatedly:
  lcd.setCursor(0,0);
  lcd.print("Hey, There!");
  if (mySwitch.available()) {
    
    int value = mySwitch.getReceivedValue();
    if (value == 0) {
      Serial.print("Unknown encoding");
    } else {

      if (value == 100) {
        lcd.setCursor(0,0);
        lcd.print("ACCESS GRANTED");
        delay(10000);
        lcd.clear();
      } else if (value == 200) {
        
        lcd.setCursor(0,0);
        lcd.print("ACCESS DENIED");
        delay(10000);
        lcd.clear();
      } else if (value == 300) {
        
        lcd.setCursor(0,0);
        lcd.print("Sorry, Try Again");
        delay(10000);
        lcd.clear();
      } else if (value == 400) {
        
        lcd.setCursor(0,0);
        lcd.print("Called Owner");
        delay(10000);
        lcd.clear();
      } else if (value == 500) {
        
        lcd.setCursor(0,0);
        lcd.print("Take pic again");
        delay(10000);
        lcd.clear();
      }
      value = 999;
      Serial.print("Received ");
      Serial.print( mySwitch.getReceivedValue() );
      Serial.print(" / ");
      Serial.print( mySwitch.getReceivedBitlength() );
      Serial.print("bit ");
      Serial.print("Protocol: ");
      Serial.println( mySwitch.getReceivedProtocol() );
    }
    Serial.print("Before Reset Available");
    mySwitch.resetAvailable();
  }
}
