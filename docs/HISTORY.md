# History and decisions

Log of what was built and why. Newest at the bottom. Dates are absolute.

## 2026-11-02 · First version

**Request (from a co-founder, in Portuguese):** build the Tamba Tech website from the brand kit in `Brand/`.
Apple-standard site, with effects like https://oka.dev.br/. It must not look AI-made: no em dashes, no AI buzzwords.
Always in English. Act as an Apple UI/UX designer.

**Sources used**
- `Brand/Tamba Tech - Identidade Visual.pdf` (brand manual v1.0, Boston, October 2026): essence, symbol meaning,
  logo rules, colors, Sora type scale, arc as signature, and a site mockup ("Hero in navy, alternating sections").
- `Brand/Tamba_Tech_AI_Brand_Thesis.pdf`: name story (tambaqui) with Adapt, Transform, Propagate, Connect,
  Resilience. Why "Tamba Tech" and not "Tamba AI". Recommended tagline "Adapt. Transform. Scale."
- oka.dev.br source: GSAP 3.12 + ScrollTrigger + Lenis (lerp ~0.09), SVG stroke-draw preloader, clip and line
  reveals, count-ups, glass navbar, CSS keyframe mock UIs.

**What the company does (as stated in the manual)**
An applied AI hub in the US and Brazil. Brings solutions that already run in real operations to new companies,
implements them, and helps new AI ideas reach the market (incubation).

**Design choices**
- Sections alternate navy and ivory, as the manual's site mockup shows.
- One big arc per screen: hero (right edge), process orbit, contact (bottom left). The incubation section uses the
  full symbol instead of a loose arc.
- Mock interfaces (chat, document pipeline, forecast dashboard) instead of photos, since the brand bans futuristic
  imagery and there are no real photos yet.
- The process orbit dot rides the tip of the drawn arc, so it always sits "at the end of the orbit" as the
  brand requires.
- No rotation on any arc or symbol (the brand forbids rotating the symbol).

**Bugs found during verification and fixed**
1. Arcs rendered as dashes: `vector-effect="non-scaling-stroke"` conflicts with dasharray animation.
   Removed it and switched to stroke widths in SVG units.
2. Mobile hero arc invisible: global `svg { max-width: 100% }` squeezed it and pushed it off screen.
   Added `max-width: none` for the decorative arcs.
3. Mobile hero arc crossed the headline: moved it to the top right corner.
4. Reduced-motion mode showed the orbit dot at the start of the arc: now placed at the end, number set to 04.
5. Added a safety net: if no animation frame runs within 4.5s, fall back to the static page.

## 2026-11-02 · Founder feedback round 1

- Contact email set to **info@tambatech.ai** (`CONTACT_EMAIL` in `assets/js/main.js`).
- Asked to explain the name origin (it is in the brand files). The About section was expanded: intro
  ("Ours is named after a fish."), pronunciation (tahm·bah·KEE), 4 trait cards (Adapt, Transform, Spread,
  Connect) with "In the river" and "In our work", and the closing "Tamba is not the product. It is the story
  behind the company." plus why Tech and not AI. "Propagate" became "Spread" for plain English. "Resilience" was
  folded into Adapt to avoid repetition.
- Approved: "Founded in Boston by a team from Babson College, with roots in Brazil."

## 2026-11-02 · Founder feedback round 2

**Issue:** in "Weeks, not quarters.", from step 02 on, the screen stayed pinned and only the number changed. The
right column did not visibly change until the pin ended.

**Cause:** the right column (title + 4 full steps) was taller than a laptop viewport, so Deploy and Scale were
below the fold during the pin.

**Fix:** on desktop with JS, all step titles stay visible but only the active step shows its description
(max-height accordion), with tighter spacing and an orbit capped at 62vh. Pin length reduced from 260% to 220%.
Verified at 1440×800. Mobile is unchanged (no pin, all steps expanded).

**Rule going forward:** any pinned section must fit one viewport at about 800px tall.

## 2026-11-02 · Founder feedback round 3

- The founder added `Brand/Babson_College_seal.svg` and asked to show it where Babson is mentioned.
- Added a `.founded` block at the end of the About section: 72px seal (60px on mobile) next to
  "Founded in Boston by a team from Babson College, with roots in Brazil.", separated by a hairline.
- The source SVG had no viewBox (fixed 220×220), so a copy with `viewBox="4 4 212 212"` lives at
  `assets/brand/babson-college-seal.svg`. Original single color kept.
- Open: confirm Babson permits use of the seal.

## 2026-11-02 · First push to GitHub

- Organization created by the founder: `tambatechai` (github.com/tambatechai). Repo `website`, created private
  and empty, then `main` pushed over SSH from the founder's Mac (ed25519 key, GitHub user `lucastambatechai`).
- `gh` and Homebrew are not installed on that machine; git over SSH is the only path.
- Next: make the repo public, enable Pages (branch `main`, root), point GoDaddy DNS at GitHub Pages
  (`CNAME www` to `tambatechai.github.io`), then enforce HTTPS.

## 2026-11-02 · Site live at tambatech.ai

- Repo `tambatechai/website` switched to public by the founder (Pages needs a public repo on the Free plan).
- GoDaddy DNS edited through the founder's Chrome: parking A record replaced by the four GitHub Pages IPs,
  `CNAME www` pointed to `tambatechai.github.io`. MX, SPF and the Microsoft 365 CNAMEs untouched.
- Pages enabled from `main`, root. The `CNAME` file in the repo filled the custom domain automatically.
  DNS check passed, Let's Encrypt certificate issued within a minute, "Enforce HTTPS" turned on.
- Verified: https://tambatech.ai serves the site and www redirects to the apex. The http to https redirect
  was still propagating a few minutes after enabling Enforce HTTPS (GitHub says it can take a while).

## 2026-11-02 · Money in the pocket (co-founder feedback)

A co-founder asked to push the "money in your pocket" angle, more revenue or lower cost, and to be aggressive
about it without sounding like AI copy. The rule applied: show the dollar figure instead of talking about ROI,
and back every strong claim with a rule we follow.

- Hero: "AI that shows up on your P&L." Lead: "Every project we run has to raise revenue or cut cost. If we
  can't point to the number, we don't start." Title, meta description and og:description updated.
- Statement: "Every project we take on has one job: more revenue or less cost. We agree on the number before
  we start and we stay until you see it."
- Solutions rebuilt as "Two ways we pay for ourselves.": two lever cards (More revenue, Lower cost) listing the
  product lines, each linking to the form with the interest preselected. The three delivery cards moved under a
  "How we deliver" subhead as three equal columns.
- In practice: new first tab "Revenue · Pricing" (credit rate at checkout, margin bars, "+0.9 pts"). The three
  cost tabs got a lever label and a money line: "$3.80 instead of $11", "61 hours back this week",
  "$18,400 in stock you didn't overbuy". Footnote now says the figures are typical, not a promise.
  `countUp` learned `data-dec` and `data-money`.
- Process steps: Find the money, Adapt, Prove it, Spread it. Deploy copy: "against a dollar baseline we agree on
  up front. No baseline, no pilot."
- Principle "Measured" became "Paid back".
- Contact: "Let's find the money in your operation.", pills More revenue / Lower cost / Incubation, question
  "Where is your operation losing money today?"
- Left out on purpose: the "+1% net profit" proof band (needs the client's OK on the number and on being named)
  and the commercial guarantee (billing model decision). The client is not named anywhere.
- Checked in Chrome at 1440×800 and 500px wide: no console errors, all four demos animate, process pin fits.

## 2026-11-03 · Babson logo instead of the seal

- The founder added `Brand/Logo-Babson-College-Horizontal-RGB_(2).svg` and asked to use it in place of the seal.
- `assets/brand/babson-college-logo.svg` is a copy with the Inkscape and sodipodi metadata removed, color kept
  (Babson green #006644). The seal asset was deleted from `assets/brand/`; the source stays in `Brand/`.
- `.founded` block: 220px wide logo, vertical hairline, then the "Founded in Boston..." line. On mobile the logo
  (180px) sits above the text. Checked at 1440×800.
