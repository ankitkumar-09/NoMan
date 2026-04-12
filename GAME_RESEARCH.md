# Game Systems Research Document

## 1) Purpose and Scope

This document analyzes the playable browser games implemented in this repository, with focus on:

- Game physics behavior
- Core gameplay logic
- High-level implementation approach

The analysis covers these eight playable titles in the Play section:

- Tic Tac Toe
- Snake
- Flappy Bird
- Chess
- Car Racing
- Bike Racing
- Memory Match
- Pong

It also explains how the app loads and hosts these games inside the Next.js architecture.

## 2) Platform Architecture (How the Games Are Made)

### 2.1 Frontend stack

The game platform is built with:

- Next.js App Router pages for discovery and routing
- React client components for game runtime
- Canvas-based rendering for real-time arcade games
- Framer Motion for UI transitions, overlays, and button interactions
- Dynamic component loading to defer game bundles until needed

### 2.2 Content and routing model

The Play flow is split into:

- A game catalog page that lists all playable games and categories
- A dynamic game detail route keyed by slug
- A game registry that maps slugs to concrete game components

Result:

- New games can be added mostly by updating metadata and component mapping.
- Each game is encapsulated as a self-contained client component.

### 2.3 Runtime model used across games

Most arcade games in this project use one of two loop styles:

- Frame loop model: requestAnimationFrame for smooth motion tied to display refresh
- Tick loop model: setTimeout for fixed-step grid movement (used by Snake)

A common pattern appears in many games:

- Mutable game object stored in a ref for real-time values (positions, velocity, entities)
- React state for UI-facing values (score labels, overlays, win/lose state)

Why this matters:

- Refs avoid rerendering on every frame.
- State updates are used only when the UI must reflect a milestone.

### 2.4 Input system

Input is keyboard-first with optional mouse/click:

- Document-level key listeners for movement/jump/flap
- Canvas click for certain single-action games
- Basic prevention of default browser behavior for arrow and space keys

### 2.5 Reset and restart strategy

Games generally support:

- In-game restart through overlay button
- Keyboard quick-start when game is not running
- Page-level reset button in the game detail shell that remounts the game component

## 3) Shared Design Patterns Across the Games

### 3.1 State buckets

Typical state categories:

- Simulation state: positions, velocities, entity arrays
- Session state: running, started, game over
- Performance progression: speed scaling or difficulty scaling
- Score state: current score and local best score for the session

### 3.2 Collision families

Two collision styles dominate:

- Axis-aligned rectangle overlap for cars, bikes, and obstacles
- Radius/shape overlap checks for bird, pipes, and pong ball interactions

### 3.3 Difficulty progression

Difficulty is mostly time-based:

- Speed increases after a number of frames
- Spawn pressure rises implicitly as movement speed rises
- Snake increases pace as food is collected

### 3.4 AI complexity tiers

The project includes three AI tiers:

- Deterministic tactical AI (Tic Tac Toe minimax)
- Rule-driven reactive AI (Pong paddle tracking)
- Light stochastic AI (Chess random valid move preference with capture bias)

## 4) Game-by-Game Research

## 4.1 Tic Tac Toe

### Physics model

- No real-time physical simulation.
- Turn-based board state transitions only.

### Core logic

- Board is a 3x3 grid with player as X and AI as O.
- Win detection checks all 8 winning lines.
- Draw detection occurs when board fills without winner.
- AI computes best move via minimax over the full game tree.

### How it is made

- React state stores board, scores, game result, and winning line.
- After player move, game evaluates outcome immediately, then triggers AI move.
- Round scoring persists across rematches in session memory.

### Strengths

- Unbeatable AI behavior for normal Tic Tac Toe.
- Clear progression and status messaging.

### Limitations

- No difficulty modes.
- No move timer or turn constraints.

## 4.2 Snake

### Physics model

- Discrete grid physics on a 25x25 board.
- Snake advances one cell per tick in current direction.
- No momentum; movement is deterministic and axis-aligned.

### Core logic

- Direction buffering prevents immediate 180-degree reversal.
- Eating food grows snake by keeping tail segment.
- Missing food pops tail to keep length.
- Game ends on wall collision or self collision.
- Food spawn retries until an empty cell is found.

### Difficulty curve

- Tick interval decreases as score rises, bounded by a minimum speed.
- This creates smooth acceleration pressure over time.

### How it is made

- setTimeout loop drives fixed-step progression.
- Canvas rendering draws grid, food glow, and segment-based snake visuals.
- Local session high score is tracked in component state.

### Strengths

- Very stable deterministic behavior.
- Difficulty scaling is simple and effective.

### Limitations

- No wrap-around mode.
- No pause/resume mode.

## 4.3 Flappy Bird

### Physics model

- Continuous vertical motion with gravity and impulse flap.
- Bird velocity accumulates by gravity each frame.
- Flap action injects upward velocity.

### Core logic

- Pipes spawn at regular frame intervals with randomized top gap position.
- Pipes move left at constant speed.
- Scoring increments when bird cleanly passes a pipe threshold.
- Terminal conditions:
  - Ground contact
  - Ceiling contact
  - Pipe overlap

### How it is made

- requestAnimationFrame loop for smooth animation.
- Bird rotation is derived from vertical velocity to communicate motion state.
- Canvas handles all visual rendering including background, pipes, bird, and score.

### Strengths

- Cleanly modeled arcade physics with readable fail states.
- Good visual coupling between velocity and bird orientation.

### Limitations

- Fixed pipe speed and gap values; no dynamic progression tiering.
- No procedural variation beyond gap height.

## 4.4 Chess (Simplified)

### Physics model

- None. Pure rule-based board simulation.

### Core logic

- 8x8 board with piece-specific movement rules.
- Path blocking for sliding pieces (rook, bishop, queen).
- Move safety filter prevents moving into check.
- Check, checkmate, and stalemate are detected by legal-move exhaustion and king threat tests.
- Pawn promotion to queen is included.

### AI behavior

- AI generates all legal black moves.
- If captures exist, AI picks random capture; otherwise random legal move.
- This creates legal but non-strategic play compared with engine-grade chess.

### How it is made

- Board is stored as matrix of piece objects.
- Click-based selection and targeting UX.
- Legal targets are highlighted from computed valid move list.
- Move history logs compact move notation-like entries.

### Strengths

- Correctly enforces many essential chess legality constraints.
- Includes check-state awareness and game-end states.

### Limitations

- No castling, en passant, opening/endgame evaluation, or search depth strategy.
- AI is intentionally lightweight and not engine-level.

## 4.5 Car Racing

### Physics model

- Lane-based pseudo-physics rather than free steering.
- Player car snaps between three lanes.
- Obstacles move vertically downward at increasing speed.

### Core logic

- Spawns one obstacle at fixed frame intervals in random lane.
- Collision uses rectangle overlap with player car hitbox.
- Score increases continuously over survival time.
- Speed increases periodically to raise difficulty.

### How it is made

- requestAnimationFrame loop with frame counter.
- Canvas draws road, lane markings, player car, and obstacle cars.
- Keyboard controls map to lane decrement/increment with clamping.

### Strengths

- Tight, easy-to-learn control scheme.
- Clear difficulty ramp and immediate restart loop.

### Limitations

- Obstacle spawn logic can produce unavoidable patterns at high speeds.
- No advanced traffic behavior (overtake logic, lane changes, etc.).

## 4.6 Bike Racing

### Physics model

- Side-scroller runner physics with vertical jump dynamics.
- Bike has gravity, jump impulse, vertical velocity, and ground constraint.
- Horizontal world movement is represented by obstacle translation.

### Core logic

- Player remains at fixed X while obstacles scroll left.
- Obstacle heights vary randomly within a range.
- Jump allowed only when bike is grounded (single-jump model).
- Collision is rectangle overlap between bike and obstacles.
- Score accumulates over distance/time.

### Difficulty curve

- Obstacle speed increments periodically by frame milestones.

### How it is made

- requestAnimationFrame loop updates simulation and render.
- Keyboard and click both map to jump/start interaction.
- Overlay-based start and game-over UX.

### Strengths

- Strong core endless-runner loop with simple controls.
- Physics are lightweight but predictable.

### Limitations

- No variable jump strength or airborne control.
- Spawn interval is fixed, so rhythm can become repetitive.

## 4.7 Memory Match

### Physics model

- No physics simulation.
- Turn-resolution timing only.

### Core logic

- Deck is built by duplicating emoji set and shuffling.
- Player flips up to two cards per turn.
- Match case:
  - Both cards become permanently matched.
- Mismatch case:
  - Board locks briefly, then both cards flip back.
- Move count increments per pair attempt.
- Win condition when all pairs are matched.
- Best score tracks minimum moves in session.

### How it is made

- React state-driven board; no canvas required.
- Flip animations and reveal transitions handled through motion components.
- Lock flag prevents race conditions during mismatch delay.

### Strengths

- Robust anti-double-click/anti-race logic through lock gating.
- Clear performance feedback (moves, matched count, best moves).

### Limitations

- No timer-based challenge mode.
- Difficulty does not scale board size dynamically.

## 4.8 Pong

### Physics model

- Continuous 2D ball movement with reflection and angle response.
- Ball bounces off top and bottom walls.
- Paddle collisions compute rebound angle from relative impact point.
- Ball speed increases slightly on each paddle hit.

### Core logic

- Player controls left paddle vertically.
- AI tracks ball Y with dead-zone behavior and clamped speed.
- Scoring occurs when ball crosses left or right bounds.
- Match ends at target score threshold.

### How it is made

- requestAnimationFrame loop with keyboard input state held in a key set.
- Canvas renders paddles, ball, trail, center line, and scoreboard.
- Ball reset randomizes launch angle toward scoring side.

### Strengths

- Good arcade feel from angle-based rebounds and speed growth.
- AI is responsive but bounded by movement speed.

### Limitations

- No spin or paddle momentum transfer model.
- AI does not use prediction; it is a tracker rather than strategic opponent.

## 5) Comparative Physics and Logic Summary

### 5.1 Physics-heavy titles

Most physics-intensive implementations:

- Pong (continuous 2D collision and rebound dynamics)
- Flappy Bird (gravity plus impulse with obstacle tunnels)
- Bike Racing (jump arc with scrolling hazards)

### 5.2 Logic-heavy titles

Most logic-heavy implementations:

- Chess (rule legality, check resolution, move generation)
- Tic Tac Toe (search-based AI)
- Memory Match (turn-resolution and lock-state control)

### 5.3 Hybrid titles

- Snake combines deterministic logic with speed progression pressure.
- Car Racing combines lane logic with real-time survival pacing.

## 6) Engineering Quality Observations

### 6.1 Good engineering choices

- Separation between catalog metadata and game runtime components.
- Dynamic imports for game components reduce initial load pressure.
- Consistent restart paths and user feedback overlays.
- Practical use of refs for high-frequency simulation values.

### 6.2 Current technical constraints

- High scores are in-memory per session, not persisted.
- Difficulty systems are mostly linear and frame-count based.
- No shared reusable game engine layer; each game is bespoke.

## 7) Potential Evolution Directions

### 7.1 Physics and balancing

- Add adaptive difficulty driven by player performance, not only elapsed frames.
- Introduce seeded procedural patterns to avoid unfair obstacle clustering.
- Add deterministic replay mode for balancing and regression tests.

### 7.2 AI and gameplay depth

- Add difficulty presets for Tic Tac Toe and Chess AI.
- Upgrade Chess AI from random legal selection to shallow evaluation search.
- Add prediction-based AI option in Pong for harder mode.

### 7.3 Platform-level capabilities

- Persist scoreboards via local storage or backend profile.
- Add a shared telemetry layer (session length, fail causes, restart frequency).
- Standardize a small reusable game shell interface for future titles.

## 8) Final Conclusion

This repository implements a compact but well-structured browser arcade platform where each game is designed as an isolated interactive module. The physics implementations prioritize responsiveness and simplicity, while logic-heavy games focus on clear rule enforcement and fast feedback. The current architecture is suitable for rapid expansion, especially because routing, metadata, and dynamic loading are already organized in a scalable pattern.

At a high level, the system is built around practical game-loop fundamentals rather than heavy engine abstractions, which makes it easy to maintain and extend for indie-scale web game development.
