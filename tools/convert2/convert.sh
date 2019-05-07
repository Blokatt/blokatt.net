#/bin/bash

# Copy over

echo "Converting."
echo ""
SKIPPED=0

function print_skipped_and_reset { 
	if [[ "$SKIPPED" > 0 ]]; then
		echo "$SKIPPED files skipped."
	fi;
	SKIPPED=0
}

for f in *.mp4
do
	NAME=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f1);
	EXTENSION=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f2);
	THUMB=$(echo "./out/thumbnail_"$NAME".webm");	
	ARGS=$(echo " -i "$f" -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30");
	
	if [ -f "$THUMB" ]; then		
		if [ "$THUMB" -ot "$f" ]; then
			echo "$THUMB";
			echo "Replacing."
			ffmpeg $ARGS -y "$THUMB";
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "$THUMB";	
		echo "New."	
		ffmpeg $ARGS -n "$THUMB";		
	fi;
done

print_skipped_and_reset

echo ""
echo "Copying."
echo ""

for f in ./out/*.webm
do
	NAME=$(basename "$f");	
	TARGET="../../assets/visual_previews/""$NAME"	
	
	if [ -f "$TARGET" ]; then
		if [ "$TARGET" -ot "$f" ]; then	
			echo "$NAME"
			echo "Updated thumbnail.";
			cp -f "$f" "$TARGET"
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "$NAME"
		echo "Fresh thumbnail.";
		cp -f "$f" "$TARGET"
	fi;
done

print_skipped_and_reset

# find *.mp4 *.avi | sed 's/\./ /g' | awk '{ printf "
# ffmpeg -i %s.%s -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30 -n out/thumbnail_%s.webm; \n", $1, $2, $1 }' > run.sh

# ./run.sh
# rm run.sh