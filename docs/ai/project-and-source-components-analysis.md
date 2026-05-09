# Project and Source Components Analysis

Generated on 2026-05-09.

## Executive Summary

Drunken Dragon is currently structured as a full-stack tabletop/RPG assistant prototype. The repository contains:

- `Client`: the active Vite + React frontend.
- `Server`: an ASP.NET Core API with PostgreSQL-backed user registration and JWT login.
- `source_components`: a separate Vite + React UI source bundle, likely exported from AI Studio, containing a more polished tabletop interface concept.
- `docker-compose.yml`: a local PostgreSQL service for backend development.

The active `Client` already implements the most important interactive tabletop primitive: a pannable, zoomable grid with draggable image tokens that snap to cells. The `source_components` folder contains a stronger visual shell for a tactical tabletop app, including a stage, turn tracker, zoom control, sidebar tabs, and token cards, but most of it is static UI rather than functional state-driven logic.

## Repository Structure

### Root

- `README.md` documents environment setup for database credentials and .NET user secrets.
- `.env.example` is intended for database variables used by Docker Compose.
- `docker-compose.yml` starts a `postgres:latest` container named `drunken_dragon_db`.
- Root `package.json` only depends on `vite`; the real frontend package configuration lives in `Client` and `source_components`.

### Client

`Client` is the current application frontend.

Key files:

- `Client/src/App.tsx`
- `Client/src/components/GridBG.tsx`
- `Client/src/components/GridItems.tsx`
- `Client/src/components/PlayAreaToken.tsx`
- `Client/src/components/Droppable.tsx`
- `Client/src/index.css`
- `Client/vite.config.ts`

It uses React 19, TypeScript, and Vite 8. There is no router, API client, global state layer, or backend integration yet.

### Server

`Server` is an ASP.NET Core backend targeting `net10.0`.

Key files:

- `Server/Program.cs`
- `Server/Controllers/AuthController.cs`
- `Server/Data/AppDbContext.cs`
- `Server/Models/User.cs`
- `Server/Models/UserDto.cs`
- `Server/Services/UserRepository.cs`

It provides:

- PostgreSQL persistence through Entity Framework Core and Npgsql.
- Automatic database migration on app startup.
- User registration with password hashing.
- Login with JWT token generation.
- Unique username enforcement at the EF model level.

### source_components

`source_components` is a separate React/Vite app. It has its own `package.json`, `vite.config.ts`, Tailwind 4 setup, and component tree.

Key files:

- `source_components/src/App.tsx`
- `source_components/src/components/Stage/Stage.tsx`
- `source_components/src/components/Stage/TurnTracker.tsx`
- `source_components/src/components/Stage/ZoomSlider.tsx`
- `source_components/src/components/Sidebar/Sidebar.tsx`
- `source_components/src/components/Sidebar/SidebarHeader.tsx`
- `source_components/src/components/Sidebar/SidebarTabs.tsx`
- `source_components/src/components/Sidebar/TokenList.tsx`
- `source_components/src/components/Sidebar/TokenCard.tsx`
- `source_components/src/index.css`

The README and Vite config suggest this app came from Google AI Studio. It defines `process.env.GEMINI_API_KEY`, depends on `@google/genai`, and includes AI Studio comments. None of the visible components currently call Gemini or any backend service.

## Active Client Findings

### Current Behavior

The active frontend renders `GridBg`, which provides:

- Full viewport grid background.
- Pointer-drag panning.
- Wheel-based zoom by changing grid cell size.
- A translated `canvas-layer` containing tokens.
- Three hard-coded image tokens.
- Token dragging with snap-to-grid behavior.
- A semi-transparent droppable cell preview while dragging.

This is a useful foundation for the tactical board. The logical coordinate approach in `PlayAreaToken` is also promising because token positions are stored in grid cells rather than fixed pixels.

### Strengths

- Simple component decomposition: grid, items, token, droppable preview.
- Pointer events are used instead of mouse-only events, which is better for touch and pen support.
- `touch-action: none` is set on the viewport, helping pointer interactions work consistently.
- Token dragging uses logical grid coordinates and snaps on drop.
- Panning and zooming are implemented without external dependencies.

### Issues and Risks

- `GridItems` passes `panX` and `panY` into `PlayAreaToken`, but `PlayAreaToken` does not use them. These props can be removed unless future math needs them.
- Token data is hard-coded inside `GridItems`, so token state cannot yet be persisted, edited, fetched, or shared.
- Zoom changes `gridSize`, but token drag deltas depend on the current `gridSize`; zooming during a drag could produce odd movement.
- Wheel zoom is centered on the viewport/grid origin rather than the pointer location. This may feel unintuitive on a large tactical map.
- `handlePointerUp` calls `releasePointerCapture` without checking capture state. Usually fine, but this can throw in edge cases if capture was lost.
- No collision or occupancy rules exist. Multiple tokens can snap to the same cell.
- No keyboard accessibility is present for panning, zooming, or token movement.
- `Droppable` is a visual preview only. It does not represent a real drop target or enforce valid placement.
- CSS class naming is inconsistent: `.play-area-token` exists, while the rendered token uses `.grid-component`.

## source_components Findings

### Current Behavior

The source app renders a two-pane layout:

- `Stage`: main tactical area with a dotted background, turn tracker, zoom slider, and empty-state indicator.
- `Sidebar`: fixed-width side panel with character header, tabs, token list, and a "New Encounter" action.

The design is visually more complete than the active `Client`, but most controls are static. Buttons do not have event handlers, tabs do not switch panels, the zoom slider does not change zoom, and token cards are hard-coded.

### Component Breakdown

#### `Stage`

Provides the main battlefield shell with:

- Dark full-screen stage.
- Right border separating it from the sidebar.
- Dotted radial grid background.
- Centered "Awaiting Tactical Data..." empty state.
- Embedded `TurnTracker` and `ZoomSlider`.

This is a good candidate to receive the active `Client` grid interaction logic.

#### `TurnTracker`

Displays a static initiative row and a `NEXT TURN` button.

Opportunities:

- Convert turn entries into data.
- Track active initiative index.
- Wire `NEXT TURN` to state.
- Represent player/enemy/neutral tokens with consistent type metadata.

#### `ZoomSlider`

Displays plus/minus controls and a static slider marker.

Opportunities:

- Connect to shared board zoom state.
- Support mouse/touch dragging.
- Add bounded zoom levels.
- Sync with wheel zoom on the stage.

#### `Sidebar`

Composes the sidebar layout and footer action.

Opportunities:

- Make tabs stateful.
- Move hard-coded token data out of `TokenList`.
- Connect "New Encounter" to actual encounter creation or reset flow.

#### `TokenList` and `TokenCard`

Render two hard-coded token cards with stats such as HP, AC, speed, size, and initiative.

Opportunities:

- Define a shared `Token` type.
- Reuse token data for both the sidebar and board.
- Add selection state so clicking a card can focus or highlight a board token.
- Add HP editing and initiative editing later.

### Styling Notes

`source_components` uses Tailwind 4 with theme tokens defined in `index.css`. The interface is dark, utilitarian, and tabletop-focused. It uses `material-symbols-outlined` spans for icons, but no font import was found in the source files. Without loading the Material Symbols font in `index.html` or CSS, those icons may render as plain text.

There are also signs of encoding damage in a comment inside `source_components/vite.config.ts`. The damaged text does not affect runtime behavior, but it is worth cleaning if the file is kept.

## Backend Findings

The backend is narrowly focused on authentication and user persistence.

Positive signs:

- Passwords are hashed using `IPasswordHasher<User>`.
- `UserDto` has validation attributes.
- Usernames are unique at the database model level.
- Repository interface keeps data access separated from the controller.
- Migrations already exist.

Risks and issues:

- `Program.cs` reads `builder.Configuration["JWT:Audiance"]`, but `AuthController` uses `_config["JWT:Audience"]`. The misspelled `Audiance` key will likely break JWT validation unless configuration also uses the typo.
- `Program.cs` does not call `UseHttpsRedirection`.
- CORS is not configured, so the Vite client may not be able to call the API in browser development depending on ports and hosting setup.
- `Register` returns only `user.Username`, while `Login` returns `{ username, token }`. That may be intentional, but the client will need consistent auth flow expectations.
- There are no protected test endpoints yet to verify JWT authentication end to end.

## Integration Opportunities

The strongest next direction is to merge the practical board mechanics from `Client` into the richer layout from `source_components`.

Recommended integration path:

1. Use the active `Client` as the target app because it is already part of the main project.
2. Bring over the `source_components` layout pieces selectively: `Stage`, `Sidebar`, `TurnTracker`, `ZoomSlider`, `TokenCard`.
3. Adapt the active `GridBg` logic into `Stage` instead of replacing it with the static dotted background.
4. Introduce shared board state in `Client/src/App.tsx` or a small state hook:
   - grid size
   - pan position
   - token list
   - selected token id
   - active turn index
5. Replace hard-coded token data in both `GridItems` and `TokenList` with the same shared token array.
6. Wire sidebar token cards to board token selection.
7. Wire turn tracker to token initiative/order data.
8. Add backend integration only after the local board state model is stable.

## Suggested Data Model

A first-pass frontend token model could look like this:

```ts
type BoardToken = {
  id: string;
  name: string;
  type: 'pc' | 'npc' | 'enemy';
  imageSrc?: string;
  gridX: number;
  gridY: number;
  hpCurrent: number;
  hpMax: number;
  ac: number;
  speed: number;
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
  initiativeModifier: number;
  initiativeRoll?: number;
};
```

This would allow the board, sidebar, and initiative tracker to render from one source of truth.

## Recommended Next Steps

1. Fix the JWT `Audience` typo in `Server/Program.cs`.
2. Decide whether `source_components` is a reference folder or should be merged into `Client`.
3. If merging, install only the dependencies the active client actually needs. Tailwind and icon setup are the likely first requirements.
4. Move token data into state and pass it into both board and sidebar components.
5. Connect zoom controls to the same grid size state used by wheel zoom.
6. Add CORS configuration to the server when browser API calls are introduced.
7. Add a small auth client in `Client` only after the board UI has a stable shell.

## Overall Assessment

The project has two useful halves: the active `Client` has functional board mechanics, while `source_components` has a stronger product shape and visual direction. The best path is not to pick one wholesale, but to compose them: keep the working grid/token behavior, wrap it in the `source_components` stage/sidebar interface, and introduce shared state before adding persistence or multiplayer features.
