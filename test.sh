#!/bin/bash

PR_REPO_URL=$1
BRANCH=$2

rm -rf testrepo
git clone $PR_REPO_URL -b $BRANCH testrepo >/dev/null

node check.js place.fosscell.org/test > /dev/null
ret=$?
if [ $ret -ne 0 ]; then
	echo -ne -1
	exit
fi

node getimg.js place.fosscell.org orig.png > /dev/null
node getimg.js place.fosscell.org/test new.png > /dev/null

echo -n $(compare -metric AE orig.png new.png /tmp/temp.png 2>&1 >/dev/null)
