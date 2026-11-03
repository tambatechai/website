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

- **English is the source** and lives in `index.html`. Spanish and Portuguese come from `assets/js/i18n.js`:
  two dictionaries keyed by the exact English string (whitespace collapsed). Every text node whose text matches a
  key is swapped before the animations start; strings built in `main.js` go through `t()`. Default is English;
  the EN · ES · PT switcher in the nav saves the choice in `localStorage` (`tamba-lang`) and reloads with
  `?lang=es` or `?lang=pt`. **Every new or changed string needs its ES and PT entries**, or it stays in English.
  The copy rules below apply to all three languages. PT says "DRE" for P&L; ES keeps "P&L".
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

**Taglines:** "Adapt. Transform. Scale." (main) · "AI that shows up on your P&L." (hero, since 2026-11-02).
The site's thesis is money in the client's pocket: more revenue or lower cost. Show the dollar figure instead of
saying "ROI" (that word appears at most once on the page, today zero). Every strong claim is backed by a rule we
follow, never a loose promise.

## Files

```
index.html              the whole page
assets/css/style.css    all styles, tokens on :root, responsive at 1020px and 640px
assets/js/main.js       all interactions (one IIFE)
assets/js/i18n.js       Spanish and Portuguese dictionaries, language detection and the switcher
assets/brand/           logos and favicons used by the site
assets/media/           the river video (river.webm, river.mp4, poster) and, temporarily, the other candidate (river-a.*)
Brand/                  source brand kit (manual PDF, brand thesis PDF, logo exploration). Do not edit.
docs/HISTORY.md         change log and decisions
```

CDN scripts (pinned versions, loaded with `defer`): GSAP 3.12.5, ScrollTrigger 3.12.5, Lenis 1.0.42.

## Page structure (top to bottom)

1. **Preloader**: symbol draws itself (ring, then T, then dot). Once per session (`sessionStorage 'tamba-seen'`).
2. **Nav**: fixed, glass when scrolled, hides on scroll down, shows on scroll up. Swaps light and dark logo by
   reading the `data-theme` of the section under it. EN · ES · PT switcher before the CTA (stays visible on
   mobile, next to the burger). Mobile: burger with full-screen menu.
3. **Hero** (navy): two columns. Left, line-mask headline reveal; right, the product (`.hero-visual`): a compact
   checkout mock of the credit pricing engine that cycles through three sales (amount, chips, rate) every few
   seconds (`initHeroMockLoop`), paused off screen. The arc draws in behind the card. Content fades and lifts
   on scroll. On mobile the card sits under the buttons.
4. **Statement** (ivory): words light up one by one with scroll (`[data-words]`). "Every project we take on has
   one job: more revenue or less cost."
5. **Solutions** `#solutions`: "Two ways it pays for itself." Two lever cards (`.levers`): More revenue (light)
   and Lower cost (navy), each with 4 product lines, a link to the form that preselects the interest, and a strip
   of product UI cropped by the card's bottom edge (`.lever-shot`: a WhatsApp sale on the revenue card, an
   accounts payable list on the cost card; their replies and status pills appear when the card scrolls in).
   Below, "How we deliver": bento with 3 equal cards (Implementation, Proven solutions, Incubation).
6. **In practice** `#practice` (navy): 4 auto-playing tabs with mock UIs, each labeled with its lever:
   Revenue · Pricing (credit rate at checkout, net margin +0.9 pts), Cost · Customer service ($3.80 instead of $11),
   Cost · Back office (61 hours back this week), Cost · Forecasting ($18,400 not overbought).
   8 seconds each, progress bar, pause when off screen. Labeled "Illustrative examples." The customer service demo
   sits in a phone frame (`.device-phone`); the others in an app window with the three-dot bar.
   Counters: `.count` with `data-to`, optional `data-dec` (decimals) and `data-money` (thousands separators).
7. **How we work** `#process`: pinned on desktop. Steps: Find the money, Adapt, Prove it, Spread it. The orbit fills
   with scroll, the dot rides the tip, number 01 to 04. Only the active step shows its description (accordion).
8. **Principles**: 4 columns (Production first, Paid back, Your data stays yours, Two markets).
9. **Incubation** `#incubation` (navy): symbol explained (T, ring, dot), symbol draws on enter.
10. **Origin / About** `#about`: "Adapt. Transform. Scale." slide in; tambaqui story; the river video (`.river`,
    muted loop, loads when within 600px, plays only while 20% visible, poster only under reduced motion); 4 trait
    cards (Adapt, Transform, Spread, Connect) each with "In the river" / "In our work"; "Tamba is not the product."
11. **Contact** `#contact` (navy): "Let's find the money in your operation." Interest pills: More revenue,
    Lower cost, Incubation. Question: "Where is your operation losing money today?" The form composes a
    `mailto:` to `CONTACT_EMAIL` in `main.js`.
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
- `<meta name="google" content="notranslate">` stops Chrome from auto-translating the page (it turned the Spanish
  version into machine Portuguese on a pt-BR browser, switcher labels included). The site offers its own languages.
- `TambaI18n.init()` is the first thing `main.js` does: the statement is split into word spans and the hero title
  into lines right after, so any translation has to land before that.
- The 4.5s no-frames fallback in `main.js` waits while `document.hidden` is true (a tab opened in the background
  gets no animation frames) and restarts Lenis when it does fire. Before 2026-11-03 it killed the preloader
  timeline in background tabs and left Lenis stopped, so the page could not scroll.
- Headless Chrome on this setup does **not** run requestAnimationFrame, so GSAP animations do not play there.
  Use `--force-prefers-reduced-motion` to check static layout. Animations must be checked in a real browser.
- Headless has a minimum window width of about 500px. To test 390px mobile, load the page inside a
  `<iframe style="width:390px">` on a temporary HTML page, and delete that page afterwards.
- A tall window makes `100svh` sections huge. For full-page captures, use a temporary copy that forces
  `.hero{min-height:900px}`, and delete it afterwards.

## Decisions confirmed by the founders

- Contact email: **info@tambatech.ai**
- Babson line (founder's wording, 2026-11-03): "Founded by a team of students from Babson College, with roots in
  Brazil." It is the lead of the "Built in Boston." block that closes the About section (`.campus-head`, overline
  "Where the team comes from"). Below it, the only photograph on the site: an aerial of the Babson campus
  in autumn (`assets/brand/babson-campus.webp` with `.jpg` fallback, from `Brand/header-grad-cunef-1920x548.jpg`).
  Rounded like the cards, no text or overlay on it. The caption row holds "Babson College, Wellesley,
  Massachusetts." on the left and the Babson horizontal logo on the right (`assets/brand/babson-college-logo.svg`,
  a copy of `Brand/Logo-Babson-College-Horizontal-RGB_(2).svg` with the Inkscape metadata stripped, original
  Babson green #006644, never recolored or distorted). One photo and one video per site: the campus (where the
  team comes from) and the river (where the name comes from), both in About. Do not add others or reuse them
  elsewhere. Photo and logo belong to Babson: same permission conversation.
- **River video** (2026-11-03): a Pexels drone clip chosen by the founder (source files in `Brand/videos/`, git
  ignored, 4K 60fps). `assets/media/river.webm` (VP9, 1280×720, 3 Mbps, 8 s, 3.2 MB) with `river.mp4` (H.264,
  2.7 MB) as fallback, poster `river-poster.webp`. No fish on screen (brand rule), no text over the video.
  Caption: "A river in the Amazon. It rises and falls by meters every year." Location unknown, so the caption
  does not name a river. Making the files: this Mac has no ffmpeg; `avconvert` (macOS) downscales to 720p
  (`--preset Preset1280x720`, also `--start/--duration` to trim) but cannot set a bitrate, so the final encode was
  done in Chrome with a canvas + MediaRecorder page posting the blob to a tiny local Python server (see
  docs/HISTORY.md, 2026-11-03). `?clip=a` swaps in the second candidate (`river-a.*`); remove it, and the
  river-a files, once the founder picks. (The seal was used until 2026-11-03.)
- **Bemol is not on the site until there is an official OK** (founder, 2026-11-03, after a few hours with an
  "Anchor partner" band under the hero). When the OK comes, rebuild the band from the 2026-11-03 entry in
  `docs/HISTORY.md` (logo from bemol.com.br in its own colors, link to https://www.bemol.com.br) and add ES/PT
  entries for its sentence.
- Visual direction (2026-11-03, after comparing with gothrust.com.br and nextautomation.us): the site shows the
  product, not stock photos or full-bleed video. Visual proof goes in the first two screens (hero mock, partner
  band, lever strips). No photos of people from image banks. A real founders photo is welcome when they take one.
- Domain intended: tambatech.ai

## Open items (ask before publishing)

- Mock UI numbers ("38 seconds", "$3.80 instead of $11", "61 hours", "$18,400", "+0.9 pts", etc.) are
  illustrative. Replace them if real results exist.
- **The "+1% net profit in one year" number** (pending): needs Denis to release it, together with the official OK
  to name Bemol. Then it goes into the anchor partner band or a proof line under the hero.
- **Commercial guarantee** (pending): "If the pilot doesn't move the number we agreed on, you don't pay to scale it."
  Changes the billing model. Decide with Daniel before adding it to the process section.
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
