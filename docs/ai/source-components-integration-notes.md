# Source Components Integration Notes

Generated on 2026-05-09.

## Summary

The `source_components` UI layout was implemented into the main `Client` project while preserving the existing grid implementation. The result is that the active app now uses a stage/sidebar structure similar to the app inside `source_components`, but the tactical board still uses the project's original pannable, zoomable, draggable grid.

## Files Changed

Updated existing files:

- `Client/src/App.tsx`
- `Client/src/components/GridBG.tsx`
- `Client/src/components/PlayAreaToken.tsx`
- `Client/src/index.css`

Added new files:

- `Client/src/components/Stage/Stage.tsx`
- `Client/src/components/Stage/TurnTracker.tsx`
- `Client/src/components/Stage/ZoomSlider.tsx`
- `Client/src/components/Sidebar/Sidebar.tsx`
- `Client/src/components/Sidebar/SidebarHeader.tsx`
- `Client/src/components/Sidebar/SidebarTabs.tsx`
- `Client/src/components/Sidebar/TokenList.tsx`
- `Client/src/components/Sidebar/TokenCard.tsx`

## What Was Implemented

### App Layout

`Client/src/App.tsx` now renders an application shell with two main regions:

- `Stage`: the main tactical play area.
- `Sidebar`: the right-hand control and token panel.

This mirrors the high-level layout from `source_components/src/App.tsx`.

### Stage

The new `Stage` component wraps the existing `GridBG` component instead of replacing it. This keeps the main project's current board behavior:

- Pointer-drag panning.
- Mouse wheel zooming.
- Grid-based token positioning.
- Token dragging.
- Snap-to-grid drop behavior.

The stage also now includes:

- A turn tracker overlay near the top center.
- A zoom control overlay on the left.
- A centered tactical status panel styled like the source UI.

### Shared Grid Zoom State

Grid size state was moved into `Stage`.

`GridBG` now receives:

- `gridSize`
- `onGridSizeChange`

This allows both the original mouse wheel zoom and the new `ZoomSlider` controls to update the same grid size value.

### Turn Tracker

A new `TurnTracker` component was added based on the visual structure from `source_components`.

Current behavior:

- Renders a static initiative row.
- Shows ally, enemy, faded, and active turn styles.
- Includes a `Next Turn` button.
- Includes settings/help icon-style buttons.

The controls are visual only for now and are ready to be wired to real encounter state later.

### Zoom Slider

A new `ZoomSlider` component was added.

Current behavior:

- Plus button increases grid size.
- Minus button decreases grid size.
- Range input changes grid size directly.
- Uses the same min/max grid size as the wheel zoom logic.

### Sidebar

A new sidebar was added with the same conceptual structure as `source_components`:

- Character header.
- Sidebar section tabs.
- Token list.
- Footer action for creating a new encounter.

The sidebar is currently static and does not yet switch tab content.

### Token Cards

`TokenList` and `TokenCard` were implemented in the main `Client` project.

Current behavior:

- Renders hard-coded token data.
- Shows name, type, HP, AC, speed, size, and initiative.
- Uses different styling for player and hostile tokens.

The token data is still separate from the board token data in `GridItems`; unifying those into one shared state model is the next important step.

### Styling

The Tailwind-based styling from `source_components` was translated into regular CSS in `Client/src/index.css`.

This was done intentionally so the integration did not require adding Tailwind or other source-component dependencies to the main `Client` project.

The updated CSS now defines:

- Full app shell layout.
- Stage and grid styling.
- Sidebar layout.
- Turn tracker styling.
- Zoom control styling.
- Token card styling.
- Basic responsive behavior for narrower screens.

## Small Safety Improvements

`GridBG` and `PlayAreaToken` now check `hasPointerCapture` before calling `releasePointerCapture`. This avoids possible pointer capture errors if capture is lost before pointer release/cancel.

## What Was Preserved

The original board implementation was kept as the real stage surface. The integration did not replace it with the static dotted grid from `source_components`.

Preserved behavior:

- Existing grid rendering.
- Existing pan behavior.
- Existing wheel zoom behavior.
- Existing image tokens.
- Existing token dragging and snapping behavior.

## What Was Not Added

No new runtime dependencies were added.

The following `source_components` dependencies were not brought into the main client:

- Tailwind CSS
- Material Symbols font setup
- `lucide-react`
- `motion`
- `@google/genai`
- Express/dotenv-related source app dependencies

## Verification

Before the later request to stop running commands, the main client build was run successfully with:

```bash
npm run build
```

The build passed.

An attempt was made to start the Vite dev server, but it was not left running.

## Remaining Work

Recommended next steps:

1. Move token data into shared React state.
2. Render board tokens and sidebar token cards from the same token list.
3. Add token selection so clicking a sidebar card highlights or focuses the board token.
4. Wire `Next Turn` to real initiative state.
5. Make sidebar tabs stateful and render real tab panels.
6. Replace placeholder tab/icon text with a proper icon solution if desired.
7. Connect encounter data to the backend once the local UI state model is stable.

