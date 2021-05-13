# /bin/sh

LOCKFILE="./mcbotLock"

if [ -e ${LOCKFILE}  ] && [ -e "/proc/$(<${LOCKFILE})" ]; then
    echo "Bot is already running, killing process..."
    exit 0
fi

if [ -e ${LOCKFILE}  ] && [ ! -e "/proc/$(<${LOCKFILE})" ]; then
    rm -rf ${LOCKFILE}
fi

echo $$ > ${LOCKFILE}

if [ $1 -eq 1 ]; then
    echo "Auto updating..."

    sudo apk add git

    git pull
    /usr/local/bin/npm update
fi

until node mcbot.js; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done