docker build -t rtsp-samsung-tv .
docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:1.1.18_armv7l
docker push vassio/rtsp-samsung-tv:1.1.18_armv7l

docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:latest_armv7l
docker push vassio/rtsp-samsung-tv:latest_armv7l
