#! /bin/bash

FILE=place.py
OG_REPO_DIR=/home/cliford/place
PR_REPO_URL=$1
BRANCH=$2

cd /tmp
rm -rf testrepo
git clone $PR_REPO_URL -b $BRANCH testrepo >/dev/null
cd testrepo
DISPLAY=:1 timeout 20s python3 $FILE >/dev/null
ret=$?
if [ $ret -eq 124 ]; then
	echo -ne -2
	exit
elif [ $ret -ne 0 ]; then
	echo -ne -1
	exit
fi

echo -ne "\ndone()" >>$FILE
DISPLAY=:1 python3 $FILE >/dev/null &
pid=$!
sleep 1
DISPLAY=:1 xwd -root -silent | convert xwd:- png:/tmp/screenshot1.png
kill -9 $pid # pending null reroute

cd $OG_REPO_DIR
git pull >/dev/null
cp $FILE testrun.py
echo -ne "\ndone()" >>testrun.py
DISPLAY=:1 python3 testrun.py >/dev/null &
pid=$!
sleep 1
DISPLAY=:1 xwd -root -silent | convert xwd:- png:/tmp/screenshot2.png
kill -9 $pid >/dev/null

echo -n $(compare -metric AE /tmp/screenshot1.png /tmp/screenshot2.png /tmp/temp.png 2>&1 >/dev/null)
