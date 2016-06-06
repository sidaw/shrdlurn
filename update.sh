#!/bin/sh
# assumes we have a couple of other repos for other branchs sitting in the right directory structure
# we just copy some files over

cp -r ../shrdlurn-acl16-demo/index.html ../shrdlurn-acl16-demo/dist ./acl16
cp -r ../shrdlurn/index.html ../shrdlurn/dist ./rich
