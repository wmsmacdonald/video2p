#!/usr/bin/env bash
ssh quotacle.com "
cd /data/video2p;
git pull;
npm install;
npm start"
