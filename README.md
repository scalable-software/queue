![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Queue

The **Queue** is a reactive queue for web components built with Scalable.Software standards and practices. A host component creates a queue for itself and keeps it in a private field. The queue holds items with an id and a priority, hands them out in order, keeps them in IndexedDB so that they survive a reload, and dispatches an event for every change.

The Queue is an add-on, not a custom element: it extends **EventTarget**, and has no tag, template, stylesheet or attributes. It runs in the browser only.

> The Queue is being built. Its requirements are in [`specifications/queue.requirements.md`](specifications/queue.requirements.md), and its contract grows in [`specifications/queue.specifications.json`](specifications/queue.specifications.json) one story at a time. This README describes the API once it exists.

## Installation

```bash
npm install @scalable.software/queue
```

```js
import { Queue } from "@scalable.software/queue";
```

The metadata (`State`, `Operation`, `Event`) is also importable on its own as `@scalable.software/queue/meta`. It needs neither the DOM nor the `Queue` class.

## Development

```bash
npm install
```

| Command | What it does |
|---|---|
| `npm test` | checks the specification, compiles, and runs the suite in headless Chrome |
| `npm run check.specification` | checks the specification against the schema in each policy |
| `npm run build` | compiles to `dist/` |
| `npm run serve` | builds and opens the demo page |
| `npm run document` | regenerates the API docs in `docs/` |
| `npm run clean.test` | removes compiled test output; run it after a failed `npm test` |

A coverage report is written to `coverage/` and a test report to `report/`.

## License

> This software and its documentation are released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License (CC BY-NC-SA 4.0). This means you are free to share, copy, distribute, and transmit the work, and to adapt it, but only under the following conditions:
>
> Attribution: You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work).
>
> NonCommercial: You may not use this material for commercial purposes.
>
> ShareAlike: If you alter, transform, or build upon this work, you may distribute the resulting work only under the same or similar license to this one.
>
> For more details, please visit the full [license agreement](https://creativecommons.org/licenses/by-nc-sa/4.0/).
