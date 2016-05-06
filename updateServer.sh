
gulp debug
pushd
cd ../semparse
ant core cubeworld
popd
./runRich -server true

scp index.html sidaw@jamie:~/public_html/shrdlurn.html
scp -r dist sidaw@jamie:~/public_html/
