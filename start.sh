# /bin/sh

if [ $1 -eq 1 ]; then
    echo "Auto updating..."

    git pull
    /usr/local/bin/npm update
fi

until node mcbot.js; do
    echo "Bot stopped with exit code $?. Restarting..." >&2
    sleep 1
done