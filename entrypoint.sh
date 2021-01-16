#!/bin/bash

pm2 start /opt/rtsp-samsung-tv/server.js
tail -f ~/.pm2/logs/server-error.log
