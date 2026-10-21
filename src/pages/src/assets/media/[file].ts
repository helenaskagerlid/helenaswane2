import type { APIRoute } from "astro";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// CMS:et visar bilderna i src/assets/media via adressen /src/assets/media/<fil>.
// Utvecklingsservern delar ut dem av sig själv, men på den publicerade sajten
// måste de byggas ut här. Sajten själv använder de optimerade versionerna.
const folder = join(process.cwd(), "src/assets/media");

export function getStaticPaths() {
  return readdirSync(folder)
    .filter((file) => !file.startsWith("."))
    .map((file) => ({ params: { file } }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(readFileSync(join(folder, params.file!)));
