# rtsp-samsung-tv

## Description
Display  RTSP streams from IP Cameras on Samsung smart TV (Tizen TV)

# Features
 - support more than 999 RTSP streams(support for multiple IP cameras).
 - switch channels(rtsp stream) using numpad on the remote control
 - use server to convert rtsp streams using ffmpeg  
 - [group rtsp streams on the obe channel (Display 4 cameras streams on one channel)](#add-4-cameras-on-one-screen--)
 - support udp and tcp transport
 - tizen samsung tv application
 - [admin ui](#admin-ui)
 - [protect admin ui(optional)](#protect-admin-ui-using-keycloak-sso-optional)
 - [Voice Control](#voice-control)


![ipport.png](/img/ipport.png), ![camera1.png][/img/camera1.png], ![camera4.png][/img/camera4.png]

# Server Installation

I advise using a Raspberry Pi or analog: cubieboard, Orange Pi , Banana Pi, Odroid,etc with Ubuntu on board.  
[Install ubuntu on Raspberry Pi](https://ubuntu.com/download/raspberry-pi)  

1. install git, ffmpeg
```
sudo apt-get install git
sudo apt-get install ffmpeg
```
2. install node
```
sudo apt-get update
sudo apt-get install curl
sudo apt-get install snapd
sudo snap install node --channel=14/stable --classic
```
3. install pm2
```
sudo npm i pm2 -g
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ${currentUser} --hp ${HOME}
```
4. clone project
```
git clone https://github.com/vzakharchenko/rtsp-samsung-tv
```

5. start server
```
cd rtsp-samsung-tv
pm2 start server.js
```
6. open http:\\SERVER_IP:3004

7. add  Camera and click Save ![](img/addnewCamera.png) ![](img/addedNewDevice.png)


# Admin UI

### add 1 Camera: ![](img/addnewCamera.png) ![](img/addedNewDevice.png) ![camera1.png][/img/camera1.png]
### add 4 cameras on one screen ![](img/add4Cameras.png) ![](img/added4Cameras.png) ![camera4.png][/img/camera4.png]
### delete Camera ![](img/deleteCamera.png)

### Protect Admin UI using keycloak SSO (Optional)
1. download keycloak.json from the keycloak admin ui.
2. save keycloak.json to [./config/keycloak.json](/config)

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

# Install Samsung Application

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

# Voice Control
    1. Press VOICE button
    2. Say command
 **List of commands:**  
 "Channel Up" (or the same on your language)  
 "Channel Down" (or the same on your language)  
 "1","2","3","4" ... "999"  

# Remote Control

![](/img/RemoteControl.png)

