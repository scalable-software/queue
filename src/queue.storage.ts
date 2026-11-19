/**
 * @module Queue
 */

import type { Item } from "./queue.meta.js";

/**
 * An item as the queue stores it: with when it was added, and whether it is being worked on
 * @category Storage
 * @hidden
 */
export type Stored<T extends object = Record<string, unknown>> = {
  id: string;
  item: Item<T>;
  added: number;
  working: boolean;
};

/**
 * The object store that holds the items, one record for each, keyed by id
 * @hidden
 */
const ITEMS = "items";

/**
 * The version of the stored format
 * @hidden
 */
const VERSION = 1;

/**
 * Keeps the items of one queue in the IndexedDB database named after its `storage`
 * @category Storage
 * @hidden
 */
export class Storage<T extends object = Record<string, unknown>> {
  /**
   * The open database; every read and write waits for it, in the order it was asked for
   * @hidden
   */
  private _database: Promise<IDBDatabase | null>;

  /**
   * Told once when the browser refuses the database; nothing is read or written afterwards
   * @hidden
   */
  private _onfail: () => void;

  /**
   * Open the database named `name`, creating it the first time
   * @param onfail - Told once when the browser refuses to open or to write the database
   */
  constructor(name: string, onfail: () => void) {
    this._onfail = onfail;
    this._database = this._open(name).catch(this._fail);
  }

  /**
   * Every stored item
   */
  public read = async (): Promise<Stored<T>[]> => {
    const database = await this._database;
    if (!database) return [];
    return this._request<Stored<T>[]>(
      database.transaction(ITEMS, "readonly").objectStore(ITEMS).getAll()
    );
  };

  /**
   * Store items, replacing the records with the same ids
   */
  public put = (...records: Stored<T>[]) => {
    this._database = this._database.then((database) => {
      if (!database) return null;
      const store = database.transaction(ITEMS, "readwrite").objectStore(ITEMS);
      records.forEach((record) => store.put(record));
      return database;
    });
  };

  /**
   * Remove the stored item with the given id
   */
  public delete = (id: string) => {
    this._database = this._database.then((database) => {
      if (!database) return null;
      database.transaction(ITEMS, "readwrite").objectStore(ITEMS).delete(id);
      return database;
    });
  };

  /**
   * Open the database, creating its object store the first time, and close it when another
   * connection wants to delete or upgrade it
   * @hidden
   */
  private _open = async (name: string): Promise<IDBDatabase> => {
    const request = indexedDB.open(name, VERSION);
    request.onupgradeneeded = () =>
      request.result.createObjectStore(ITEMS, { keyPath: "id" });
    return this._request<IDBDatabase>(request).then((database) => {
      database.onversionchange = () => database.close();
      return database;
    });
  };

  /**
   * Tell the queue that the browser refused the database
   * @hidden
   */
  private _fail = (): null => {
    this._onfail();
    return null;
  };

  /**
   * The result of a request, once it succeeds
   * @hidden
   */
  private _request = <R>(request: IDBRequest): Promise<R> =>
    new Promise<R>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result as R);
      request.onerror = () => reject(request.error);
    });
}
