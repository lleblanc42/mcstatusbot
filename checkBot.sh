#!/bin/bash

LOCKFILE="./mcbotLock"

if [ ! -e ${LOCKFILE}  ]; then
    echo "MCbot is not running, starting bot..."

    ./start.sh >> ./mcbot_output 2>&1 &
elif [ -e ${LOCKFILE}  ] && [ ! -e "/proc/$(<${LOCKFILE})" ]; then
    echo "MCbot is not running, removing old lock file and starting bot..."

    rm -rf ${LOCKFILE}

    ./start.sh >> ./mcbot_output 2>&1 &
elif [ -e ${LOCKFILE}  ] && [ -e "/proc/$(<${LOCKFILE})" ]; then
    echo "MCbot is running..."
fi