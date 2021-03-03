docker build -t rtsp-samsung-tv .
docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:1.1.18_rasp
docker push vassio/rtsp-samsung-tv:1.1.18_rasp

docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:latest_rasp
docker push vassio/rtsp-samsung-tv:latest_rasp
