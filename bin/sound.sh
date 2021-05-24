#!/bin/bash

ROOT=$(realpath "$(dirname "$(readlink -f -- "${BASH_SOURCE[0]}")")/../")

mkdir -p $ROOT/assets/sounds
cd $ROOT/data/sounds

$ROOT/node_modules/.bin/audiosprite \
    --output $ROOT/assets/sounds/output \
    --log info \
    --format howler2 \
    --samplerate 22050 \
    --bitrate 178 \
    --channels 1 \
    --export opus \
    --loop "snd .1001.m.loop" \
    Menu1A.wav Menu1B.wav "snd .1000.music Intro.aiff" "snd .1001.m.loop.aiff"
