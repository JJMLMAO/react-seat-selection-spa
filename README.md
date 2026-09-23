# Seat Selection SPA

Pick seats from a venue map, watch rival buyers take seats out from under you,
and check out. React 19 + TypeScript + Vite, no state library.

## Running it

```bash
npm install
npm run dev
```

The app reads `public/seatmap.json` at startup. That file is committed, so
nothing else is needed. To regenerate it with a different layout or a
different proportion of pre-sold seats, edit the constants at the top of
`scripts/generate-seatmap.mjs` and run:

```bash
node scripts/generate-seatmap.mjs
```

The default venue is 4 sections × 5 rows × 25 seats = 500 seats, priced 30–250
by section, with ~30% pre-sold.

Other scripts: `npm run build` (typechecks, then builds), `npm run lint`,
`npm run preview`.

## How does it work?
- It is pretty straight forward and you can sort of see it like a game.
- Start by selecting a seat that you want.
- You will know which seat that you've selected based on the color of the seat and also the information you get at the sidebar.
- After you have selected a seat, the simulation starts.
- You will see other seats gradually being taken by your rival (in other words, customers).
- Then you'll reach a point where your seats are being taken by your rival.
- In this case, you have to unselect your seat (that is being taken) and select new ones.
- Once you've selected your seats, then you have to click on "Checkout".
- That's where you lock in your seats and this is where the flow ends.
- Feel free to start all over again by clicking on the "Reset" button.


## Layout

```
src/
  App.tsx                    state composition and wiring
  hooks/
    useSeatmap.ts            fetch + availability
    useSeatSelection.ts      selection set + toggle guard
    useSeatSimulation.ts     rival-buyer ticker
  helpers/
    seatmapHelpers.ts        flatten, group, pick-seat-to-take (pure)
  components/
    Section/ Row/ Seat/      the map, each with index.tsx + types.d.ts
    SidebarPanel/            selection, receipt, checkout
  index.css                  design tokens
  App.css                    layout and sidebar styles
```

## Design decisions
- **A clashed seat stays selected and marked, rather than vanishing.** The user
  sees what they lost and decides.
- **Tier colours key off `data-section`, not `:nth-of-type`.** Position-based
  selectors silently re-map every tier the moment anything else renders
  alongside the sections — as the screen indicator above them does.
- **User flow**
  The user will see the error when their seat is being taken. Which will block the user's flow so they know immediately so that they can/should unselect their seat in order t ocheckout.
- **Not using any state management libraries**
  Based on the scale of the project, state maangement library is not really needed at the moment. And prop-drilling situation seemed manageable. Will consider a library when the project gets huge.

| Hook | Owns |
|---|---|
| `useSeatmap` | The fetched seatmap, and the live set of unavailable seat ids |
| `useSeatSelection` | The set of seat ids the user has selected |
| `useSeatSimulation` | The rival-buyer ticker |

## Trade-offs

**Rendering: DOM, not SVG or canvas.** Plain DOM elements in flexbox rows.

- DOM keeps real accessibility within reach, and was the fastest to build.
  (Seats are still `<div>`s today, so keyboard and screen reader support isn't
  actually wired up yet)
- Would switch to SVG for pan/zoom, or for a venue that isn't a simple grid and if I'd have more time.
- Picked DOM, as it is much faster to start and I'm more familiar with it.

**Real-time updates.**

- The fake feed applies availability changes through a single entry point,
  `markUnavailable` — the only path that mutates availability after load, aside
  from the initial seed and Reset.
- Swapping `setInterval` for a websocket listener is contained to
  `useSeatSimulation`; nothing downstream knows where the updates come from.
- Not handled: reconnecting after a dropped connection, seat locking/holds,
  optimistic updates.

**Conflict handling.**

- If a selected seat gets taken, it stays in the sidebar with an inline error
  and checkout is blocked.
- Better to tell the user now than let them fail at checkout.
- The alternative was silent auto-removal — rejected because the user might
  miss it.

## What I'd do with more time

- **Seat holds with expiry.** Selecting doesn't reserve anything today, which
  is why a rival can take a seat you hold. A real hold with a countdown makes
  it a genuine race rather than a simulated one — and is the point where an
  external writer (the expiry timer) would start to justify a different state
  approach.
- **Keyboard access for the map.** Seats are click-only `<div>`s, so the venue
  can't be navigated without a mouse. They should be real buttons with roving
  focus. The sidebar controls already are buttons.
- **Pan and zoom** — listed as optional in the brief.
- **Virtualisation** — not needed at this scale (see *Trade-offs*).
- **Real checkout** — the brief allows a `console.log`. What's here locks the
  order and renders a receipt, but there's no payment or persistence, and
  nothing survives a refresh.

