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

### 2. Koppla på GitHub-inloggning

Decap behöver en liten OAuth-tjänst eftersom GitHub inte tillåter inloggning
direkt från webbläsaren. Enklaste vägen på Vercel:

1. Skapa en **GitHub OAuth App**: GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://helenaswane.vercel.app`
   - Authorization callback URL: `https://<din-oauth-proxy>.vercel.app/callback`
   - Spara **Client ID** och **Client Secret**.
2. Deploya en färdig OAuth-proxy till Vercel (t.ex.
   [`vencax/netlify-cms-github-oauth-provider`](https://github.com/vencax/netlify-cms-github-oauth-provider))
   och sätt miljövariablerna `OAUTH_CLIENT_ID` och `OAUTH_CLIENT_SECRET`.
3. Sätt proxyns URL som `base_url` i `public/admin/config.yml`:

   ```yaml
   base_url: https://<din-oauth-proxy>.vercel.app
   ```

Helena behöver ett GitHub-konto med skrivrättigheter till repot. När hon sparar
ett inlägg committas det till `main`, och Vercel bygger om sajten automatiskt
(ca en minut innan det syns).

Alternativ om GitHub-konton känns krångligt: byt backend till
[Sveltia CMS](https://github.com/sveltia/sveltia-cms) (samma config-format) eller
en tjänst med egen inloggning, t.ex. Tina eller Netlify Identity via Netlify.

## Städa bort testinläggen

`test.md`, `test1.md` och `test2.md` i `src/content/blog-posts/` är gamla
lorem ipsum-tester. Radera dem när riktiga inlägg finns – eller sätt `draft: true`
för att bara dölja dem.
