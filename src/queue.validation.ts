/**
 * @module Queue
 */

import type { Options } from "./queue.meta.js";

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

    return value as Options;
  };
}
