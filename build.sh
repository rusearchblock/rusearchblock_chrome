#!/usr/bin/env bash
mkdir tmp
cp content.js tmp/content.js
cp manifest.json tmp/manifest.json
cp -r images tmp/images
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=tmp