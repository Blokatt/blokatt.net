#/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
orange=`tput setaf 3`
cyan=`tput setaf 6`
reset=`tput sgr0`

TEMPVID='/tmp/.temp.mkv'

WEBMSKIPPED=0
OGVSKIPPED=0
MP4SKIPPED=0
PNGSKIPPED=0

function test { 
	echo "asd$1"
}

function print_skipped_and_reset { 
	if [[ "$WEBMSKIPPED" > 0 ]]; then
		echo "${green}WEBM: $WEBMSKIPPED files skipped.${reset}"
	fi;

	if [[ "$OGVSKIPPED" > 0 ]]; then
		echo "${orange}OGV: $OGVSKIPPED files skipped.${reset}"
	fi;

	if [[ "$MP4SKIPPED" > 0 ]]; then
		echo "${cyan}MP4: $MP4SKIPPED files skipped.${reset}"
	fi;

	if [[ "$PNGSKIPPED" > 0 ]]; then
		echo "${cyan}PNG: $PNGSKIPPED files skipped.${reset}"
	fi;

	WEBMSKIPPED=0
	OGVSKIPPED=0
	MP4SKIPPED=0
	PNGSKIPPED=0
}

function make_temp_vid {
	if [ ! -f "$TEMPVID" ]; then
		echo "Pre-encode..."		
		ffmpeg -hide_banner -loglevel panic -i "$f" -c:v libx264 -preset ultrafast -an -crf 0 "$TEMPVID"
	fi;
} 

timestamp() {
  date +"%T"
}

function make_webm {
	make_temp_vid
	echo "$(timestamp):$green $f -> $OUT$reset"
	ARGS=$(echo " -hide_banner -loglevel panic -i "$f" -an -c:v libvpx-vp9 -crf 5 -b:v 5M");
	ARGS0=$(echo " -y -hide_banner -loglevel panic -i $TEMPVID -c:v libvpx-vp9 -b:v 10M -pass 1 -an -f webm /dev/null");
	ARGS1=$(echo " -y -hide_banner -loglevel panic -i $TEMPVID -c:v libvpx-vp9 -b:v 10M -pass 2 -an");
	ffmpeg -y -i "$f" -c:v libvpx-vp9 -pass 1 -b:v 2600K -threads 8 -speed 4 \
    -tile-columns 6 -frame-parallel 1 \
  	-an -f webm /dev/null
   	ffmpeg -i "$f" -c:v libvpx-vp9 -pass 2 -b:v 2600K -threads 8 -speed 1 \
  	-tile-columns 6 -frame-parallel 1 -auto-alt-ref 1 -lag-in-frames 25 \
  	-an -f webm "$OUT"


	#ffmpeg -hide_banner -loglevel panic -i "$TEMPVID" -b:v 1800k \
	#-minrate 900k -maxrate 2610k \
	#-quality good -crf 32 -c:v libvpx-vp9 -an \
	#-pass 1 -speed 0 "$OUT" && \
	#ffmpeg -hide_banner -loglevel panic -i "$TEMPVID" -b:v 1800k \
	#-minrate 900k -maxrate 2610k \
	#-quality good -crf 32 -c:v libvpx-vp9 -an \
	#-pass 2 -speed 1 -y "$OUT"

	#ffmpeg $ARGS0 && \
	#ffmpeg $ARGS1 "$OUT";
} 

function make_ogv {
	make_temp_vid
	echo "$(timestamp):$orange $f -> $OUT$reset"
	ARGS=$(echo " -hide_banner -loglevel panic -i $TEMPVID -an -c:v libtheora -b:v 10M");
	ffmpeg $ARGS -y "$OUT";
} 

function make_mp4 {
	make_temp_vid
	echo "$(timestamp):$cyan $f -> $OUT$reset"
	#ARGS0=$(echo " -y -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 1 -f mp4 /dev/null");
	#ARGS1=$(echo " -i "$f" -movflags +faststart -preset veryslow -vf scale=-1:140 -an -b:v 250k -r 30 -pass 2");
	
	#ARGS=$(echo " -hide_banner -loglevel panic -i $TEMPVID -movflags +faststart -preset veryslow -an -vf "format=yuv420p" -profile:v baseline -level 3.0 -crf 25");
	#ffmpeg $ARGS -n "$OUT";		
	
	ffmpeg -hide_banner -loglevel panic -y -i "$TEMPVID" -c:v libx264 -movflags +faststart -preset veryslow -b:v 3000k -pix_fmt yuv420p -profile:v baseline -level 3 -pass 1 -an -f mp4 /dev/null && \
	ffmpeg -hide_banner -loglevel panic -i "$TEMPVID" -c:v libx264 -movflags +faststart -preset veryslow -b:v 3000k -pix_fmt yuv420p -profile:v baseline -level 3 -pass 2 -an "$OUT"

	#ffmpeg $ARGS0 && \
	#ffmpeg $ARGS1 "$OUT";	


} 
function make_png {
	make_temp_vid
	echo "$(timestamp):$orange $f -> $OUT$reset"
	ARGS=$(echo " -hide_banner -loglevel panic -i $TEMPVID -an -c:v libtheora -b:v 10M");
	magick convert "$f"[0] -interlace Plane -colors 255 -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -strip "$OUT"	
} 
	
function copy_assets {
	local -n _SKIPCOUNT=$2
	for f in ./out/*.$1
	do
		NAME=$(basename "$f");	
		TARGET="../../assets/visual_full/""$NAME"	
		
		if [ -f "$TARGET" ]; then
			if [ "$TARGET" -ot "$f" ]; then	
				echo "Updated: ${cyan}$NAME${reset}"			
				cp -f "$f" "$TARGET"
			else
				_SKIPCOUNT=$(($_SKIPCOUNT + 1))
			fi;
		else
			echo "Fresh: ${cyan}$NAME${reset}"		
			cp -f "$f" "$TARGET"
		fi;
	done
}

##################################
echo -e "\nFull visual convertor.\n"
echo "Conversion: "

SDIR="$PWD"

cd in

for f in *.gif
do
	NAME=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f1);
	EXTENSION=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f2);
	OUT=$(echo "../out/full_"$NAME".webm");	
	
	rm -f "$TEMPVID"

	if [ -f "$OUT" ]; then		
		if [ "$OUT" -ot "$f" ]; then
			echo "Replace: "
			make_webm
		else
			WEBMSKIPPED=$(($WEBMSKIPPED + 1))
		fi;
	else		
		echo "New: "
		make_webm
	fi;

	OUT=$(echo "../out/full_"$NAME".ogv");	
		
	if [ -f "$OUT" ]; then		
		if [ "$OUT" -ot "$f" ]; then			
			echo "Replace: "
			make_ogv
		else
			OGVSKIPPED=$(($OGVSKIPPED + 1))
		fi;
	else		
		echo "New: "
		make_ogv	
	fi;
	
	OUT=$(echo "../out/full_"$NAME".mp4");	
	
	if [ -f "$OUT" ]; then		
		if [ "$OUT" -ot "$f" ]; then			
			echo "Replace: "
			make_mp4
		else
			MP4SKIPPED=$(($MP4SKIPPED + 1))
		fi;
	else		
		echo "New: "	
		make_mp4	
	fi;

	
	OUT=$(echo "../out/full_"$NAME".png");	
	
	if [ -f "$OUT" ]; then		
		if [ "$OUT" -ot "$f" ]; then			
			echo "Replace: "
			make_png
		else
			PNGSKIPPED=$(($PNGSKIPPED + 1))
		fi;
	else		
		echo "New: "	
		make_png	
	fi;
	
done

cd ..

print_skipped_and_reset

echo ""
echo "${green}Copying WEBM...${reset}"
copy_assets webm WEBMSKIPPED

echo "${orange}Copying OGV...${reset}"
copy_assets ogv OGVSKIPPED

echo "${cyan}Copying MP4...${reset}"
copy_assets mp4 MP4SKIPPED

echo "${cyan}Copying PNG...${reset}"
copy_assets png PNGSKIPPED

echo ""

print_skipped_and_reset

##################################

rm 'ffmpeg2pass-0.log' 2>/dev/null
rm 'ffmpeg2pass-0.log.mbtree' 2>/dev/null

# find *.mp4 *.avi | sed 's/\./ /g' | awk '{ printf "
# ffmpeg -i %s.%s -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30 -n out/OUTnail_%s.webm; \n", $1, $2, $1 }' > run.sh

# ./run.sh
# rm run.sh