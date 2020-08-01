# rtsp-samsung-tv

## Description
Display  RTSP streams from IP Cameras on Samsung smart TV (Tizen TV)

# Features
 - use server to convert rtsp streams using ffmpeg
 - support for multiple IP cameras (switch between cameras using remote control)
 - Display 4 cameras streams on one screen
 - support udp and tcp transport
 - tizen samsung tv application

# Server Installation
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

### add 1 Camera: ![](img/addnewCamera.png) ![](img/addedNewDevice.png)
### add 4 cameras on one screen ![](img/add4Cameras.png) ![](img/added4Cameras.png)
### delete Camera ![](img/deleteCamera.png)

### Protect Admin UI using keycloak SSO
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

1. Edit [/CameraDevice/main.js](/CameraDevice/main.js) and setup server ip
```js
var serverInfo = {
    ip: '192.168.1.111', // <-- Server IP
    port:'3004',
};
```
2. install java jdk
3. install Tizen SDK on your PC [https://developer.tizen.org/development/tizen-studio/download](https://developer.tizen.org/development/tizen-studio/download)
4. in "Tizen Studio Package manager" install  "Tizen SDK Tools"
5. "Extension SDK" install "extras"
6. open "Tizen Studio"
7. File -> Open Project From File System
8. open rtsp-samsung-tv/CameraDevice
9. [Enable Development mode on your TV](https://developer.samsung.com/smarttv/develop/getting-started/using-sdk/tv-device.html)
10. open Device manager
11. click "Scan device"
12. set Connection to "On"
13. right click on your connection and select "Permit install"
14. in Tizen studio select project and run it on TV

# Change Channels

![](/img/nextprev.png)

