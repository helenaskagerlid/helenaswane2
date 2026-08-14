import { randomBytes } from "node:crypto";

// Startar inloggningen: skickar anvandaren vidare till GitHub.
// Miljovariabler lases har inne, inte pa modulniva, sa att funktionen
// aldrig kraschar vid uppstart om nagot saknas.
export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    res.status(500).send("GITHUB_CLIENT_ID saknas i miljovariablerna.");
    return;
  }

  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;

  // state skyddar mot att nagon annan smyger in en egen inloggning
  const state = randomBytes(16).toString("hex");

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", req.query.scope || "repo,user");
  url.searchParams.set("state", state);

  res.setHeader(
    "Set-Cookie",
    `cms_oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`
  );
  res.redirect(302, url.toString());
}
