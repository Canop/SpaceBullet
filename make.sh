#!/bin/bash

# builds the production version of SpaceBullet

ROOT_PATH=`dirname $0`
BUILD_PATH="$ROOT_PATH/build"
SRC_PATH="$ROOT_PATH/src"
CLOSURE_PATH="$ROOT_PATH/tools/closure-compiler"

rm -r $BUILD_PATH
mkdir $BUILD_PATH

cat $SRC_PATH/lib/ImgLoader.js > $BUILD_PATH/sb.concat.js
cat $SRC_PATH/*.js >> $BUILD_PATH/sb.concat.js


# produces a more compact code but takes a few minutes and produces thousands of warnings
java -jar $CLOSURE_PATH/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --externs $SRC_PATH/lib/easeljs-0.6.1.min.js --externs $SRC_PATH/lib/jquery-2.0.2.min.js --js $BUILD_PATH/sb.concat.js --js_output_file $BUILD_PATH/sb.min.js

# this is the not optimizing compilation. It's faster
#java -jar $CLOSURE_PATH/compiler.jar --js $BUILD_PATH/sb.concat.js --js_output_file $BUILD_PATH/sb.min.js


rm $BUILD_PATH/sb.concat.js

cp $SRC_PATH/index.html $BUILD_PATH
cp $SRC_PATH/project.html $BUILD_PATH
cp $SRC_PATH/*.css $BUILD_PATH
cp -r $SRC_PATH/lib $BUILD_PATH
cp -r $SRC_PATH/missions $BUILD_PATH
cp -r $SRC_PATH/img $BUILD_PATH
