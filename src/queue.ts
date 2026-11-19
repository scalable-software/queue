/**
 * @module Queue
 */

// Metadata
import { Order, Condition, Priority, Event } from "./queue.meta.js";
import type { Entry, Item, Items, Meta, Options, Persisted, Ready } from "./queue.meta.js";

// Validation
import { Validate } from "./queue.validation.js";

/**
 * A reactive queue that a host component creates for itself and keeps in a private field.
 * It is an add-on, not a custom element: an `EventTarget` with no tag, template or stylesheet.
 * @category Queue
 */
export class Queue<T extends object = Record<string, unknown>>
  extends EventTarget
  implements Meta
{
  /**
   * The order in which the queue hands out its waiting items
   * @category State
   * @hidden
   */
  private _order: Order = Order.FIFO;

  /**
   * The condition of the queue as a whole, computed from its items
   * @category State
   * @hidden
   */
  private _condition: Condition = Condition.EMPTY;

  /**
   * Whether the queue has its stored items back
   * @category State
   * @hidden
   */
  private _ready: Ready = false;

  /**
   * Whether the queue's items survive a reload
   * @category State
   * @hidden
   */
  private _persisted: Persisted = false;

  /**
   * The items that wait to be handed out, in the order they are handed out
   * @category Data
   * @hidden
   */
  private _waiting: Items<T> = Object.freeze([]);

  /**
   * The items that have been taken and are being worked on, in the order they were taken
   * @category Data
   * @hidden
   */
  private _working: Items<T> = Object.freeze([]);

  /**
   * The items the queue holds as its own: frozen copies, which are kept as they are
   * @category Data
   * @hidden
   */
  private _stored = new WeakSet<Item<T>>();

  /**
   * When each item was first added, by id: the earliest added comes first among equals
   * @category Data
   * @hidden
   */
  private _added = new Map<string, number>();

  /**
   * The number of items added so far, used to number the next one
   * @category Data
   * @hidden
   */
  private _count = 0;

  /**
   * The handler of `onadd`
   * @category Events
   * @hidden
   */
  private _onadd: EventListener | null = null;

  /**
   * The handler of `ontake`
   * @category Events
   * @hidden
   */
  private _ontake: EventListener | null = null;

  /**
   * The handler of `onupdate`
   * @category Events
   * @hidden
   */
  private _onupdate: EventListener | null = null;

  /**
   * The handler of `onremove`
   * @category Events
   * @hidden
   */
  private _onremove: EventListener | null = null;

  /**
   * The handler of `onputback`
   * @category Events
   * @hidden
   */
  private _onputback: EventListener | null = null;

  /**
   * The handler of `onwaiting`
   * @category Events
   * @hidden
   */
  private _onwaiting: EventListener | null = null;

  /**
   * The handler of `onbusy`
   * @category Events
   * @hidden
   */
  private _onbusy: EventListener | null = null;

  /**
   * The handler of `onempty`
   * @category Events
   * @hidden
   */
  private _onempty: EventListener | null = null;

  /**
   * Create a queue; `options.order` chooses the order in which it hands out its items
   * @category Lifecycle
   */
  constructor(options: Options = {}) {
    super();

    const { order } = Validate.options(options);

    this._order = order ?? Order.FIFO;
  }

  /**
   * The order in which the queue hands out its waiting items: chosen when the queue is created
   * @category State
   */
  public get order(): Order {
    return this._order;
  }

  /**
   * The condition of the queue as a whole: `empty`, `waiting` while any item waits,
   * or `busy` while items are being worked on and none waits
   * @category State
   */
  public get condition(): Condition {
    return this._condition;
  }
  private set condition(condition: Condition) {
    // Guard
    if (this._condition === condition) return;

    // Mutate
    this._condition = condition;

    // Dispatch
    const detail = { condition };
    condition === Condition.WAITING && this._dispatch(Event.ON_WAITING, detail);
    condition === Condition.BUSY && this._dispatch(Event.ON_BUSY, detail);
    condition === Condition.EMPTY && this._dispatch(Event.ON_EMPTY, detail);
  }

  /**
   * Whether the queue has its stored items back: `true` once they are restored
   * @category State
   */
  public get ready(): Ready {
    return this._ready;
  }

  /**
   * Whether the queue's items survive a reload: `true` once its database is open
   * @category State
   */
  public get persisted(): Persisted {
    return this._persisted;
  }

  /**
   * The items that wait to be handed out, in the order `take()` hands them out
   * @category Data
   */
  public get waiting(): Items<T> {
    return this._waiting;
  }
  private set waiting(items: Items<T>) {
    // Normalize
    items = [...items].sort(this._compare);

    // Clone
    items = items.map(this._own);

    // Mutate
    this._waiting = Object.freeze(items);
  }

  /**
   * The items that have been taken and are being worked on, in the order they were taken
   * @category Data
   */
  public get working(): Items<T> {
    return this._working;
  }
  private set working(items: Items<T>) {
    // Clone
    items = items.map(this._own);

    // Mutate
    this._working = Object.freeze(items);
  }

  /**
   * Dispatched when an item is added, with the item as the queue holds it in `detail.item`
   * @event
   * @category Events
   */
  public set onadd(handler: EventListener | null) {
    this._onadd = this._subscribe(Event.ON_ADD, this._onadd, handler);
  }

  /**
   * Dispatched when an item is taken and is being worked on, with the item as the queue holds it in `detail.item`
   * @event
   * @category Events
   */
  public set ontake(handler: EventListener | null) {
    this._ontake = this._subscribe(Event.ON_TAKE, this._ontake, handler);
  }

  /**
   * Dispatched when an item is changed, with the changed item as the queue holds it in `detail.item`
   * @event
   * @category Events
   */
  public set onupdate(handler: EventListener | null) {
    this._onupdate = this._subscribe(Event.ON_UPDATE, this._onupdate, handler);
  }

  /**
   * Dispatched when an item is removed, with the item as the queue held it in `detail.item`
   * @event
   * @category Events
   */
  public set onremove(handler: EventListener | null) {
    this._onremove = this._subscribe(Event.ON_REMOVE, this._onremove, handler);
  }

  /**
   * Dispatched when an item that was being worked on is put back among the waiting items, with the item as the queue holds it in `detail.item`
   * @event
   * @category Events
   */
  public set onputback(handler: EventListener | null) {
    this._onputback = this._subscribe(Event.ON_PUT_BACK, this._onputback, handler);
  }

  /**
   * Dispatched when `condition` changes to `waiting`, with `detail.condition`, after the event for the item
   * @event
   * @category Events
   */
  public set onwaiting(handler: EventListener | null) {
    this._onwaiting = this._subscribe(Event.ON_WAITING, this._onwaiting, handler);
  }

  /**
   * Dispatched when `condition` changes to `busy`, with `detail.condition`, after the event for the item
   * @event
   * @category Events
   */
  public set onbusy(handler: EventListener | null) {
    this._onbusy = this._subscribe(Event.ON_BUSY, this._onbusy, handler);
  }

  /**
   * Dispatched when `condition` changes to `empty`, with `detail.condition`, after the event for the item
   * @event
   * @category Events
   */
  public set onempty(handler: EventListener | null) {
    this._onempty = this._subscribe(Event.ON_EMPTY, this._onempty, handler);
  }

  /**
   * Put an item at its place among the waiting items
   * @category Operations
   */
  public add = (item: Entry<T>) => {
    item = Validate.item(item) as Entry<T>;
    if (this._find(item.id))
      throw new Error("Invalid item value: id is already in the queue");

    this._added.set(item.id, this._count++);

    const added = { ...item, priority: item.priority ?? Priority.LOWEST } as Item<T>;

    this.waiting = [...this.waiting, added];

    this._dispatch(Event.ON_ADD, { item: this._find(item.id) });

    this._syncCondition();
  };

  /**
   * Hand out the next waiting item and move it to the items being worked on; `null` when no item waits
   * @category Operations
   */
  public take = (): Item<T> | null => {
    const [item, ...rest] = this.waiting;
    if (!item) return null;

    this.waiting = rest;
    this.working = [...this.working, item];

    this._dispatch(Event.ON_TAKE, { item: this._find(item.id) });

    this._syncCondition();

    return item;
  };

  /**
   * The item `take()` would hand out, without taking it; `null` when no item waits
   * @category Operations
   */
  public peek = (): Item<T> | null => this.waiting[0] ?? null;

  /**
   * Change the item with the given `id`: the given fields replace the item's own, and it keeps its place
   * @category Operations
   */
  public update = (item: Entry<T>) => {
    item = Validate.item(item) as Entry<T>;
    if (!this._find(item.id)) return;

    const change = (stored: Item<T>) =>
      stored.id === item.id
        ? ({ ...stored, ...item, priority: item.priority ?? stored.priority } as Item<T>)
        : stored;

    this.waiting = this.waiting.map(change);
    this.working = this.working.map(change);

    this._dispatch(Event.ON_UPDATE, { item: this._find(item.id) });
  };

  /**
   * Remove the item with the given id, waiting or being worked on
   * @category Operations
   */
  public remove = (id: string) => {
    id = Validate.id(id);

    const item = this._find(id);
    if (!item) return;

    const kept = (item: Item<T>) => item.id !== id;

    this.waiting = this.waiting.filter(kept);
    this.working = this.working.filter(kept);
    this._added.delete(id);

    this._dispatch(Event.ON_REMOVE, { item });

    this._syncCondition();
  };

  /**
   * Put an item that is being worked on back among the waiting items, at the place it would have had had it never been taken
   * @category Operations
   */
  public putBack = (id: string) => {
    id = Validate.id(id);

    const item = this.working.find((item) => item.id === id);
    if (!item) return;

    this.working = this.working.filter((item) => item.id !== id);
    this.waiting = [...this.waiting, item];

    this._dispatch(Event.ON_PUT_BACK, { item: this._find(id) });

    this._syncCondition();
  };

  /**
   * Dispatch an event from the queue with its detail
   * @param event - The name of the event
   * @param detail - The event's detail
   * @returns `false` when a listener cancelled the event; otherwise `true`
   * @hidden
   */
  private _dispatch = (event: string, detail: unknown): boolean =>
    this.dispatchEvent(new CustomEvent(event, { detail }));

  /**
   * Replace the handler of an event: remove the current one, then add the next one.
   * The next handler is checked before anything changes, so a rejected value leaves
   * the current handler in place.
   * @param event - The name of the event
   * @param current - The handler stored now, or `null`
   * @param next - The handler to store: a function, or `null` or `undefined` to remove
   * @returns the handler to store: the function, or `null`
   * @throws when `next` is neither a function nor `null` or `undefined`
   * @hidden
   */
  private _subscribe = (
    event: string,
    current: EventListener | null,
    next: unknown
  ): EventListener | null => {
    next = next ?? null;
    const valid = next === null || typeof next === "function";
    if (!valid) throw new Error(`Invalid ${event} value: ${next}`);
    current && this.removeEventListener(event, current);
    next && this.addEventListener(event, next as EventListener);
    return next as EventListener | null;
  };

  /**
   * Compute the condition of the queue from its items
   * @category State
   * @hidden
   */
  private _syncCondition = () =>
    (this.condition = this.waiting.length
      ? Condition.WAITING
      : this.working.length
        ? Condition.BUSY
        : Condition.EMPTY);

  /**
   * Compare two waiting items: in a priority queue the higher priority comes first,
   * and otherwise the earliest added
   * @category Data
   * @hidden
   */
  private _compare = (a: Item<T>, b: Item<T>): number =>
    (this.order === Order.PRIORITY ? b.priority - a.priority : 0) ||
    this._added.get(a.id)! - this._added.get(b.id)!;

  /**
   * The item with the given id, waiting or being worked on
   * @category Data
   * @hidden
   */
  private _find = (id: string): Item<T> | undefined =>
    this.waiting.find((item) => item.id === id) ??
    this.working.find((item) => item.id === id);

  /**
   * The queue's own copy of an item: the item itself when the queue already holds it,
   * otherwise a deep-frozen clone
   * @category Data
   * @hidden
   */
  private _own = (item: Item<T>): Item<T> => {
    if (this._stored.has(item)) return item;

    const own = this._freeze(structuredClone(item));
    this._stored.add(own);
    return own;
  };

  /**
   * Freeze a value and everything it holds
   * @category Utility
   * @hidden
   */
  private _freeze = <V>(value: V): V => {
    if (typeof value !== "object" || value === null || Object.isFrozen(value))
      return value;

    Object.values(value).forEach(this._freeze);
    return Object.freeze(value);
  };
}
