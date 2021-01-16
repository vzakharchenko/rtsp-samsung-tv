docker build -t rtsp-samsung-tv .
docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:1.0.9
docker push vassio/rtsp-samsung-tv:1.0.9

docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:latest
docker push vassio/rtsp-samsung-tv:latest
