# Moving Help Columbus Ohio — local redesign

## Open the website
Double-click `OPEN WEBSITE.html` in this folder, or open `dist/index.html` directly. Everything needed for the design is included locally. No installation is required.

Optional preview server: open a terminal in this folder and run `python -m http.server 8788 --bind 127.0.0.1 --directory dist`. Visit http://127.0.0.1:8788. Stop with Ctrl+C.

## What changed
- Clear service groups replace the lengthy original list.
- Mobile layouts, large tap targets, collapsible navigation, and a fixed call/plan bar.
- Navy and orange visual identity, generated hero photography, glass overlay, gentle floating and cursor tilt effects.
- Two transparent local package cards with terms.
- Owner introduction, FAQs, and three visible, attributed review excerpts.
- A quote-message builder: prepares a text for the visitor to review and send; it does not submit a lead, collect payment, or store personal information.
- A scroll-driven exploded-view moving scene: a couch, bed, ladder, and boxes float from a house into an open truck, the doors close, and the truck drives away. It includes play/pause, replay, scrubbing, and reduced-motion support.
- Reduced-motion support, visible keyboard focus, semantic structure, and an accessible menu.

## Business facts and sources
Reviewed September 24, 2026:
- https://movinghelpcolumbusohio.com/ — owner Bruce Taylor; business phone 614-717-3969; service descriptions; $350/2-hour and $650/4-hour packages and qualifications.
- https://reviews.birdeye.com/moving-help-columbus-ohio-166279034172931 — three short Google review excerpts attributed to B Rigel, Shawn Harrold, and LJP. No review text, star ratings, or overall scores were invented. Excerpts are selected comments, not the full review history. Relative review dates were omitted to avoid stale dates.

## Images
`dist/assets/moving-hero.png` is AI-generated concept photography featuring fictional people, not the actual crew or a completed company move. The original website's stock imagery was used only during inspection and is not in the finished distribution. No actual company logo was found in the inspected text-based header; the arrow mark is a proposed brand treatment.

The exploded-view scene uses three additional generated assets: `animation-house.png`, `animation-trucks.png`, and `animation-cargo.png`. The house is a concept setting and the truck is unbranded; they are not photos of the company, its vehicles, or its crew. The generation prompts are preserved in `ANIMATION-PROMPTS.txt`.

## Before a real launch
This is an independent local redesign, not a replacement of the live website. Hosted separately as an independent concept on GitHub Pages. No changes to the real business domain were made. Contact links reach the real business. Confirm brand approval, package pricing, promotions, service scope, photo suitability, and review usage with the owner. Review snippets are static and will not update automatically.

Existing reviews/gallery/supplies/contact destinations remain accessible through explicit links to the original website. The original site’s newsletter/contact backend is not connected here; the contact link preserves access to those live functions. Original Pay Now links pointed to `#`, so no unsupported payment flow is represented in this concept. Connect an approved contact/newsletter/payment provider if those functions should move into this new site.

## Files
- dist/index.html — content
- dist/styles.css — appearance and mobile styling
- dist/script.js — menu, animation, and message builder
- dist/moving-scene.js — exploded-view scroll and playback sequence
- dist/assets/moving-hero.png — generated image
- dist/assets/animation-house.png, animation-trucks.png, animation-cargo.png — generated scene artwork
- TODO.md — completed work checklist
- work/ — source research and local validation artifacts (not needed to view the website)

The ZIP contains only the finished website, README, and checklist. Extract before viewing. No external fonts, image services, or scripts are needed to render it.

## GitHub hosting
Repository: https://github.com/vmathukumallidlg2606-dot/moving-help-columbus-redesign
Preview: https://vmathukumallidlg2606-dot.github.io/moving-help-columbus-redesign/
Changes pushed to main automatically deploy dist/ through GitHub Actions.

