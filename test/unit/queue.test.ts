import {
  Queue,
  State,
  Order,
  Condition,
  Datum,
  Priority,
  Operation
} from "@scalable.software/queue";

import type { Item } from "@scalable.software/queue";

// Configuration
given("Queue imported", () => {
  then("Queue is defined", () => {
    expect(Queue).toBeDefined();
  });

  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("queue is an EventTarget", () => {
      expect(queue).toBeInstanceOf(EventTarget);
    });
  });
});

// State
state(State.ORDER, () => {
  given("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.order` getter exists", () => {
      expect(hasGetter(queue, State.ORDER)).toBe(true);
    });

    then("`queue.order` is `Order.FIFO`", () => {
      expect(queue.order).toBe(Order.FIFO);
    });

    then("assigning `queue.order` does not compile", () => {
      const assign = () => {
        // @ts-expect-error: `order` is chosen when the queue is created
        queue.order = Order.PRIORITY;
      };
      expect(assign).toEqual(jasmine.any(Function));
    });
  });

  given("a queue is created with `{ order: Order.PRIORITY }`", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.PRIORITY });
    });

    then("`queue.order` is `Order.PRIORITY`", () => {
      expect(queue.order).toBe(Order.PRIORITY);
    });
  });

  given("a queue is created with `{ order: Order.FIFO }`", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.FIFO });
    });

    then("`queue.order` is `Order.FIFO`", () => {
      expect(queue.order).toBe(Order.FIFO);
    });
  });

  given("a queue is created with `{}`", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({});
    });

    then("`queue.order` is `Order.FIFO`", () => {
      expect(queue.order).toBe(Order.FIFO);
    });
  });

  given("a queue is created with `fifo` as options", () => {
    let error: Error;
    beforeEach(() => {
      try {
        new Queue("fifo" as any);
      } catch (err) {
        error = err as Error;
      }
    });

    then("an error is thrown", () => {
      expect(error).toBeDefined();
    });

    then("error message is 'Invalid options value: fifo'", () => {
      expect(error.message).toBe("Invalid options value: fifo");
    });
  });

  given("a queue is created with `{ order: \"invalid\" }`", () => {
    let error: Error;
    beforeEach(() => {
      try {
        new Queue({ order: "invalid" as any });
      } catch (err) {
        error = err as Error;
      }
    });

    then("an error is thrown", () => {
      expect(error).toBeDefined();
    });

    then("error message is 'Invalid options value: order is invalid'", () => {
      expect(error.message).toBe("Invalid options value: order is invalid");
    });
  });
});

state(State.CONDITION, () => {
  given("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.condition` getter exists", () => {
      expect(hasGetter(queue, State.CONDITION)).toBe(true);
    });

    then("`queue.condition` is `Condition.EMPTY`", () => {
      expect(queue.condition).toBe(Condition.EMPTY);
    });
  });
});

// Data
data(Datum.WAITING, () => {
  given("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.waiting` getter exists", () => {
      expect(hasGetter(queue, Datum.WAITING)).toBe(true);
    });

    then("`queue.waiting` is empty", () => {
      expect(queue.waiting).toEqual([]);
    });

    when("`item` is added", () => {
      let item: { id: string; file: string; meta: { name: string } };
      beforeEach(() => {
        item = { id: "a", file: "report.pdf", meta: { name: "Report" } };
        queue.add(item);
      });

      then("`queue.waiting[0]` is a copy, not `item` itself", () => {
        expect(queue.waiting[0] as unknown).not.toBe(item);
      });

      then("`queue.waiting` is frozen", () => {
        expect(Object.isFrozen(queue.waiting)).toBeTrue();
      });

      then("`queue.waiting[0]` is frozen", () => {
        expect(Object.isFrozen(queue.waiting[0])).toBeTrue();
      });

      then("`queue.waiting[0].meta` is frozen", () => {
        expect(Object.isFrozen(queue.waiting[0].meta)).toBeTrue();
      });

      when("`item.meta.name` is changed afterwards", () => {
        beforeEach(() => {
          item.meta.name = "Changed";
        });

        then("`queue.waiting[0].meta.name` is still `Report`", () => {
          expect((queue.waiting[0].meta as { name: string }).name).toBe("Report");
        });
      });

      when("`queue.waiting[0].file` is assigned", () => {
        let error: unknown;
        beforeEach(() => {
          try {
            (queue.waiting[0] as unknown as { file: string }).file = "changed.pdf";
          } catch (err) {
            error = err;
          }
        });

        then("a `TypeError` is thrown", () => {
          expect(error).toEqual(jasmine.any(TypeError));
        });

        then("`queue.waiting[0].file` is still `report.pdf`", () => {
          expect(queue.waiting[0].file).toBe("report.pdf");
        });
      });
    });
  });
});

data(Datum.WORKING, () => {
  given("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.working` getter exists", () => {
      expect(hasGetter(queue, Datum.WORKING)).toBe(true);
    });

    then("`queue.working` is empty", () => {
      expect(queue.working).toEqual([]);
    });
  });
});

// Operation
operation(Operation.ADD, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.add` exists", () => {
      expect(queue.add).toBeDefined();
    });

    when("`queue.add({ id: \"a\", file: \"report.pdf\" })` is invoked", () => {
      let result: unknown;
      beforeEach(() => {
        result = queue.add({ id: "a", file: "report.pdf" });
      });

      then("`undefined` is returned", () => {
        expect(result).toBeUndefined();
      });

      then("`queue.waiting` holds the item with `Priority.LOWEST`", () => {
        expect(queue.waiting).toEqual([
          { id: "a", file: "report.pdf", priority: Priority.LOWEST }
        ]);
      });
    });

    when("`queue.add({ id: \"a\", priority: 7 })` is invoked", () => {
      beforeEach(() => {
        queue.add({ id: "a", priority: 7 });
      });

      then("`queue.waiting[0].priority` is `7`", () => {
        expect(queue.waiting[0].priority).toBe(7);
      });
    });

    when("`a`, `b` with priority 10, and `c` are added", () => {
      beforeEach(() => {
        queue.add({ id: "a" });
        queue.add({ id: "b", priority: 10 });
        queue.add({ id: "c" });
      });

      then("`queue.waiting` holds `a`, `b`, then `c`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a", "b", "c"]);
      });
    });

    when("`queue.add({ id: \"a\", priority: 11 })` is invoked", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.add({ id: "a", priority: 11 });
        } catch (err) {
          error = err as Error;
        }
      });

      then("an error is thrown", () => {
        expect(error).toBeDefined();
      });

      then("error message is 'Invalid item value: priority is invalid'", () => {
        expect(error?.message).toBe("Invalid item value: priority is invalid");
      });

      then("`queue.waiting` is empty", () => {
        expect(queue.waiting).toEqual([]);
      });
    });

    and("`a` is waiting", () => {
      beforeEach(() => {
        queue.add({ id: "a", file: "report.pdf" });
      });

      when("`queue.add({ id: \"a\" })` is invoked", () => {
        let error: Error;
        beforeEach(() => {
          try {
            queue.add({ id: "a" });
          } catch (err) {
            error = err as Error;
          }
        });

        then("an error is thrown", () => {
          expect(error).toBeDefined();
        });

        then("error message is 'Invalid item value: id is already in the queue'", () => {
          expect(error?.message).toBe("Invalid item value: id is already in the queue");
        });

        then("`queue.waiting` holds only the first `a`", () => {
          expect(queue.waiting).toEqual([
            { id: "a", file: "report.pdf", priority: Priority.LOWEST }
          ]);
        });
      });
    });
  });

  and("a queue is created with `{ order: Order.PRIORITY }`", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.PRIORITY });
    });

    when("`a` (1), `b` (5), `c` (5) and `d` (10) are added", () => {
      beforeEach(() => {
        queue.add({ id: "a", priority: 1 });
        queue.add({ id: "b", priority: 5 });
        queue.add({ id: "c", priority: 5 });
        queue.add({ id: "d", priority: 10 });
      });

      then("`queue.waiting` holds `d`, `b`, `c`, then `a`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["d", "b", "c", "a"]);
      });
    });
  });

  and("a queue is created, and `a` is added and taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
    });

    when("`queue.add({ id: \"a\" })` is invoked", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.add({ id: "a" });
        } catch (err) {
          error = err as Error;
        }
      });

      then("error message is 'Invalid item value: id is already in the queue'", () => {
        expect(error?.message).toBe("Invalid item value: id is already in the queue");
      });

      then("`queue.waiting` is empty", () => {
        expect(queue.waiting).toEqual([]);
      });
    });
  });
});

operation(Operation.TAKE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.take` exists", () => {
      expect(queue.take).toBeDefined();
    });
  });

  and("a queue is created, and `a` then `b` are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
    });

    when("`queue.take()` is invoked", () => {
      let result: Item | null;
      beforeEach(() => {
        result = queue.take();
      });

      then("`a` is returned", () => {
        expect(result?.id).toBe("a");
      });

      then("the item returned is `queue.working[0]`", () => {
        expect(result).toBe(queue.working[0]);
      });

      then("`queue.waiting` holds `b`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["b"]);
      });

      then("`queue.working` holds `a`", () => {
        expect(queue.working.map(({ id }) => id)).toEqual(["a"]);
      });
    });
  });

  and("a queue is created with no items", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    when("`queue.take()` is invoked", () => {
      let result: Item | null;
      beforeEach(() => {
        result = queue.take();
      });

      then("`null` is returned", () => {
        expect(result).toBeNull();
      });

      then("`queue.working` is empty", () => {
        expect(queue.working).toEqual([]);
      });
    });
  });

  and("a queue is created, and `a` then `b` are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
    });

    when("`queue.take()` is invoked three times", () => {
      let results: (Item | null)[];
      beforeEach(() => {
        results = [queue.take(), queue.take(), queue.take()];
      });

      then("`a`, `b`, then `null` are returned", () => {
        expect(results.map((item) => item?.id ?? null)).toEqual(["a", "b", null]);
      });
    });
  });

  and("a queue is created with `{ order: Order.PRIORITY }`, and `a` (1) then `b` (10) are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.PRIORITY });
      queue.add({ id: "a", priority: 1 });
      queue.add({ id: "b", priority: 10 });
    });

    when("`queue.take()` is invoked", () => {
      let result: Item | null;
      beforeEach(() => {
        result = queue.take();
      });

      then("`b` is returned", () => {
        expect(result?.id).toBe("b");
      });
    });
  });
});

operation(Operation.PEEK, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.peek` exists", () => {
      expect(queue.peek).toBeDefined();
    });
  });
});

// Event
