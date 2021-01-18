FROM debian:stable
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="rtsp-samsung-tv"
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y gnupg2 ca-certificates lsb-release wget
RUN update-ca-certificates --fresh
RUN apt-get purge curl
RUN wget -qO-  https://deb.nodesource.com/setup_14.x | bash
RUN apt-get update && apt-get install -y ffmpeg yarn  nodejs curl
RUN npm i pm2 -g
# Bundle APP files
RUN mkdir -p /opt/rtsp-samsung-tv/
COPY package.json /opt/rtsp-samsung-tv/package.json
COPY videoStream.js /opt/rtsp-samsung-tv/videoStream.js
COPY server.js /opt/rtsp-samsung-tv/server.js
COPY mpeg1muxer.js /opt/rtsp-samsung-tv/mpeg1muxer.js
COPY keycloakConnection.js /opt/rtsp-samsung-tv/keycloakConnection.js
COPY index.js /opt/rtsp-samsung-tv/index.js
RUN mkdir -p /opt/rtsp-samsung-tv/camera-admin-ui
COPY camera-admin-ui/build /opt/rtsp-samsung-tv/camera-admin-ui/build
RUN cd /opt/rtsp-samsung-tv/ && npm install

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 3004
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]
