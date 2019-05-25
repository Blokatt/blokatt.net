#/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
orange=`tput setaf 3`
cyan=`tput setaf 6`
reset=`tput sgr0`



if [[ "$#" < 1 ]]; then
	echo "not enough args"
else	
	echo "$orange""Processing $1 $reset"
	
	mkdir -p out/data

	GALLERY="$(basename $1)"
	METADATA="../../out/data/gallery_$GALLERY".yaml

	mkdir -p out/"$GALLERY"

	cd $1

	rm "$METADATA" 2> /dev/null

	for f in *.png; do
		NAME=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f1);
		EXTENSION=$(echo "$f" | sed 's/\./ /g' | cut -d' ' -f2);
		THUMBOUTPATH="../../out/$GALLERY/thumbnail_$NAME.png"
		OUTPATH="../../out/$GALLERY/$f"
		
		DESCRIPTION="$(magick identify -format "%[Description]" $f 2>/dev/null)"
		

		if [[ $f -nt $THUMBOUTPATH || ! -f $THUMBOUTPATH ]]; then
			echo "$green""Converting $f -> $THUMBOUTPATH$reset"
			magick convert -strip -thumbnail '>x240' "$f" "$THUMBOUTPATH"
		fi

		cp -R -u "$f" "$OUTPATH"

		echo "- image: /assets/galleries/$GALLERY/$f" >> $METADATA
		echo "  thumbnail: /assets/galleries/$GALLERY/thumbnail_$NAME.png" >> $METADATA
		if [ ! -z "$DESCRIPTION" ]; then
			echo "  description: $DESCRIPTION" >> $METADATA
		fi
		echo "" >> $METADATA

	done
	
	cd ..
	cd ..

	mkdir -p "../../assets/galleries/$GALLERY" && cp -R -u "./out/$GALLERY" "../../assets/galleries/"
	mkdir -p "../../_data" && cp -u "./out/data/gallery_$GALLERY.yaml" "../../_data/gallery_$GALLERY.yaml"
fi