
CHEMIN=`dirname $0`
cd $CHEMIN

pkill sbserver

mkdir -p log
mv log/sbserver.log log/sbserver.old.log

nohup go/bin/sbserver -mimidir /var/www/dystroy/spacebullet-missions >> log/sbserver.log 2>&1 < /dev/null &

echo  tail -n 100 -f log/sbserver.log
