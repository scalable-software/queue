/**
 * @module Queue
 */

import { Order } from "./queue.meta.js";
import type { Entry, Options } from "./queue.meta.js";

/**
 * Validators for every value that enters the queue from outside
 * @category Validation
 */
export class Validate {
  /**
   * Validate the options given to the constructor
   * @category Validation
   */
  public static options = (value: unknown) => {
    // Structure
    if (typeof value !== "object" || value === null || Array.isArray(value))
      throw new Error(`Invalid options value: ${value}`);

    // Declared fields
    const { order } = value as Record<string, unknown>;

    if (order !== undefined && !Object.values(Order).includes(order as Order))
      throw new Error("Invalid options value: order is invalid");

    return value as Options;
  };

  /**
   * Validate an item given to the queue
   * @category Validation
   */
  public static item = (value: unknown) => {
    // Structure
    if (typeof value !== "object" || value === null || Array.isArray(value))
      throw new Error(`Invalid item value: ${value}`);

    // Declared fields
    const { id } = value as Record<string, unknown>;

    if (id === undefined) throw new Error("Invalid item value: id is required");

    return value as Entry;
  };
}
