#! /bin/bash

PR_REPO_URL=$1
BRANCH=$2

rm -rf testrepo
git clone $PR_REPO_URL -b $BRANCH testrepo >/dev/null

node check.js place.fosscell.org/test
ret=$?
if [ $ret -ne 0 ]; then
	echo -ne -1
	exit
fi

node getimg.js place.fosscell.org orig.png
node getimg.js place.fosscell.org/test new.png

echo -n $(compare -metric AE orig.png new.png /tmp/temp.png 2>&1 >/dev/null)
