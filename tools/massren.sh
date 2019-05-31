#!/bin/bash

if (( $# < 2 )); then
	echo Not enough arguments.
	exit 1
fi

PREFIX=$1
FILES=$(echo ${@:2})

i=0

NEWFILES=" "

for f in $(ls -Rt $FILES); do
	EXTENSION="${f##*.}"
	NEW=$(echo .tempimg"$i"."$EXTENSION")
	NEWFILES="$NEWFILES $NEW"
	mv "$f" "$NEW" 
	let i=i+1
done;

FILES="$NEWFILES"

i=0

for f in $(ls -Rt $FILES); do
	EXTENSION="${f##*.}"
	NEW=$(echo "$PREFIX"_"$i"."$EXTENSION")
	mv "$f" "$NEW" 
	let i=i+1
done;
