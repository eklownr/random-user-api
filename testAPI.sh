#!/usr/bin/env bash

BASE_URL="http://localhost:3000"

echo "=== GET: random-user ==="
curl -s "$BASE_URL/random-user" | jq '.'


echo -e "\n=== POST: add new user ==="
  
curl -s -X POST "$BASE_URL/add-user" \
  -H "Content-Type: application/json" \
  -d '{
    "results": [
      {
        "name": {
          "first": "Helle",
          "last": "Guddal"
        },
        "dob": {
          "age": 20
        },
        "email": "5rGQ5@example.com"
      }
    ]
  }'  | jq '.' 
