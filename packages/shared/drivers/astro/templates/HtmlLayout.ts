export const HtmlLayout = `---
export interface Props {
  title: string;
  siteName?: string;
  lang?: string;
  description?: string;
}

const { lang = "en", title, description, siteName } = Astro.props;
---

<!DOCTYPE html>
<html lang={lang}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="generator" content={Astro.generator} />
    {description && <meta name="description" content={description} />}
    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <!-- <meta property="og:url" content="https://www.lheido.dev" /> -->
    <!-- <meta property="og:image" content="https://ik.imagekit.io/lheido/home-4.png" /> -->
    {description && <meta property="og:description" content={description} />}
    {siteName && <meta property="og:site_name" content="Léonard Treille" />}
    <meta property="og:locale" content={lang} />
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
`
