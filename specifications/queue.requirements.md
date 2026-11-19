# Queue — Requirements

## FEATURE: Reactive Queue

**Benefit** — A component that must work through items one at a time gets a ready queue that
keeps the items in order, hands them out one by one and announces every change, so that the
component reacts to the queue instead of checking it, and never builds queue logic itself.

**Personas**

- **Host component** — the web component that creates a queue for itself, puts items in it,
  takes them out to work on them, and reacts to what the queue announces.
- **Maintainer** — the person who builds, releases and keeps the queue.

**In scope**

- Holding items, each identified by an id that is unique in the queue, and each with a
  priority from 1 (lowest) to 10 (highest).
- Adding, changing and removing items.
- Handing out the next waiting item and marking it as being worked on, so that it is never
  handed out twice; and showing which item is next without handing it out.
- Handing items out first in, first out, or highest priority first with the earliest first
  among equals, as the host component chooses when it creates the queue.
- Putting an item that is being worked on back among the waiting items.
- Announcing every change to the queue with the item it concerns, and announcing when the
  condition of the queue as a whole changes: empty, holding waiting items, or holding only
  items that are being worked on.
- One queue for each host component that needs one.

**Out of scope**

- Doing the work an item stands for — the host component does that, and removes the item
  when the work is done.
- Sharing one queue between components, workers, tabs or devices, and keeping several
  queues in step.
- Retrying, timing out, delaying or scheduling items on its own.
- Changing the order of the waiting items by hand, other than through their priority.
- Showing anything on screen: the queue has no appearance.
- Running outside the browser.

---

### STORY: Add Items

As a **host component**, when I have work to be done, I want to put an item in the queue,
with a priority when it is more urgent than others, so that it waits its turn.

### STORY: Take the Next Item

As a **host component**, when I am ready for the next piece of work, I want to take the next
waiting item and have it marked as being worked on, so that no item is handed out twice.

### STORY: Look Ahead

As a **host component**, when I want to know what comes next, I want to see the next waiting
item without taking it, so that I can decide before I start on it.

### STORY: Order of Work

As a **host component**, when some work is more urgent than other work, I want the queue to
hand out the highest priority first, and the earliest added first among equals, so that
urgent work is done first; and when I do not ask for this, I want the first item in to be the
first out, so that work is done in the order it arrived.
