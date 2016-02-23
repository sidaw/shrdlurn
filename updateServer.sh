
gulp debug
pushd
cd ../semparse
ant core cubeworld
popd
./runFloat -server true

scp index.html sidaw@jamie:~/public_html/cubes.html
scp -r dist sidaw@jamie:~/public_html/
