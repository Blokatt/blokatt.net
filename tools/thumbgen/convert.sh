#/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
orange=`tput setaf 3`
cyan=`tput setaf 6`
reset=`tput sgr0`

SKIPPED=0
function print_skipped_and_reset { 
	if [[ "$SKIPPED" > 0 ]]; then
		echo "${cyan}$SKIPPED files skipped.${reset}"
	fi;
	SKIPPED=0
}

##################################

echo "${orange}WEBM pass.${reset}"
echo "Converting."
echo ""


cd in

for f in *.mp4
do
	NAME="${f%%.*}"
	EXTENSION="${f##*.}"
	THUMB=$(echo "../out/thumbnail_"$NAME".webm");	
	ARGS=$(echo " -hide_banner -loglevel panic -i "$f" -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30");
	ARGS0=$(echo " -y -hide_banner -loglevel panic -i "$f" -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -crf 29 -pass 1 -an -f webm /dev/null -r 30");
	ARGS1=$(echo " -y -hide_banner -loglevel panic -i "$f" -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -crf 29 -pass 2 -r 30");
	
	if [ -f "$THUMB" ]; then		
		if [ "$THUMB" -ot "$f" ]; then
			echo "${orange}$THUMB${reset}"
			echo "Replacing."
			#ffmpeg $ARGS -y "$THUMB";
			ffmpeg $ARGS0 && \
			ffmpeg $ARGS1 $THUMB;
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${orange}$THUMB${reset}"
		echo "New, converting."	
		#ffmpeg $ARGS -n "$THUMB";		
		ffmpeg $ARGS0 && \
		ffmpeg $ARGS1 $THUMB;
	fi;
done

cd ..

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
			echo "${green}$NAME${reset}"
			echo "Updated thumbnail.";
			cp -f "$f" "$TARGET"
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${green}$NAME${reset}"
		echo "Fresh thumbnail.";
		cp -f "$f" "$TARGET"
	fi;
done

print_skipped_and_reset

##################################

##################################

echo "${orange}OGV pass.${reset}"
echo "Converting."
echo ""


cd in

for f in *.mp4
do
	NAME="${f%%.*}"
	EXTENSION="${f##*.}"
	THUMB=$(echo "../out/thumbnail_"$NAME".ogv");	
	ARGS=$(echo " -hide_banner -loglevel panic -i "$f" -vf scale=-1:140 -an -c:v libtheora -qscale:a 10 -r 30");
	
	if [ -f "$THUMB" ]; then		
		if [ "$THUMB" -ot "$f" ]; then
			echo "${orange}$THUMB${reset}"
			echo "Replacing."
			ffmpeg $ARGS -y "$THUMB";
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${orange}$THUMB${reset}"
		echo "New, converting."	
		ffmpeg $ARGS -n "$THUMB";		
	fi;
done

cd ..

print_skipped_and_reset

echo ""
echo "Copying."
echo ""

for f in ./out/*.ogv
do
	NAME=$(basename "$f");	
	TARGET="../../assets/visual_previews/""$NAME"	
	
	if [ -f "$TARGET" ]; then
		if [ "$TARGET" -ot "$f" ]; then	
			echo "${green}$NAME${reset}"
			echo "Updated thumbnail.";
			cp -f "$f" "$TARGET"
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${green}$NAME${reset}"
		echo "Fresh thumbnail.";
		cp -f "$f" "$TARGET"
	fi;
done

print_skipped_and_reset

##################################

##################################

echo "${orange}MP4 pass.${reset}"
echo "Converting."
echo ""

cd in

for f in *.mp4
do
	NAME="${f%%.*}"
	EXTENSION="${f##*.}"
	THUMB=$(echo "../out/thumbnail_"$NAME".mp4");	
	ARGS=$(echo " -hide_banner -loglevel panic -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -profile:v baseline -level 3.0 -crf 20 -r 30");
	#ARGS0=$(echo " -y -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 1 -f mp4 /dev/null");
	#ARGS1=$(echo " -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 2");
	
	if [ -f "$THUMB" ]; then		
		if [ "$THUMB" -ot "$f" ]; then
			echo "${orange}$THUMB${reset}"
			echo "Replacing."
			ffmpeg $ARGS -n "$THUMB";		
			#ffmpeg $ARGS0 && \
			#ffmpeg $ARGS1 -y "$THUMB";
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${orange}$THUMB${reset}"	
		echo "New, converting."	
		ffmpeg $ARGS -n "$THUMB";		
		#ffmpeg $ARGS0 && \
		#ffmpeg $ARGS1 "$THUMB";		
	fi;
done

print_skipped_and_reset

cd ..

echo ""
echo "Copying."
echo ""

for f in ./out/*.mp4
do
	NAME=$(basename "$f");	
	TARGET="../../assets/visual_previews/""$NAME"	
	
	if [ -f "$TARGET" ]; then
		if [ "$TARGET" -ot "$f" ]; then	
			echo "${green}$NAME${reset}"
			echo "Updated thumbnail.";
			cp -f "$f" "$TARGET"
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${green}$NAME${reset}"
		echo "Fresh thumbnail.";
		cp -f "$f" "$TARGET"
	fi;
done

print_skipped_and_reset

##################################

##################################

echo "${orange}PNG pass.${reset}"
echo "Converting."
echo ""

cd in

for f in *.mp4
do
	NAME="${f%%.*}"
	EXTENSION="${f##*.}"
	THUMB=$(echo "../out/thumbnail_"$NAME".png");	
	ARGS=$(echo " -hide_banner -loglevel panic -i "$f" -r 1 -vframes 1 -f image2 -vf scale=-1:140");
	#ARGS0=$(echo " -y -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 1 -f mp4 /dev/null");
	#ARGS1=$(echo " -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 2");
	 
	if [ -f "$THUMB" ]; then		
		if [ "$THUMB" -ot "$f" ]; then
			echo "${orange}$THUMB${reset}"
			echo "Replacing."
			magick convert "$f"[0] -interlace Plane -ordered-dither o8x8,7,6,7 -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -strip -thumbnail '150x150^' "$THUMB"	
			#ffmpeg $ARGS0 && \
			#ffmpeg $ARGS1 -y "$THUMB";
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${orange}$THUMB${reset}"	
		echo "New, converting."	
		magick convert "$f"[0] -interlace Plane -ordered-dither o8x8,7,6,7 -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -strip -thumbnail '150x150^' "$THUMB"		
		#ffmpeg $ARGS0 && \
		#ffmpeg $ARGS1 "$THUMB";		
	fi;
done

print_skipped_and_reset

cd ..

echo ""
echo "Copying."
echo ""

for f in ./out/*.png
do
	NAME=$(basename "$f");	
	TARGET="../../assets/visual_previews/""$NAME"	
	
	if [ -f "$TARGET" ]; then
		if [ "$TARGET" -ot "$f" ]; then	
			echo "${green}$NAME${reset}"
			echo "Updated thumbnail.";
			cp -f "$f" "$TARGET"
		else
			SKIPPED=$(($SKIPPED + 1))
		fi;
	else
		echo "${green}$NAME${reset}"
		echo "Fresh thumbnail.";
		cp -f "$f" "$TARGET"
	fi;
done

print_skipped_and_reset
##################################

rm 'ffmpeg2pass-0.log' 2>/dev/null
rm 'ffmpeg2pass-0.log.mbtree' 2>/dev/null

# find *.mp4 *.avi | sed 's/\./ /g' | awk '{ printf "
# ffmpeg -i %s.%s -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30 -n out/thumbnail_%s.webm; \n", $1, $2, $1 }' > run.sh

# ./run.sh
# rm run.sh