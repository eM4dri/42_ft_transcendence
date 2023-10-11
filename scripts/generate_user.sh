#/bin/sh
#

[ ! "$1" ] && exit 1
[[ "$1" -lt 0 ]] && exit 1

declare -i i
i=0
while true; do
  curl localhost:3000/login/fake/user_$i &>/dev/null
  i=$((i + 1))
  [[ i -eq $1 ]] && break 
done
