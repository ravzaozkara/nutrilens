# API Reference — VS Code REST Client

`api.http` contains one request per endpoint in [VS Code REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) format. It is plain text and readable without any tooling.

## Setup

1. Install the **REST Client** extension in VS Code (`humao.rest-client`).
2. Open `docs/api.http`.
3. Start the backend: `uvicorn app.main:app --reload` (see the root README for full setup).

## Authentication

The file has two variables at the top:

```
@baseUrl = http://localhost:8000
@token = paste_access_token_here
```

To authenticate:
1. Click **Send Request** above `POST /auth/login`.
2. Copy the `access_token` value from the response body.
3. Paste it into the `@token` line at the top of the file (replace `paste_access_token_here`).
4. All requests that include `Authorization: Bearer {{token}}` will now use your token.

Tokens expire after 60 minutes. Repeat the login step if requests start returning `401`.

## Image analysis

The `POST /analyze-image` request uses multipart form data. Replace the `< ./sample_meal.jpg` path with the absolute path to a real image file on your machine:

```
< /home/yourname/pictures/meal.jpg
```

The backend field name is `file` (not `image`).

## Notes

- All requests hit `localhost:8000` by default. Change `@baseUrl` if your backend runs elsewhere.
- The backend is in **simulation mode** unless `backend/model/food_model.pt` is present. Analysis results will be randomly selected food labels.
- The `/auth/token` OAuth2 endpoint (for the `/docs` Authorize button) is not included here — use `/auth/login` for the JSON variant.
