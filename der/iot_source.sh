#!/bin/sh
while :
do
    timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)
    value=$(shuf -i 100-10000 -n 1)
    json="
    {
        \"readings\": [{
            \"timestamp\": \"$timestamp\",
            \"value\": $value
        }],
        \"unit\": \"Wh\"
    }"
    curl -X POST -H "Content-Type: application/json" -d "$json" "${BACKEND_URL}/readings/${ASSET_DID}"
    sleep 5s
done