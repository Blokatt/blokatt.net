#!/bin/bash
if [[ $# < 2 ]]; then
	echo Not enough argumens.
	exit 1
fi

PREFIX=$1
FILES=$(echo ${@:2})

i=0
for f in $(ls -Rt $FILES); do
	SUFFIX=$(echo "$f" | cut -d'.' -f2)
	NEW=$(echo "$PREFIX"_"$i"."$SUFFIX")
	mv "$f" "$NEW" 
	let i=i+1
done;
