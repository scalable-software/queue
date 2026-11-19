/**
 * @module Queue
 */

// Metadata
import { Order, Condition, Priority } from "./queue.meta.js";
import type { Entry, Item, Items, Meta, Options } from "./queue.meta.js";

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

    return item;
  };

  /**
   * The item `take()` would hand out, without taking it; `null` when no item waits
   * @category Operations
   */
  public peek = (): Item<T> | null => this.waiting[0];

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
