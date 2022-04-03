FROM curlimages/curl:latest

ENV PROSUMER_URL="MISSING-PROSUMER_URL"
ENV ASSET_DID="MISSING-ASSET_DID"
ENV SLEEP_SEC="5"

WORKDIR /app
COPY iot_source.sh .

ENTRYPOINT [ "sh", "iot_source.sh" ]