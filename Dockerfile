FROM debian:stable
MAINTAINER Vasyl Zakharchenko <vaszakharchenko@gmail.com>
LABEL author="Vasyl Zakharchenko"
LABEL email="vaszakharchenko@gmail.com"
LABEL name="rtsp-samsung-tv"
ENV DEBIAN_FRONTEND noninteractive
RUN apt-get update && apt-get install -y gnupg2 ca-certificates lsb-release wget
RUN update-ca-certificates --fresh
RUN apt-get purge curl
RUN apt-get update && apt-get install -y ffmpeg yarn  nodejs npm curl
RUN npm i pm2 -g
RUN npm i rtsp-samsung-tv@1.1.20 -g

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
COPY entrypoint.sh /opt/entrypoint.sh
RUN  chmod +x /opt/entrypoint.sh
EXPOSE 3004
ENTRYPOINT ["/opt/entrypoint.sh"]
#CMD [ "pm2-runtime", "start", "pm2.json" ]
