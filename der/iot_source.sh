#!/bin/sh
while :
do
    timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)
    value=$(shuf -i 100-10000 -n 1)
    value=$(awk -v value="${value}" -v mult="${SCALE:-1}" 'BEGIN{print (value*mult)}')
    if [ "${NEGATIVE_CONSUME:-false}" = "true" ]; then value="-$value"; fi
    json="
    {
        \"assetDID\": \"${ASSET_DID:-missing-ASSET_DID}\",
        \"timestamp\": \"$timestamp\",
        \"value\": $value,
        \"unit\": \"Wh\"
    }"
    curl -X POST -H "Content-Type: application/json" -d "$json" "${PROSUMER_URL:-missing-PROSUMER_URL}/readings"
    sleep "${SLEEP_SEC:-5}s"
done