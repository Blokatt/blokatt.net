#/bin/bash

red=`tput setaf 1`
green=`tput setaf 2`
orange=`tput setaf 3`
cyan=`tput setaf 6`
reset=`tput sgr0`



for f in in/*/
do
    #process directory
    ./directory.sh "$f" 
done;