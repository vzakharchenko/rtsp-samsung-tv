docker build -t rtsp-samsung-tv .
docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:1.1.18_arm64
docker push vassio/rtsp-samsung-tv:1.1.18_arm64

docker tag  rtsp-samsung-tv vassio/rtsp-samsung-tv:latest_arm64
docker push vassio/rtsp-samsung-tv:latest_arm64
