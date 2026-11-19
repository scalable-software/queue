/**
 * @module Queue
 */

// Metadata
import { Order } from "./queue.meta.js";
import type { Meta, Options } from "./queue.meta.js";

// Validation
import { Validate } from "./queue.validation.js";

/**
 * A reactive queue that a host component creates for itself and keeps in a private field.
 * It is an add-on, not a custom element: an `EventTarget` with no tag, template or stylesheet.
 * @category Queue
 */
export class Queue extends EventTarget implements Meta {
  /**
   * The order in which the queue hands out its waiting items
   * @category State
   * @hidden
   */
  private _order: Order = Order.FIFO;

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
}
