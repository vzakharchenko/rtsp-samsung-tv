# rtsp-samsung-tv
[![npm version](https://badge.fury.io/js/rtsp-samsung-tv.svg)](https://badge.fury.io/js/rtsp-samsung-tv)
## Description
Display  RTSP streams from IP Cameras on Samsung smart TV (Tizen TV)

# Features
 - support more than 999 RTSP streams.
 - switch channels(rtsp stream) using numpad on the remote control
 - use server to convert rtsp streams using ffmpeg
 - [group rtsp streams on the obe channel (Display 4 cameras streams on one channel)](#add-4-cameras-on-one-screen---)
 - support udp and tcp transport
 - tizen samsung tv application
 - [admin ui](#admin-ui)
 - [protect admin ui(optional)](#protect-admin-ui-using-keycloak-sso-optional)
 - [Voice Control](#voice-control)
 - [Remote Control](#remote-control)
 -  Supports parameters before "-i" and after it
 - [Raspberry Pi Hw acceleration](#raspberry-pi-hw-acceleration-on-ffmpeg-raspbian-lite-image)


![ipport.png](/img/ipport.png), ![camera1.png](/img/camera1.png), ![camera4.png](/img/camera4.png)
# Server Installation
```bash
sudo apt-get install ffmpeg
wget -qO- https://getpm2.com/install.sh | bash
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ${currentUser} --hp ${HOME}
sudo npm i rtsp-samsung-tv -g
sudo pm2 start `npm root -g`/rtsp-samsung-tv/server.js
sudo pm2 save
```
open ```http:\\<SERVER_IP>:3004``` and add a new  Camera and click Save ![](img/addnewCamera.png) ![](img/addedNewDevice.png)

# Install Samsung TV Application(Tizen Application)

1. install java jdk  
2. install Tizen SDK on your PC [https://developer.tizen.org/development/tizen-studio/download](https://developer.tizen.org/development/tizen-studio/download)  
3. in "Tizen Studio Package manager" install  "Tizen SDK Tools"  
4. "Extension SDK" install "extras"  
5. open "Tizen Studio"  
6. File -> Open Project From File System  
7. open rtsp-samsung-tv/CameraDevice  
8. [Enable Development mode on your TV](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)  
9. open Device manager  
10. click "Scan device"  
11. set Connection to "On"  
12. right click on your connection and select "Permit install"  
13. in Tizen studio select project and run it on TV.Channel  
14. setup server ip and port on TV. ![](/img/ipport.png)  


# Admin UI
## **Url**:  ```http:\\<SERVER_IP>:3004```
![](/img/AdminUi.png)

where:
**File** -  path to config file.  
**Default Transport** - Default RTSP Transport. Applicable to all cameras  
**Default RTSP FFmpeg parameters** - Parameters before "-i". Applicable to all cameras (ffmpeg ```<PREPARAMETERS>``` -i rtsp://stream)  
**Default Encode FFmpeg parameters** - Parameters before "-i". Applicable to all cameras (ffmpeg ```<PREPARAMETERS>``` -i rtsp://stream ```<POSTPARAMETERS>```)  
```
ffmpeg <Default Pre ffmpeg Parameters> -i rtsp://stream <Default Post ffmpeg Parameters>
```

## Camera Specific Columns:
**Status** - now on TV.  
**Camera** - channel number.  
**Camera Mode** - "1 Camera" : one camera on screen, "4 Cameras" : 4 cameras on one screen .  
**rtsp Streams** - rtsp streams .  
**Transport** - Camera RTSP Transport.  
**RTSP FFmpeg parameters** - Parameters before "-i". Applicable to all cameras (ffmpeg ```<PREPARAMETERS>``` -i rtsp://stream)  
**Encode FFmpeg parameters** - Parameters after "-i". Applicable to all cameras (ffmpeg ```<PREPARAMETERS>``` -i rtsp://stream ```<POSTPARAMETERS>```)  
```
ffmpeg <Pre ffmpeg Parameters> -i rtsp://stream <Post ffmpeg Parameters>
```

## **add 1 Camera**: ![](img/addnewCamera.png) ![](img/addedNewDevice.png) ![camera1.png](/img/camera1.png)
## **Add 4 cameras on one screen**: ![](img/add4Cameras.png) ![](img/added4Cameras.png) ![camera4.png](/img/camera4.png)
## **delete Camera** ![](img/deleteCamera.png)

# Protect Admin UI using keycloak SSO (Optional)
1. download keycloak.json from the keycloak admin ui.   
2. save keycloak.json to [./config/keycloak.json](/config) or /opt/config  
  
example of keycloak.json  
```json
{
  "realm": "RTSP",
  "auth-server-url": "https://localhost:8090/auth",
  "ssl-required": "external",
  "resource": "testClient",
  "credentials": {
    "secret": "secret"
  },
  "confidential-port": 0
}
```
# Raspberry Pi Hw acceleration on ffmpeg ([Raspbian Lite Image](https://www.raspberrypi.org/downloads/raspberry-pi-os/))
1. build ffmpeg with mmal feature
```bash
sudo apt-get install libomxil-bellagio-dev
sudo apt-get install libomxil-bellagio-bin
git clone https://github.com/FFmpeg/FFmpeg
cd FFmpeg
git checkout origin/release/3.2
sudo ./configure --arch=armel --target-os=linux --enable-gpl --enable-mmal  --enable-omx --enable-omx-rpi --enable-nonfree
sudo make -j4
sudo make install
```
2. ![](/img/RaspberryPiHW.png)

# Voice Control
    1. Press VOICE button
    2. Say command
 **List of commands:**
 "Channel Up" (or the same on your language)
 "Channel Down" (or the same on your language)
 "1","2","3","4" ... "999"

# Remote Control

![](/img/RemoteControl.png)

