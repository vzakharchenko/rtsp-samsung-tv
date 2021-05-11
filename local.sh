docker stop rtsp-samsung-tv
docker rm rtsp-samsung-tv
# docker image prune -a -f

docker build -t rtsp-samsung-tv .
docker run --name=rtsp-samsung-tv  -p 3004:3004 -p 9999-10004:9999-10004  -v /home/vzakharchenko/home/rtsp-samsung-tv/config/channels.json:/opt/config/channels.json rtsp-samsung-tv
