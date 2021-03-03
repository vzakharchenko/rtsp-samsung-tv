FROM debian:stable
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="rtsp-samsung-tv"
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y gnupg2 ca-certificates lsb-release wget
RUN update-ca-certificates --fresh
RUN wget https://dl.yarnpkg.com/debian/pubkey.gpg
RUN apt-key add pubkey.gpg
RUN apt-get purge curl
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN wget -qO-  https://deb.nodesource.com/setup_14.x | bash
RUN apt-get update && apt-get install -y ffmpeg yarn  nodejs curl
RUN npm i pm2 -g
# Bundle APP files
RUN mkdir -p /opt/rtsp-samsung-tv/
COPY package.json /opt/rtsp-samsung-tv/package.json
COPY videoStream.js /opt/rtsp-samsung-tv/videoStream.js
COPY server.js /opt/rtsp-samsung-tv/server.js
COPY mpeg1muxer.js /opt/rtsp-samsung-tv/mpeg1muxer.js
COPY authenticationConnection.js /opt/rtsp-samsung-tv/authenticationConnection.js
COPY index.js /opt/rtsp-samsung-tv/index.js
RUN mkdir -p /opt/rtsp-samsung-tv/camera-admin-ui
RUN mkdir -p /opt/rtsp-samsung-tv/camera-admin-ui/build
COPY camera-admin-ui/package.json /opt/rtsp-samsung-tv/camera-admin-ui/package.json
COPY camera-admin-ui/public /opt/rtsp-samsung-tv/camera-admin-ui/public
COPY camera-admin-ui/src /opt/rtsp-samsung-tv/camera-admin-ui/src
COPY camera-admin-ui/config-overrides.js /opt/rtsp-samsung-tv/camera-admin-ui/config-overrides.js
RUN cd /opt/rtsp-samsung-tv/ && npm install
RUN cd /opt/rtsp-samsung-tv/camera-admin-ui/ && yarn --network-timeout 100000
RUN cd /opt/rtsp-samsung-tv/camera-admin-ui/ && yarn install
RUN cd /opt/rtsp-samsung-tv/camera-admin-ui/ && yarn build

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 3004
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]
