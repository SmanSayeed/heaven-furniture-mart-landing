import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /* CSS in the <head> as <style>, not as <link>. The deck's whole
       stylesheet is ~18 KB gzipped, and on a 150 ms-RTT mobile link each
       render-blocking <link> cost ~900 ms before the first paint (Lighthouse,
       2026-09-03: FCP 2.7 s with three of them). First-time visitors from a
       Facebook ad are this page's entire audience; the cache argument for
       external CSS does not apply to them. */
    inlineCss: true,
  },
};

export default nextConfig;
