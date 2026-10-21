import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

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

const homePage = defineCollection({
  loader: glob({ pattern: ["startsida.yml"], base: "src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      hero: z.object({
        heading: z.string(),
        image: image(),
      }),
      coaching: z.object({
        heading: z.string(),
        subheading: z.string().optional(),
        text: z.string(),
        closing: z.string().optional(),
        buttonText: z.string(),
        image: image(),
        imageAlt: z.string(),
      }),
      testimonials: z.object({
        heading: z.string(),
        subheading: z.string().optional(),
        image: image(),
        imageAlt: z.string(),
        items: z.array(
          z.object({
            quote: z.string(),
            name: z.string(),
          }),
        ),
      }),
    }),
});

const coachingPage = defineCollection({
  loader: glob({
    pattern: ["transformativcoaching.yml"],
    base: "src/content/pages",
  }),
  schema: ({}) =>
    z.object({
      heading: z.string(),
      text: z.string(),
    }),
});

const aboutPage = defineCollection({
  loader: glob({ pattern: ["ommig.yml"], base: "src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      heading: z.string(),
      text: z.string(),
      image: image(),
      imageAlt: z.string(),
    }),
});

export const collections = {
  blogPosts,
  homePage,
  coachingPage,
  aboutPage,
  contactPage,
  newsletter,
};
