#!/bin/bash

ROOT=$(realpath "$(dirname "$(readlink -f -- "${BASH_SOURCE[0]}")")/../")

mkdir -p $ROOT/assets/flags
cd $ROOT/assets/flags

grep flag $ROOT/data/countries.data $ROOT/data/extra.data | cut -d '"' -f4 > flags.list
wget -i flags.list
