#/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
orange=`tput setaf 3`
cyan=`tput setaf 6`
reset=`tput sgr0`

function get_image_info {
	NAME="${f%%.*}"
	EXTENSION="${f##*.}"
	OUTEXT="jpg"
	THUMBOUTPATH="../../out/$GALLERY/thumbnail_$NAME.$OUTEXT"
	
	if [[ "$EXTENSION" == "gif" ]]; then
		THUMBOUTPATH="../../out/$GALLERY/thumbnail_$NAME.gif"
		OUTEXT="gif"
	fi

	OUTPATH="../../out/$GALLERY/$f"
} 

if [[ "$#" < 1 ]]; then
	echo "not enough args"
else	
	echo "$orange""Processing $1 $reset"
	
	mkdir -p out/data

	GALLERY="$(basename $1)"
	METADATA="../../out/data/gallery_$GALLERY".yaml

	mkdir -p out/"$GALLERY"

	cd $1
	FILES=$(ls *.{gif,png} | sort -V | tr '\n' ' ')	
	
	# Avoid needless processing

	SKIPDIRECTORY=true

	for f in $FILES; do
		get_image_info
		if [[ $f -nt $THUMBOUTPATH || ! -f $THUMBOUTPATH ]]; then
			SKIPDIRECTORY=false
			break;
		fi
	done
		
	if [[ "$SKIPDIRECTORY" = true ]]; then
		echo Skipping.
		exit 0
	fi

	##

	rm "$METADATA" 2> /dev/null

	for f in $FILES; do
		get_image_info		
		DESCRIPTION="$(magick identify -format "%[Description]" $f 2>/dev/null)"
		
		if [[ $f -nt $THUMBOUTPATH || ! -f $THUMBOUTPATH ]]; then
			echo "$green""Converting $f -> $THUMBOUTPATH$reset"

			if [[ "$EXTENSION" == "png" ]]; then
				#strip gamma
				magick convert -strip "$f" "$OUTPATH" 
			fi
			if [[ "$EXTENSION" == "gif" ]]; then
				#magick convert -strip -thumbnail '240x140^' "$f" "$THUMBOUTPATH"
				#gifsicle "$f" --colors=255 --resize-touch-width 240 -o "$THUMBOUTPATH"
				gifsicle --colors=255 "$f" -o "$THUMBOUTPATH"				
				gifsicle -U -O3 --colors=32 --dither=ordered --resize-touch-width 240 "$THUMBOUTPATH" -o "$THUMBOUTPATH"
				W=$(magick identify -ping -format "%w" $THUMBOUTPATH[0])
				H=$(magick identify -ping -format "%h" $THUMBOUTPATH[0])
				X0=0
				Y0=0
				X1=$W
				Y1=$H
				CROP=false
				if (( W > 240 )); then
					X0=$(($W / 2 - 120))
					X1=$(($W / 2 + 120))
					CROP=true
				fi;

				if (( H > 140 )); then
					Y0=$(($H / 2 - 70))
					Y1=$(($H / 2 + 70))
					CROP=true
				fi;
				
				if $CROP; then
					gifsicle -O3 --crop "$X0,$Y0-$X1,$Y1" "$THUMBOUTPATH" -o "$THUMBOUTPATH"
				fi
			else
				magick convert -strip -thumbnail '240x140^' "$f[0]" -quality 100 "$THUMBOUTPATH"
			fi
		fi	
		cp -R -u "$f" "$OUTPATH"

		echo "- image: /assets/galleries/$GALLERY/$f" >> $METADATA
		echo "  thumbnail: /assets/galleries/$GALLERY/thumbnail_$NAME.$OUTEXT" >> $METADATA
		if [ ! -z "$DESCRIPTION" ]; then
			echo "  description: \"$DESCRIPTION\"" >> $METADATA
		fi
		echo "" >> $METADATA

	done
	
	cd ..
	cd ..

	mkdir -p "../../assets/galleries/$GALLERY" && cp -R -u "./out/$GALLERY" "../../assets/galleries/"
	mkdir -p "../../_data" && cp -u "./out/data/gallery_$GALLERY.yaml" "../../_data/gallery_$GALLERY.yaml"
fi