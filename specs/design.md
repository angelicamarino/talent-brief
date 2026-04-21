# Design Specification — The Talent+ Brief

## Identity
- Newsletter name: The Talent+ Brief
- Sender: HR PID Team, People and Culture Group, UNOPS
- Tone: Warm, plain language, professional but human

## Brand reference
- Based on official UNOPS colour guidelines
- Primary colour is UNOPS Blue #0092D1
- Supporting colours: Midnight Blue #004976, Teal #00A997, Ocean Blue #4EC3E0
- Neutral: Grey #97999B, Deep Sea #0D1E2F, Black #00070A
- Backgrounds: Cool off-white #F6F9FC and #F5FBFD, Warm off-white #FEFAF7

## Layout
- Single column email output, max width 620px, centered
- Tool layout: form panel on left, live preview panel on right
- Preview mirrors exact email output in real time

## Color usage in the newsletter

### Category dot system (Talent+ update items)
- System change: #0092D1 (UNOPS Blue)
- Process change: #00A997 (Teal)
- Behavior change: #004976 (Midnight Blue)
- Dot size: 6x6px, border-radius 50%

### Text
- Primary text: #00070A (Black)
- Secondary/muted text: #97999B (Grey)
- Section headings: #0D1E2F (Deep Sea)
- Links and accents: #0092D1 (UNOPS Blue)

### Backgrounds
- Page/email background: #FFFFFF
- Intro block background: #F6F9FC (BG Cool 1)
- Marketplace card background: #F5FBFD (BG Cool 2)
- Badges: #4EC3E0 (Ocean Blue) with #004976 (Midnight Blue) text

### Borders
- Default border: #97999B at 0.5px
- Header bottom border: 2px solid #0092D1

## Typography
- Font family: system-ui, -apple-system, sans-serif
- Newsletter title: 22px, weight 500, color #0D1E2F
- Section heading: 16px, weight 500, color #0D1E2F
- Body text: 14px, weight 400, line-height 1.7, color #00070A
- Meta text (labels, dates): 12px, color #97999B
- Category labels: 11px, weight 500, uppercase, letter-spacing 0.06em

## Components

### Newsletter header
- Small label above: "HR PID Team · People and Culture Group, UNOPS"
- Title: "The Talent+ Brief" in Deep Sea #0D1E2F
- Issue number and month/year in Grey #97999B
- Bottom border: 2px solid #0092D1 (UNOPS Blue)

### Intro block
- Background #F6F9FC, border-radius 8px, 1rem padding
- Editable free text each issue

### Talent+ updates section
- Section heading in Deep Sea
- Muted subheading in Grey
- Legend showing three dot colors with labels
- Items listed in order added: dot + bold title + regular description

### People - Talent Workspace section
- Section heading in Deep Sea
- Card with background #F5FBFD
- Badge in Ocean Blue #4EC3E0 with Midnight Blue #004976 text
- Free text paragraph

### Footer
- Top border 0.5px Grey
- 12px Grey text
- Sender attribution, reply invitation, subscription invite

## Email output rules
- Inline styles only — no external CSS, no style blocks
- No images, no external fonts, no JavaScript
- Must render cleanly when pasted into Gmail
- Max width 620px, auto margins