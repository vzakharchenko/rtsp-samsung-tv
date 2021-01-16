docker build -t rtsp-samsung-tv .
docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:1.1.18
docker push vassio/rtsp-samsung-tv:1.1.18

docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:latest
docker push vassio/rtsp-samsung-tv:latest
