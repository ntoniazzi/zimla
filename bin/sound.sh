#!/bin/bash

ROOT=$(realpath "$(dirname "$(readlink -f -- "${BASH_SOURCE[0]}")")/../")

mkdir -p $ROOT/assets/sounds
cd $ROOT/data/sounds

$ROOT/node_modules/.bin/audiosprite \
    --output $ROOT/assets/sounds/output \
    --path "." \
    --log info \
    --format howler2 \
    --samplerate 22050 \
    --bitrate 178 \
    --channels 1 \
    --export opus \
    --loop "music-loop" \
    right.wav wrong.wav die.aiff music-intro.aiff music-loop.aiff
