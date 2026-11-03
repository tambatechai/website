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

## 2026-11-03 · Solutions headline

- "Two ways we pay for ourselves." became "Two ways it pays for itself." (a co-founder's wording, approved by Lucas).

## 2026-11-03 · Campus photo in the origin section

- The founder brought `Brand/header-grad-cunef-1920x548.jpg`, an aerial of the Babson campus, and asked whether
  it would work near the Babson credit. Yes, as the single photograph on the site: a wide rounded figure after
  the "Tamba is not the product" block, caption below, then the logo and the "Founded in Boston" line.
- No text or overlay on the photo (brand rule: no gradients). Crop centered on the cupola (`object-position`).
- Exports: `assets/brand/babson-campus.webp` (244 KB, q78) with a progressive JPG fallback, lazy loaded.
- Open: the photo is Babson's. Ask for permission together with the logo.

## 2026-11-03 · "Built in Boston." head for the campus photo

- The founder liked the photo but found it floating, with no introduction. Fix: a head in the site's standard
  pattern above it (overline "Where the team comes from", title "Built in Boston.", lead "Founded by a team from
  Babson College, with roots in Brazil."), separated from the name story by a hairline across the container.
- The old `.founded` block is gone. The Babson logo moved to the right end of the caption row under the photo,
  so credit and image live in one place. On mobile the caption stacks, logo below the text.
- The About section now has two parallel moves: where the name comes from (the river) and where the team comes
  from (Boston).

## 2026-11-03 · More visual: product in the hero, Bemol as anchor partner, UI strips in the cards

- The founder compared the site with gothrust.com.br (five hero videos, AI-looking photos, video testimonials)
  and nextautomation.us (one skyline video, then a large interactive product demo and client logos) and felt
  ours lacked visuals. Diagnosis: not quantity of images but placement. Our first two screens were text on flat
  backgrounds and the first visual (the mock UIs) only came in the fourth screen. Decision: show the product
  early, no stock photos, no full-bleed video with an overlay (brand rule, and the most common AI-agency look).
- Hero: two columns. Right side is a checkout mock of the credit pricing engine (`.hero-visual`, `.device-hero`)
  with a "Live" tag. It enters after the headline (chips, margin bars, +0.9 pts count) and then cycles three
  sales every few seconds ($860 at 3.4%, $2,150 at 2.6%, $1,240 at 2.9%), paused when the hero is off screen.
  Title size reduced to clamp(44px, 5.9vw, 86px) so "AI that shows up" fits the left column at 1440.
- Anchor partner band under the hero (`.partner`): "Anchor partner", the Bemol logo (`assets/brand/bemol-logo.svg`,
  their own colors, from bemol.com.br) linking to https://www.bemol.com.br, and the sentence "Bemol is one of the
  largest retailers in northern Brazil, and the operation where our solutions prove themselves first." The
  founder authorized naming Bemol today; the +1% number still waits for Denis.
- Lever cards: a strip of product UI cropped by the card's bottom edge (`.lever-shot`). Revenue card: a WhatsApp
  sale (customer asks about a TV, agent holds one and sets up installments, "Sold at 9:44 pm · $499") on navy.
  Cost card: accounts payable rows with Posted / Sent to legal pills and "214 documents today · 3 needed a
  person" on ivory. Replies and pills animate in when the card gets `is-in` (same trigger as the bento cards).
- Customer service demo now lives in a phone frame (`.device-phone`: 8px navy bezel, status bar, "Store support ·
  online" header), so it reads as a product, not an illustration.
- Babson lead: "Founded by a team of students from Babson College, with roots in Brazil." (founder's wording).
- Bug found while testing: the 4.5s no-frames fallback fired in a background tab (no requestAnimationFrame),
  cleared the preloader timeline and left Lenis stopped, so the page could not scroll. It now waits while the
  document is hidden and restarts Lenis if it does fire. It also keeps the `--h` inline style on `.margin-bars i`.
- Checked in Chrome at 1440×800 (hero loop, partner band, strips, phone, no console errors) and at 390px in
  headless Chrome (iframe trick) for the hero, band and lever cards.

## 2026-11-03 · Bemol off again, three languages

- Bemol taken off the site a few hours after going up: the founder wants an official OK first. The band, its
  CSS and `assets/brand/bemol-logo.svg` are gone (the repo is public). To bring it back: section `.partner`
  between the hero and the statement, overline "Anchor partner", logo linking to bemol.com.br, sentence
  "Bemol is one of the largest retailers in northern Brazil, and the operation where our solutions prove
  themselves first." The commit before this one (444a5de) has the full markup and styles.
- EN · ES · PT switcher in the nav, English by default. Implementation: `assets/js/i18n.js` holds two
  dictionaries keyed by the English string; a tree walker swaps every matching text node before `main.js`
  animates anything. Attributes (`alt`, `aria-label`), `<title>`, meta description and `html lang` follow. The
  choice is saved in `localStorage` and the page reloads with `?lang=`, which keeps every animation path
  untouched. Strings built in JS (hero mock scenes, menu labels, form notes) go through `t()`.
- Translation choices: PT uses "DRE" for P&L ("IA que aparece no seu DRE."), ES keeps "P&L". Spanish uses
  "tú". Brand words translate ("Adaptar. Transformar. Escalar."). Currency stays in dollars (illustrative).
- Chrome auto-translated the Spanish page into Portuguese on the founder's pt-BR browser, switcher labels
  included ("EM É PT"). Added `<meta name="google" content="notranslate">`.
- Checked in Chrome at 1440×800 in ES and PT: hero, statement, levers, process, contact, no console errors.

## 2026-11-03 · The river: one video in the origin section

- Where: the founder asked whether a video fits the tambaqui part. Yes: it is the heaviest text block, it is
  story rather than product (so a real place is allowed, like the campus photo), and it gives each origin block
  one image: river for the name, campus for the team. No fish on screen (brand rule), no full-bleed video with
  text over it. I shortlisted Pexels clips; the founder then dropped two Pexels 4K 60fps clips in
  `Brand/videos/` (13455995, 4 s, low angle on a river; 15165561, 8 s, drone over a river with a canoe).
- Build: `<figure class="river">` between the tambaqui story and the trait cards. `<video muted loop playsinline
  preload="none">` with `data-src` sources; `initRiver()` loads the sources when the video is within 600px and
  plays only while 20% visible (IntersectionObserver, works with or without GSAP); under reduced motion only
  the poster shows. Rounded like the cards, caption below: "A river in the Amazon. It rises and falls by meters
  every year." ES and PT entries added.
- Encoding without ffmpeg: `avconvert --preset Preset1280x720` gives H.264 at 60 Mbps (30 MB for 4 s), the Apple
  M4V presets give either 9 Mbps or 480p. So: a throwaway page (`_rec.html`) played the 720p file into a canvas
  and recorded it with MediaRecorder (VP9 WebM and H.264 MP4 at 3 Mbps, 30 fps), posting the blob to a small
  Python receiver on port 8766. Results: river.webm 3.2 MB, river.mp4 2.7 MB (clip B); river-a.webm 5.4 MB,
  river-a.mp4 6.8 MB (clip A, more water detail). Posters via `qlmanage -t`, then Pillow to WebP.
- Clip B (drone, 8 s) is live by default; `?clip=a` shows clip A so the founder can compare in place. Raw videos
  are git ignored (`Brand/videos/`, 235 MB).
- Checked in Chrome at 1440×800: loads lazily, plays in view, pauses out of view, no console errors.
- The founder picked clip A (the low angle on the river). It is now `river.*`; clip B and the `?clip=a` switch
  are gone. He also asked about the Wix.com look (blurred, soft background behind the text): kept the video
  framed instead, see CLAUDE.md brand rules (no gradients or glows) and the reasoning in the chat of that day.
- "Sangra": the video now runs edge to edge of the viewport (100vw trick), no radius, up to 760px tall, caption
  aligned with the container. The campus photo stays inside the container with rounded corners.
