#! /bin/bash

FILE=place.py
PR_REPO_URL=$1
BRANCH=$2

rm -rf testrepo
git clone $PR_REPO_URL -b $BRANCH testrepo >/dev/null

node getimg.js localhost orig.png
node getimg.js localhost/test new.png

echo -n $(compare -metric AE orig.png new.png /tmp/temp.png 2>&1 >/dev/null)
