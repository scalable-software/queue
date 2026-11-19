/**
 * @module Queue
 */

// Metadata
import { Order, Condition } from "./queue.meta.js";
import type { Entry, Items, Meta, Options } from "./queue.meta.js";

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

  /**
   * The items that have been taken and are being worked on, in the order they were taken
   * @category Data
   */
  public get working(): Items<T> {
    return this._working;
  }

  /**
   * Put an item at its place among the waiting items
   * @category Operations
   */
  public add = (item: Entry<T>) => {};
}
