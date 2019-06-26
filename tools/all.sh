#/bin/bash
echo "GFX full..."
echo "============================="
cd visualgen
./convert.sh
cd ..
echo "============================="
echo "GFX thumbnails..."
echo "============================="
cd thumbgen
./convert.sh
cd ..
echo "============================="
echo "Galleries..."
echo "============================="
cd gallerygen
./convert.sh
cd ..
echo "============================="