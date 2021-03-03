#!/bin/bash

pm2 start `npm root -g`/rtsp-samsung-tv/server.js
tail -f ~/.pm2/logs/server-error.log
