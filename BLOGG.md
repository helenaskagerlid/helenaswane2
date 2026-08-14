# Bloggen

## Så här fungerar det

Blogginlägg är markdown-filer i `src/content/blog-posts/`. Bilder ligger i `public/media/`.
Sidorna byggs statiskt av Astro:

- `/blogg` – listar alla publicerade inlägg, nyast först (`src/pages/blogg/index.astro`)
- `/blogg/<filnamn>` – enskilt inlägg (`src/pages/blogg/[slug].astro`)

Fält per inlägg (definieras i `src/content.config.ts`):

| Fält          | Krävs | Beskrivning                                                        |
| ------------- | ----- | ------------------------------------------------------------------ |
| `title`       | ja    | Rubrik                                                             |
| `pubDate`     | ja    | Publiceringsdatum, styr sorteringen                                |
| `image`       | ja    | Huvudbild, sökväg som `/media/bild.jpg`                            |
| `imageAlt`    | nej   | Alt-text för huvudbilden                                           |
| `description` | nej   | Ingress i listan. Tom = första ~200 tecknen av texten används      |
| `draft`       | nej   | `true` döljer inlägget från sajten helt                            |

## Skriva inlägg lokalt (fungerar redan nu)

Kör i två terminaler:

```sh
npm run dev    # sajten på http://localhost:4321
npm run cms    # CMS-proxyn (decap-server) på port 8081
```

Öppna sedan **http://localhost:4321/admin/index.html** och klicka "Logga in".
Inlägg du sparar skrivs direkt till filerna i projektet – glöm inte att committa och pusha dem.

> I dev-läge måste du skriva `/admin/index.html`. På den publicerade sajten
> räcker `/admin`.

## Sätta upp inloggning i produktion (kvar att göra)

För att Helena ska kunna skriva direkt på `helenaswane.se/admin` behöver Decap
kunna logga in mot GitHub. Två steg:

### 1. Repot ✅

Redan ifyllt i `public/admin/config.yml`:

```yaml
repo: helenaskagerlid/helenaswane2
branch: main
```

### 2. GitHub-inloggningen

GitHub tillåter inte inloggning direkt från webbläsaren – `client_secret` får
aldrig ligga i frontend-koden. Därför sköts växlingen av två serverless-
funktioner i `api/`, som Vercel kör åt oss:

| Fil | Vad den gör |
| --- | --- |
| `api/auth.js` | Skickar användaren till GitHub med ett slumpat `state` |
| `api/callback.js` | Tar emot koden, växlar den mot en token, skickar den till CMS-fönstret |

De ligger på **samma domän** som sajten, vilket gör att inga origin-inställningar
behövs. Miljövariabler läses inuti funktionerna, aldrig på modulnivå – annars
kraschar de vid uppstart på Vercel innan variablerna hunnit injiceras.

**Det som krävs för att det ska fungera:**

1. En **GitHub OAuth App** (GitHub → Settings → Developer settings → OAuth Apps):
   - Homepage URL: `https://helenaswane2.vercel.app`
   - Authorization callback URL: `https://helenaswane2.vercel.app/api/callback`
2. Två miljövariabler i **sajtens** Vercel-projekt (inte i något annat projekt):
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
3. Redeploy efter att variablerna lagts in – de läses in vid bygget.

Byter sajten domän måste callback-URL:en i GitHub-appen uppdateras till samma
domän, annars nekar GitHub inloggningen.

Helena behöver ett GitHub-konto med skrivrättigheter till repot. När hon sparar
ett inlägg committas det till `main`, och Vercel bygger om sajten automatiskt
(ca en minut innan det syns).

## Städa bort testinläggen

`test.md`, `test1.md` och `test2.md` i `src/content/blog-posts/` är gamla
lorem ipsum-tester. Radera dem när riktiga inlägg finns – eller sätt `draft: true`
för att bara dölja dem.
