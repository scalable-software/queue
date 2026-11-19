/**
 * @module Queue
 */

/**
 * A reactive queue that a host component creates for itself and keeps in a private field.
 * It is an add-on, not a custom element: an `EventTarget` with no tag, template or stylesheet.
 * @category Queue
 */
export class Queue extends EventTarget {
  constructor() {
    super();
  }
}
