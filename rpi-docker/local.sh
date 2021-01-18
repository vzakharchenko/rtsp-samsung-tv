docker stop rtsp-samsung-tv
docker rm rtsp-samsung-tv
# docker image prune -a -f

docker build -t rtsp-samsung-tv .
docker run --name=rtsp-samsung-tv  -p 3005:3004 -v rtsp-samsung-tv
