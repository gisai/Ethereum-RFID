#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h> // para el wifi


/////////////////  RFID  ////////////////////////
#define SS_PIN  D4   //Pin D4 para el SS (SDA) del RC522
#define RST_PIN  D2    //Pin D2 para el reset del RC522

MFRC522 mfrc522(SS_PIN, RST_PIN);       //Creamos el objeto para el RC522
byte nueva[4]={0x00,0x00,0x00,0x00};
byte base[4]={0x00,0x00,0x00,0x00};
byte entrante=0;
byte comparacion=0;
byte suma=0;
char lector='A';
////////////////////   wifi   ///////////////////////////////
const char* ssid     = "GISAI NET";  //MOVISTAR_C81A es el de casa
const char* password = "XXXXX"; 

const char* host = "192.168.1.9";


void setup() {
  Serial.begin(115200); //Iniciamos la comunicación  serial a "velocidad" 115200
  SPI.begin();        //Iniciamos el Bus SPI
  mfrc522.PCD_Init(); // Iniciamos  el MFRC522
  Serial.println("Lectura del UID");

  //////////// wifi////////
  Serial.println();
  Serial.println();
  Serial.print("Conectado a: ");
  Serial.println(ssid);
   WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) { //mientras que no estes conectado, no sale de aqui
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("Conectado al wifi");
  Serial.println("Direccion IP: ");
  Serial.println(WiFi.localIP());
  
}



//////// RFID //////

void loop() {
  // Revisamos si hay nuevas tarjetas  presentes
  if ( mfrc522.PICC_IsNewCardPresent()) 
        {  
      //Seleccionamos una tarjeta
            if ( mfrc522.PICC_ReadCardSerial()) 
            {
                  // Enviamos serialemente su UID
                  Serial.print("Card UID:");
                  for (byte i = 0; i < mfrc522.uid.size; i++) {
                    nueva[i]=mfrc522.uid.uidByte[i];
                          Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "); //mete un espacio y si es un cero pone otrocero
                          Serial.print(mfrc522.uid.uidByte[i]);   
                  } 
                  Serial.println(); //mete un saltodde linea
                  // Terminamos la lectura de la tarjeta  actual
                  mfrc522.PICC_HaltA();//finaliza lectura 
            }
            Serial.println();
            entrante=1; 
  }
  if(entrante){
    entrante=0;
    for (int j=0; j<4;j++){
      if(nueva[j]==base[j]){
        suma++;
        }
      }
      if (suma!=4) {
        comparacion=1;
        for(int p=0;p<4;p++){
          base[p]=nueva[p];
          }
      }
     suma=0;     
  }

   if (comparacion){
    comparacion=0;
    Serial.print("Conectado a: ");
    Serial.println(host);
    WiFiClient client;      //creo el cliente
    const int httpPort = 3000; // antes 80 y he cambiado l 3000 a ver si va
       if (!client.connect(host, httpPort)) { //si no me conecto
        Serial.println("conexion fallida");
        return;     //empiezo el loop de nuevo
      }
      
   /* /// creacion de la url///
      String url = "/?ID=";
      url += nueva[0];
      url += ":";
      url += nueva[1];
      url += ":";
      url += nueva[2];
      url += ":";
      url += nueva[3];
      url+= "&lector=";
      url += lector;
      
      Serial.print("URL: ");
      Serial.println(url);

      /////////envio al servidor con get/////////// 
      client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" +
               "Connection: close\r\n\r\n"); // terminar la petecion 
      unsigned long timeout = millis();
        while (client.available() == 0) {
          if (millis() - timeout > 5000) {
            Serial.println(">>> Client Timeout !");
            client.stop();
            return;
          }
        }
      
        // Read all the lines of the reply from server and print them to Serial
        while (client.available()) { //si hay datos que entran
          String line = client.readStringUntil('\r');
          Serial.print(line);
        }
        Serial.println("");

*/
        /////////envio al servidor con post/////////// 
        /// creacion de la url///
          String url = "/";  
          String body="ID=";
          body +=nueva[0];
          body += ":";
          body +=nueva[1];
          body += ":";
          body +=nueva[2];
          body += ":";
          body +=nueva[3];
          body += "&lector=";
          body += lector;
          
        Serial.println(body);
        client.print(String("POST ") + url + " HTTP/1.1\r\n"
        "Host: " + host + "\r\n" +
        "Content-Type: application/x-www-form-urlencoded\r\n"+
        "Content-Length:");
        client.println(body.length());
        client.print("Connection: close \r\n\r\n"+
        body ); // terminar la petecion 
        

        unsigned long timeout = millis();
        while (client.available() == 0) {
          if (millis() - timeout > 5000) {
            Serial.println(">>> Client Timeout !");
            client.stop();
            return;
          }
        }
      
        // Read all the lines of the reply from server and print them to Serial
        while (client.available()) { //si hay datos que entran
          String line = client.readStringUntil('\r');
          Serial.print(line);
        }
        Serial.println("");
   }
}

