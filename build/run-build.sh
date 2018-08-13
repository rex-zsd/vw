#!/bin/bash
set -e
basepath=$(cd `dirname $0`; pwd)
source $basepath/run.sh

run 'build' $1 