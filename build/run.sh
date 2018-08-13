#!/bin/bash
DEFAULT_NAME='wsc'
run () {
  env=$1
  appName=$2

  basePath=$(cd `dirname $0`; cd '../'; pwd)

  if test -d "$basePath/dist"
  then
    distPath="$basePath/dist"

    if test ${#appName} -gt 0
    then
      distPath="$distPath-$appName"
    fi

    echo -e "\033[32;1m>\033[0m cd $distPath"
    echo -e "\033[32;1m>\033[0m rm -rf ./components ./pages ./packages ./app.js ./app.wxss"

    echo 

    rimraf "$distPath/components"
    rimraf "$distPath/pages"
    rimraf "$distPath/zanui"
    rimraf "$distPath/zanui-weapp"
    rimraf "$distPath/packages"
    rimraf "$distPath/app.js $distPath/app.wxss"
  fi
  
  export app=$appName

  # 设置默认应用名 wxc，以便加载配置文件
  [ -z "$appName" ] && appName=$DEFAULT_NAME
  echo -e "\033[32m使用配置文件\033[0m ./build/webpack.config.$appName.js"
  if test $env = 'dev'
  then
    export NODE_ENV=development

    webpack --mode development --watch --config ./build/webpack.config.$appName.js
  elif test $env = 'build'
  then
    echo 
    echo -e '\033[32;1m>\033[0m yarn install\n'

    SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ yarn

    export NODE_ENV=production

    webpack --mode production --config ./build/webpack.config.$appName.js
  fi
}