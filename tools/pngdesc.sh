if (( "$#" == 0 )); then
	echo "Not enough arguments."
	exit 1
fi

FILES=$(echo "${@:2}")

for i in $FILES; do
	#echo $i
	echo "$i": $(magick identify -format "%[Description]" "$i")
	magick convert "$i" -strip "$i"
	magick convert "$i" -set "Description" "$1" "$i"
done
