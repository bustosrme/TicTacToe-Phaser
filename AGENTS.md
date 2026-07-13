# Repository Guidelines

## Project Structure & Module Organization

The application is a Phaser 3 Tic-Tac-Toe game written in TypeScript. `src/index.ts` creates the Phaser game and registers its scenes. Game screens live in `src/scenes/`: `PreloadScene` loads resources, `MainScene` and `SelectScene` handle menus, `GameScene` contains match logic, and `WinnerScene` displays results. Shared Phaser settings belong in `src/config/config.ts`.

Static resources are grouped under `static/assets/` by type (`images/`, `sounds/`, and `fonts/`). Keep asset filenames and the keys used by `PreloadScene` synchronized. `index.html` is Parcel's entry point; production output is generated in `dist/` and must not be committed.

## Build, Test, and Development Commands

- `npm install` installs the exact dependency versions recorded in `package-lock.json`.
- `npm run start` starts Parcel's development server with hot reload.
- `npm run build` creates an optimized production bundle in `dist/`.
- `npx tsc --noEmit` performs strict TypeScript checking without generating files.

Run the build and type check before opening a pull request.

## Coding Style & Naming Conventions

Use TypeScript with the strict settings in `tsconfig.json`. Follow the existing four-space indentation, single-quoted imports and strings, and semicolons. Use `PascalCase` for scene classes and their files (for example, `WinnerScene.ts`), `camelCase` for variables and methods, and descriptive scene keys such as `'Winner'`. Keep scene-specific behavior inside its scene; place only shared game configuration in `src/config/`.

No formatter or linter is currently configured. Match nearby code and avoid unrelated formatting changes.

## Testing Guidelines

There is currently no automated test framework or coverage requirement. Validate changes with `npx tsc --noEmit` and `npm run build`, then manually exercise affected flows in the browser. For gameplay changes, check both player selections, winning rows/columns/diagonals, draws, turn timing, restart, home navigation, audio, and scaling at narrow and wide viewport sizes. If tests are introduced, place them beside the relevant module as `*.test.ts` and add the command to `package.json`.

## Commit & Pull Request Guidelines

Recent history uses short, imperative summaries such as `add particles in winner scene`. Write focused commit subjects that describe one change; avoid placeholder messages. Pull requests should explain the user-visible effect, list validation performed, link related issues, and include screenshots or a short recording for visual or gameplay changes. Keep generated `dist/` files and local editor settings out of commits.
