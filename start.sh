# /bin/sh

if [ $# -eq 2 ] && [ $1 -eq "-autoupdate" ]; then
    shift

    if [ $1 -eq 1 ]; then
        git pull
        /usr/local/bin/npm update
    fi
fi

until node mcbot.js; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done