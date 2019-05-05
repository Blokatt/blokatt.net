find *.mp4 *.avi | sed 's/\./ /g' | awk '{ printf "ffmpeg -i %s.%s -vf scale=-1:140 -an -c:v libvpx-vp9 -b:v 0 -r 30 -n out/thumbnail_%s.webm; \n", $1, $2, $1 }' > run.sh
./run.sh
rm run.sh