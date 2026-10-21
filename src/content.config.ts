import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const transformativeCoaching = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/transformative-coaching",
  }),
  schema: ({}) =>
    z.object({
      title: z.string(),
      subtitle: z.string(),
    }),
});

const testimonials = defineCollection({
  loader: glob({
    pattern: ["*.md"],
    base: "src/content/testimonials",
  }),
  schema: ({}) =>
    z.object({
      name: z.string(),
    }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: ["*.md"], base: "src/content/blog-posts" }),
  schema: ({}) =>
    z.object({
      title: z.string(),
      image: z.string(),
      imageAlt: z.string().optional(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      draft: z.boolean().default(false),
    }),
});

const contactPage = defineCollection({
  loader: glob({ pattern: ["kontakt.yml"], base: "src/content/pages" }),
  schema: ({}) =>
    z.object({
      intro: z.object({
        heading: z.string(),
        text: z.string(),
      }),
      divider: z.object({
        image: z.string(),
      }),
      innerPower: z.object({
        heading: z.string(),
        text: z.string(),
        closing: z.string().optional(),
        buttonText: z.string(),
        buttonLink: z.string(),
      }),
    }),
});

const newsletter = defineCollection({
  loader: glob({ pattern: ["nyhetsbrev.yml"], base: "src/content/pages" }),
  schema: ({}) =>
    z.object({
      heading: z.string(),
      subheading: z.string(),
      tagline: z.string().optional(),
      text: z.string(),
      boxHeading: z.string(),
      backgrounds: z.object({
        home: z.string(),
        contact: z.string(),
      }),
    }),
});

export const collections = {
  transformativeCoaching,
  testimonials,
  blogPosts,
  contactPage,
  newsletter,
};
