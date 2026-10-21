// Förhandsvisningar i CMS:et så att det ser ut som på sajten.
// createClass och h kommer från decap-cms.js.

// Delar upp en text i stycken vid tomma rader, som på sajten
const paragraphs = (text) =>
  (text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

const assetUrl = (getAsset, path) => (path ? getAsset(path).toString() : null);

const BlogPreview = createClass({
  render() {
    const { entry, getAsset, widgetFor } = this.props;
    const data = entry.get("data");
    const pubDate = data.get("pubDate");
    const date = pubDate
      ? new Intl.DateTimeFormat("sv-SE", { dateStyle: "long" }).format(
          new Date(pubDate)
        )
      : "";
    const image = assetUrl(getAsset, data.get("image"));

    return h(
      "article",
      { className: "post" },
      h(
        "header",
        { className: "post-header" },
        h("time", { className: "post-date" }, date),
        h("h1", { className: "post-title" }, data.get("title"))
      ),
      image &&
        h("img", {
          className: "post-hero",
          src: image,
          alt: data.get("imageAlt") || "",
        }),
      h("div", { className: "post-body" }, widgetFor("body"))
    );
  },
});

const ContactPreview = createClass({
  render() {
    const { entry, getAsset } = this.props;
    const get = (...path) => entry.getIn(["data", ...path]);
    const divider = assetUrl(getAsset, get("divider", "image"));

    return h(
      "div",
      { className: "contact-page" },
      h(
        "section",
        { className: "contact-section" },
        h("h2", { className: "contact-heading" }, get("intro", "heading")),
        ...paragraphs(get("intro", "text")).map((p) => h("p", {}, p)),
        h(
          "div",
          { className: "form-placeholder" },
          h("div", { className: "field" }, "Ditt namn"),
          h("div", { className: "field" }, "Din e-post"),
          h("div", { className: "field tall" }, "Ditt meddelande"),
          h("span", { className: "pill-button right" }, "Skicka")
        )
      ),
      divider &&
        h(
          "div",
          { className: "section-divider" },
          h("img", { className: "divider-img", src: divider, alt: "" })
        ),
      h(
        "section",
        { className: "inner-power-section" },
        h("h2", { className: "contact-heading" }, get("innerPower", "heading")),
        ...paragraphs(get("innerPower", "text")).map((p) => h("p", {}, p)),
        get("innerPower", "closing") &&
          h("p", { className: "cursive-text" }, get("innerPower", "closing")),
        h("span", { className: "pill-button" }, get("innerPower", "buttonText"))
      )
    );
  },
});

const HomePreview = createClass({
  render() {
    const { entry, getAsset } = this.props;
    const get = (...path) => entry.getIn(["data", ...path]);
    const items = get("testimonials", "items");

    return h(
      "div",
      {},
      h(
        "div",
        { className: "hero" },
        h("img", {
          className: "hero-img",
          src: assetUrl(getAsset, get("hero", "image")),
          alt: "",
        }),
        h("h1", { className: "hero-heading" }, get("hero", "heading"))
      ),
      h(
        "section",
        { className: "tc-wrapper" },
        h("img", {
          className: "tc-img",
          src: assetUrl(getAsset, get("coaching", "image")),
          alt: get("coaching", "imageAlt") || "",
        }),
        h(
          "div",
          { className: "text-wrapper" },
          h("h2", { className: "tc-heading" }, get("coaching", "heading")),
          get("coaching", "subheading") &&
            h("h3", { className: "tc-subheading" }, get("coaching", "subheading")),
          h(
            "div",
            { className: "tc-text" },
            ...paragraphs(get("coaching", "text")).map((p) => h("p", {}, p)),
            get("coaching", "closing") &&
              h("p", { className: "italic-text" }, get("coaching", "closing"))
          ),
          h("span", { className: "book-btn" }, get("coaching", "buttonText"))
        )
      ),
      h(
        "section",
        { className: "testimonial-section" },
        h("h2", { className: "testimonial-heading" }, get("testimonials", "heading")),
        get("testimonials", "subheading") &&
          h(
            "p",
            { className: "testimonial-subheading" },
            get("testimonials", "subheading")
          ),
        h("img", {
          className: "testimonial-img",
          src: assetUrl(getAsset, get("testimonials", "image")),
          alt: get("testimonials", "imageAlt") || "",
        }),
        h(
          "p",
          { className: "preview-note" },
          "På sajten visas omdömena ett i taget i ett bildspel."
        ),
        ...(items ? items.toJS() : []).map(({ quote, name }) =>
          h("div", { className: "slide" }, quote, h("span", {}, "- " + name))
        )
      )
    );
  },
});

const TextPagePreview = createClass({
  render() {
    const { entry, getAsset } = this.props;
    const get = (key) => entry.getIn(["data", key]);
    const image = assetUrl(getAsset, get("image"));

    return h(
      "section",
      { className: "text-page" },
      h("h2", { className: "text-page-heading" }, get("heading")),
      ...paragraphs(get("text")).map((p) => h("p", {}, p)),
      image &&
        h(
          "div",
          { className: "blob-wrapper" },
          h("img", { className: "blob-img", src: image, alt: get("imageAlt") || "" })
        )
    );
  },
});

// Samma uppmärkning som SignUpSection.astro, inklusive Mailchimp-formuläret
const mailchimpField = (label, type) =>
  h(
    "div",
    { className: "mc-field-group" },
    h("label", {}, label + " ", h("span", { className: "asterisk" }, "*")),
    h("input", { type, className: "required", disabled: true })
  );

const NewsletterPreview = createClass({
  render() {
    const { entry, getAsset } = this.props;
    const get = (...path) => entry.getIn(["data", ...path]);
    const backgrounds = [
      ["Startsidan", get("backgrounds", "home")],
      ["Kontaktsidan", get("backgrounds", "contact")],
    ];
    const text = paragraphs(get("text")).flatMap((p, i) =>
      i > 0 ? [h("br"), h("br"), p] : [p]
    );

    return h(
      "div",
      {},
      ...backgrounds.flatMap(([label, image]) => [
        h("p", { className: "sign-up-label" }, label),
        h(
          "section",
          {
            className: "sign-up-section",
            style: {
              backgroundImage: image
                ? `url("${assetUrl(getAsset, image)}")`
                : "none",
            },
          },
          h(
            "div",
            { className: "sign-up-box" },
            h(
              "div",
              { className: "sign-up-wrapper" },
              h("h2", { className: "sign-up-heading" }, get("heading")),
              h("h2", { className: "sign-up-heading-2" }, get("subheading")),
              get("tagline") &&
                h("p", { className: "cursive-text" }, get("tagline")),
              h("p", { className: "sign-up-text" }, ...text)
            ),
            h(
              "div",
              { id: "mc_embed_shell" },
              h(
                "div",
                { id: "mc_embed_signup" },
                h(
                  "form",
                  { className: "validate", onSubmit: (e) => e.preventDefault() },
                  h(
                    "div",
                    { id: "mc_embed_signup_scroll" },
                    h("h2", {}, get("boxHeading")),
                    h(
                      "div",
                      { className: "indicates-required" },
                      h("span", { className: "asterisk" }, "*"),
                      " obligatoriskt att fylla i"
                    ),
                    mailchimpField("Namn", "text"),
                    mailchimpField("Din mailadress", "email"),
                    h(
                      "div",
                      { className: "optionalParent" },
                      h(
                        "div",
                        { className: "clear foot" },
                        h("input", {
                          type: "button",
                          className: "button",
                          value: "Skicka",
                        })
                      )
                    )
                  )
                )
              )
            )
          )
        ),
      ])
    );
  },
});

CMS.registerPreviewStyle(
  "https://cdn-images.mailchimp.com/embedcode/classic-061523.css"
);
CMS.registerPreviewStyle(
  "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300..600;1,300..600&family=Montserrat:wght@300;400;600&family=Parisienne&display=swap"
);
CMS.registerPreviewStyle("/admin/preview.css");
CMS.registerPreviewTemplate("blog", BlogPreview);
CMS.registerPreviewTemplate("startsida", HomePreview);
CMS.registerPreviewTemplate("transformativcoaching", TextPagePreview);
CMS.registerPreviewTemplate("ommig", TextPagePreview);
CMS.registerPreviewTemplate("kontakt", ContactPreview);
CMS.registerPreviewTemplate("nyhetsbrev", NewsletterPreview);
