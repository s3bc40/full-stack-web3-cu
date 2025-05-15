curl --request POST \
  --url https://api.circle.com/v1/w3s/compliance/screening/addresses \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer MYAPIKEY' \
  --data '
{
  "idempotencyKey": "8f80fab9-47e8-4863-8d51-3d2989638f40",
  "address": "0x15d34aaf54267db7d7c367839aaf71a00a2c6a65",
  "chain": "ETH-SEPOLIA"
}
'