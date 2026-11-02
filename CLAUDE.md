# Tamba Tech · Website

Marketing site for **Tamba Tech**, an applied AI hub in the US and Brazil, co-founded at Babson College (Boston).
Static site: plain HTML, CSS and JS. No build step, no framework, no package manager.

The person working on this is a co-founder. They talk in **Portuguese**, but **everything on the site is in English**.
Reply to them in Portuguese.

Full change log and the reasoning behind past decisions: `docs/HISTORY.md`. Read it before large changes.

---

## Role

Act as an Apple UI/UX designer. Visual references: apple.com (pacing, huge type, scroll-driven scenes,
restraint) and https://oka.dev.br/ (GSAP + ScrollTrigger + Lenis, SVG stroke-draw preloader, line-mask headline
reveals, glass nav, animated mock interfaces instead of stock photos).

## Copy rules (non-negotiable)

- English only on the site.
- **No em dashes or en dashes** (— –) anywhere: not in copy, comments, or meta tags. Use periods, commas or a middle dot (·).
- **Must not read as AI-written.** Banned words: seamless, cutting-edge, leverage, unlock, empower, revolutionize,
  disruptive, end-to-end, game-changing, harness, journey, landscape, robust, elevate, supercharge, innovative,
  state-of-the-art, next-gen, delve, "in today's fast-paced world".
- Brand voice: sober, trustworthy, modern. "Speaks like someone who has already delivered, not someone who promises."
  - Yes: "Applied AI that already works at scale." / "We put in production in weeks what already runs elsewhere."
  - No: "The AI revolution is here!" / "Disruptive end-to-end solutions."
- Short declarative sentences. Headlines are conclusions, ending with a period.
- Do not invent clients, logos, testimonials or metrics presented as real.

Check before finishing any copy change:
```bash
grep -nP "[\x{2014}\x{2013}]" index.html assets/js/main.js assets/css/style.css   # must print nothing
```

## Brand (source: `Brand/Tamba Tech - Identidade Visual.pdf`)

**Colors** (CSS tokens in `:root` of `assets/css/style.css`)
| Token | Hex | Use |
|---|---|---|
| `--navy` | #0B1B33 | Main. Hero, dark sections, text on light |
| `--navy-up` | #13274A | Cards on navy |
| `--ivory` | #F6F3EC | Default light background |
| `--gold` | #C9A24B | Accent **on navy only** |
| `--gold-dark` | #A8862F | Symbol and large text on light |
| `--gold-text` | #7A5F22 | Small gold text on light |
| `--slate` | #5A6478 | Support text on light |
| `--mist` | #94A0B5 | Support text on navy |

- Proportion 60% backgrounds / 30% text and neutrals / **10% gold**. Gold is seasoning.
- Never white text on gold. Gold buttons use navy text.
- Never light gold (#C9A24B) on light backgrounds.
- No gradients, glows or drop shadows. (A soft fade mask on the ticker list is the only exception.)
- Contrast: 4.5:1 for text, 3:1 from 24px.

**Type:** Sora only (Google Fonts, weights 300/400/600). Display 600, lead 300, body 400,
overline 13px uppercase with 0.16em tracking.

**Logo and symbol**
- Symbol = T (the core, the hub) + open ring (the ecosystem) + dot (each company that enters the orbit).
- Always one color. Ring always open. **Dot always at the end of the orbit.** Never stretch, tilt or rotate.
- Wordmark "tamba" Sora 600 + "tech" Sora 300, lowercase, never "Tamba Tech" capitalized inside the logo.
- On navy: symbol #C9A24B, "tamba" #F6F3EC, "tech" #C9A24B. On light: symbol #A8862F, "tamba" #0B1B33, "tech" #A8862F.
- Files in `assets/brand/` (copied from `Brand/tamba-logos/`). Use `...para-fundo-escuro.svg` on navy, `...para-fundo-claro.svg` on light.

**Graphic elements**
- The big open arc with the dot is the signature. Large, bleeding off the edge, **at most one per screen**.
- The gold dot is used as list bullet, separator (Boston · Brazil) and number highlight.
- Avoid AI clichés: brains, node networks, sparkles, robots, futuristic photos.
- Name origin lives in the story (text), never as a fish illustration. "The visual speaks technology."

**Taglines:** "Adapt. Transform. Scale." (main) · "Applied AI that already works at scale." (hero).

## Files

```
index.html              the whole page
assets/css/style.css    all styles, tokens on :root, responsive at 1020px and 640px
assets/js/main.js       all interactions (one IIFE)
assets/brand/           logos and favicons used by the site
Brand/                  source brand kit (manual PDF, brand thesis PDF, logo exploration). Do not edit.
docs/HISTORY.md         change log and decisions
```

CDN scripts (pinned versions, loaded with `defer`): GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.0.42.

## Page structure (top to bottom)

1. **Preloader**: symbol draws itself (ring, then T, then dot). Once per session (`sessionStorage 'tamba-seen'`).
2. **Nav**: fixed, glass when scrolled, hides on scroll down, shows on scroll up. Swaps light and dark logo by
   reading the `data-theme` of the section under it. Mobile: burger with full-screen menu.
3. **Hero** (navy): line-mask headline reveal, arc draws in, content fades and lifts on scroll.
4. **Statement** (ivory): words light up one by one with scroll (`[data-words]`).
5. **Solutions** `#solutions`: bento with 3 cards (Implementation, Proven solutions, Incubation) and mini animations.
6. **In practice** `#practice` (navy): 3 auto-playing tabs with mock UIs (Customer service, Back office,
   Forecasting). 8 seconds each, progress bar, pause when off screen. Labeled "Illustrative examples."
7. **How we work** `#process`: pinned on desktop. The orbit fills with scroll, the dot rides the tip, number 01 to 04.
   Only the active step shows its description (accordion) so the column fits one screen.
8. **Principles**: 4 columns.
9. **Incubation** `#incubation` (navy): symbol explained (T, ring, dot), symbol draws on enter.
10. **Origin / About** `#about`: "Adapt. Transform. Scale." slide in; tambaqui story; 4 trait cards
    (Adapt, Transform, Spread, Connect) each with "In the river" / "In our work"; "Tamba is not the product."
11. **Contact** `#contact` (navy): form composes a `mailto:` to `CONTACT_EMAIL` in `main.js`.
12. **Footer**.

## Engineering rules and gotchas (learned the hard way)

- **Progressive enhancement.** `<html class="js">` is set inline in the head. Hidden-before-animation states live
  under `.js` selectors. If GSAP is missing, or no animation frame runs within 4.5s, `main.js` removes `.js`
  and inline styles so the page is fully readable. Keep this pattern for any new animated element.
- **`prefers-reduced-motion`** is respected: no preloader, no pin, no scrub, everything visible.
- **Do not use `vector-effect="non-scaling-stroke"` on paths animated with stroke-dasharray.** Dash lengths
  become screen pixels while `getTotalLength()` is in user units, and the arc renders as dashes. Use stroke widths
  in SVG units instead (hero arc 0.16, orbit fill 0.42 in a 64 viewBox).
- The global reset `img, svg { max-width: 100% }` squeezes large decorative SVGs. Oversized arcs need
  `max-width: none` (already set on `.hero-arc, .contact-arc`).
- **Pinned sections must fit in one viewport** at laptop heights (around 800px tall), or content below the fold is
  unreachable while pinned. Test at 1440×800.
- On mobile the hero arc sits in the top right corner (above the headline), never crossing text.
- Lenis drives scrolling. Anchor links go through `lenis.scrollTo`. ScrollTrigger is updated from Lenis.
- Keep the symbol geometry exact: `M32 5 A27 27 0 1 0 51.1 51.1` with the dot at (51.1, 51.1), viewBox 0 0 64 64.

## Run and verify

```bash
python3 -m http.server 8765        # then open http://localhost:8765
```
Opening `index.html` directly also works.

Screenshots without a browser (macOS, Chrome installed):
```bash
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$C" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion \
     --window-size=1440,900 --virtual-time-budget=8000 --screenshot=out.png http://localhost:8765/
```
- Headless Chrome on this setup does **not** run requestAnimationFrame, so GSAP animations do not play there.
  Use `--force-prefers-reduced-motion` to check static layout. Animations must be checked in a real browser.
- Headless has a minimum window width of about 500px. To test 390px mobile, load the page inside a
  `<iframe style="width:390px">` on a temporary HTML page, and delete that page afterwards.
- A tall window makes `100svh` sections huge. For full-page captures, use a temporary copy that forces
  `.hero{min-height:900px}`, and delete it afterwards.

## Decisions confirmed by the founders

- Contact email: **info@tambatech.ai**
- Line approved: "Founded in Boston by a team from Babson College, with roots in Brazil."
- That line shows the Babson College seal next to it (`.founded` block in the About section). Asset:
  `assets/brand/babson-college-seal.svg`, a copy of `Brand/Babson_College_seal.svg` with a viewBox added
  (`4 4 212 212`) so it scales. Keep the seal's original one color (#231f20). Never recolor or distort it.
  Use it only next to the Babson mention, not as decoration elsewhere.
- Domain intended: tambatech.ai

## Open items (ask before publishing)

- Mock UI numbers ("38 seconds", "214 documents", "94%", etc.) are illustrative. Replace them if real results exist.
- "A partner replies within two business days." Not yet confirmed.
- The form opens the visitor's email app (mailto). Consider Formspree or similar to receive submissions directly.
- Confirm Babson allows its seal on the site (institutional seals often need approval; the Babson brand
  team or the entrepreneurship center can confirm). Easy to swap for a text-only credit if needed.
- `og:image` uses the app icon. A proper 1200×630 social image would be better.

## Deployment

- Hosting: **GitHub Pages**, from branch `main`, root folder. Repo is **public** (founder's decision, Brand/ included).
- GitHub organization `tambatechai` (https://github.com/tambatechai), owner account `lucastambatechai`, email `lucas@tambatech.ai`. Repo: `tambatechai/website`, remote `origin` over SSH (key `~/.ssh/id_ed25519` on the founder's Mac).
- `CNAME` file holds `tambatech.ai`. `.nojekyll` disables Jekyll so files are served as is.
- Git identity for this repo (local config): Lucas Almeida <lucas@tambatech.ai>.
- Domain `tambatech.ai` is registered at **GoDaddy**, DNS on GoDaddy (ns03/ns04.domaincontrol.com).
- **Email runs on Microsoft 365.** Never touch the MX record (`tambatech-ai.mail.protection.outlook.com`) or
  the SPF TXT record (`v=spf1 include:spf.protection.outlook.com -all`) when changing DNS.
- **Live since 2026-11-02 at https://tambatech.ai** (www redirects to the apex). Pages: branch `main`, root,
  custom domain `tambatech.ai`, Enforce HTTPS on. Certificate by Let's Encrypt, renewed by GitHub.
- DNS records in place for GitHub Pages (website only):
  - `A @` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 (GoDaddy parking A record replaced)
  - `CNAME www` → `tambatechai.github.io`
- Publishing a change = commit and push to `main`. Pages redeploys in about a minute.
