FROM curlimages/curl:latest

ENV BACKEND_URL="http://localhost:3000"
ENV ASSET_DID="did:ethr:0x8b9d8a9f9a9f9a9f9a9f9a9f9a9f9a9f9a9f9a9f"

WORKDIR /app
COPY iot_source.sh .

ENTRYPOINT [ "sh", "iot_source.sh" ]