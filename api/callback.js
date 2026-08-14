// Tar emot GitHubs svar, vaxlar koden mot en access-token och skickar
// tillbaka den till CMS-fonstret som oppnade inloggningen.
export default async function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const { code, state } = req.query;

  if (!clientId || !clientSecret) {
    res.status(500).send("GITHUB_CLIENT_ID/SECRET saknas i miljovariablerna.");
    return;
  }

  if (!code) {
    res.status(400).send("Ingen kod fran GitHub.");
    return;
  }

  // Kontrollera att svaret hor ihop med inloggningen vi sjalva startade
  const cookies = Object.fromEntries(
    (req.headers.cookie || "")
      .split(";")
      .map((c) => c.trim().split("="))
      .filter((pair) => pair.length === 2)
  );

  if (!state || state !== cookies.cms_oauth_state) {
    res.status(400).send("Ogiltig state - inloggningen avbrots.");
    return;
  }

  try {
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    );

    const data = await tokenResponse.json();

    if (data.error || !data.access_token) {
      res.status(400).send(renderScript("error", data.error_description || data.error || "Okant fel"));
      return;
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader(
      "Set-Cookie",
      "cms_oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
    );
    res.status(200).send(
      renderScript("success", { token: data.access_token, provider: "github" })
    );
  } catch (error) {
    res.status(500).send(renderScript("error", error.message));
  }
}

// Decap lyssnar efter ett postMessage fran det har fonstret.
// Handskakningen: vi sager hej, CMS:et svarar, sen skickar vi token.
function renderScript(status, content) {
  const payload = JSON.stringify(
    `authorization:github:${status}:${JSON.stringify(content)}`
  );

  return `<!doctype html>
<html lang="sv">
  <head><meta charset="utf-8" /><title>Loggar in...</title></head>
  <body>
    <p>Loggar in, du kan stanga det har fonstret om det inte stangs sjalvt.</p>
    <script>
      (function () {
        var payload = ${payload};
        function receive(e) {
          if (e.origin !== window.location.origin) return;
          window.opener.postMessage(payload, e.origin);
          window.removeEventListener("message", receive, false);
        }
        window.addEventListener("message", receive, false);
        window.opener.postMessage("authorizing:github", "*");
      })();
    </script>
  </body>
</html>`;
}
