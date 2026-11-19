/**
 * @module Queue
 */

import { Order, Priority } from "./queue.meta.js";
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
    const { id, priority } = value as Record<string, unknown>;

    if (id === undefined) throw new Error("Invalid item value: id is required");
    if (typeof id !== "string" || id === "")
      throw new Error("Invalid item value: id is invalid");

    const ranked =
      Number.isInteger(priority) &&
      (priority as number) >= Priority.LOWEST &&
      (priority as number) <= Priority.HIGHEST;
    if (priority !== undefined && !ranked)
      throw new Error("Invalid item value: priority is invalid");

    return value as Entry;
  };

  /**
   * Validate the id of an item
   * @category Validation
   */
  public static id = (value: unknown) => {
    if (typeof value !== "string" || value === "")
      throw new Error(`Invalid id value: ${value}`);

    return value;
  };
}
