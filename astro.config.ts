import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { unified } from "@astrojs/markdown-remark";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// NOTE: Package manager overrides enforce a stable Vite 7 ecosystem footprint.
// This natively resolves Astro build tracker issue #16542 while fully retaining
// the optimized @tailwindcss/vite compiler engine.

export default defineConfig({
  site: "https://note.rafifmsn.com",
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules/mermaid")) {
              return "mermaid";
            }
            if (
              id.includes("node_modules/@shikijs") ||
              id.includes("node_modules/shiki")
            ) {
              return "shiki";
            }
          },
        },
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      display: "swap",
    },
    {
      provider: fontProviders.google(),
      name: "Figtree",
      cssVariable: "--font-figtree",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      display: "swap",
    },
  ],
  integrations: [mdx(), sitemap()],
  markdown: {
    unified: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
  trailingSlash: "never",
  build: {
    format: "file",
  },
});
