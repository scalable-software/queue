![License: CC BY-NC-SA 4.0](https://flat.badgen.net/static/license/CC-BY-NC-SA-4.0/green)

# Queue

The **Queue** is a reactive queue for web components built with Scalable.Software standards and practices. A host component creates a queue for itself and keeps it in a private field. The queue holds items with an id and a priority, hands them out in order, and dispatches an event for every change, so that the component reacts to the queue instead of checking it.

The Queue is an add-on, not a custom element: it extends **EventTarget**, and has no tag, template, stylesheet or attributes. It runs in the browser only. A queue belongs to one component: it is not shared between components, workers or tabs.

> Keeping the items in IndexedDB, so that they survive a reload, is the next feature, Persistent Queue. Until then a queue lives in memory. The requirements are in [`specifications/queue.requirements.md`](specifications/queue.requirements.md), and the contract in [`specifications/queue.specifications.json`](specifications/queue.specifications.json).

## Installation

```bash
npm install @scalable.software/queue
```

```js
import { Queue } from "@scalable.software/queue";
```

The metadata (`State`, `Order`, `Condition`, `Datum`, `Priority`, `Operation`, `Event` and the types) is also importable on its own as `@scalable.software/queue/meta`. It needs neither the DOM nor the `Queue` class.

## Quick Start

```ts
import { Queue, Order } from "@scalable.software/queue";

type Upload = { file: File };

class Uploader extends HTMLElement {
  #queue = new Queue<Upload>({ order: Order.PRIORITY });

  constructor() {
    super();
    this.#queue.onadd = ({ detail }: CustomEvent) => console.log("queued", detail.item.id);
    this.#queue.onbusy = () => this.setAttribute("busy", "");
    this.#queue.onempty = () => this.removeAttribute("busy");
  }

  upload = (file: File, urgent = false) =>
    this.#queue.add({ id: file.name, file, priority: urgent ? 10 : 1 });

  uploadNext = async () => {
    const item = this.#queue.take(); // now in `working`, never handed out twice
    if (!item) return;
    try {
      await send(item.file);
      this.#queue.remove(item.id); // done
    } catch {
      this.#queue.putBack(item.id); // waits again, in the place it had
    }
  };
}
```

Retrying, timing out and scheduling are the host's to decide: the queue never hands an item out by itself.

To try the queue by hand, run `npm run serve`: the demo page adds, takes, changes, removes and puts back items, and logs every event.

## Items

An item is the host's own object with an `id` and a `priority` beside its other fields: `Item<T> = T & { id: string; priority: number }`.

- `id` is a non-empty string, unique in the queue.
- `priority` is a whole number from `Priority.LOWEST` (1) to `Priority.HIGHEST` (10). An item added without one has priority 1.
- The queue keeps every other field as the host gave it.

The queue holds its own copy of each item, deep-frozen: changing the object you added changes nothing in the queue, and the items the queue hands out cannot be changed. A field that `structuredClone` cannot copy, such as a function, cannot be put in the queue.

## Order

The order is chosen once, when the queue is created, and read from `queue.order`.

| `order` | Hands out |
|---|---|
| `Order.FIFO` (default) | the items in the order they were added |
| `Order.PRIORITY` | the highest priority first, and the earliest added first among equals |

An item keeps the place its first addition gave it: it keeps it when it is changed, and gets it back when it is put back.

## Data

| Property | Holds |
|---|---|
| `queue.waiting` | the items that wait, in the order `take()` hands them out |
| `queue.working` | the items that have been taken and are being worked on, in the order they were taken |

Both are readonly, frozen lists.

## States

| State | Values | |
|---|---|---|
| `order` | `fifo`, `priority` | readonly, chosen when the queue is created |
| `condition` | `empty`, `waiting`, `busy` | readonly: `waiting` while any item waits, `busy` while items are worked on and none waits |

## Operations

| Operation | Does | Returns |
|---|---|---|
| `add(item)` | puts the item at its place among the waiting items | `void` |
| `take()` | hands out the next waiting item and moves it to `working`, so it is never handed out twice | the item, or `null` when none waits |
| `peek()` | shows the item `take()` would hand out, without taking it | the item, or `null` |
| `update(item)` | changes the item with `item.id`: the given fields replace its own, and it keeps its place and progress | `void` |
| `remove(id)` | removes the item, waiting or being worked on | `void` |
| `putBack(id)` | puts an item that is being worked on back among the waiting items | `void` |

`update`, `remove` and `putBack` do nothing for an id the queue does not hold (and `putBack` for an item that waits).

## Events

| Event | Dispatched when | `detail` |
|---|---|---|
| `onadd` | an item is added | `{ item }` |
| `ontake` | an item is taken | `{ item }` |
| `onupdate` | an item is changed | `{ item }` |
| `onremove` | an item is removed | `{ item }`, as the queue held it |
| `onputback` | an item is put back | `{ item }` |
| `onwaiting` | `condition` changes to `waiting` | `{ condition }` |
| `onbusy` | `condition` changes to `busy` | `{ condition }` |
| `onempty` | `condition` changes to `empty` | `{ condition }` |

Assigning an `on…` property replaces its listener, and `null` removes it; `addEventListener` with the same names works too. `detail.item` is the item as the queue holds it. A condition event comes after the event for the item that caused it.

## Errors

| Thrown by | Message |
|---|---|
| `new Queue(options)` | `Invalid options value: <value>`, `Invalid options value: order is invalid` |
| `add`, `update` | `Invalid item value: <value>`, `Invalid item value: id is required`, `… id is invalid`, `… priority is invalid` |
| `add` | `Invalid item value: id is already in the queue` |
| `remove`, `putBack` | `Invalid id value: <value>` |
| an `on…` property | `Invalid <event> value: <value>`, for a value that is not a function |

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
