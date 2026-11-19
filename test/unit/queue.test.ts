import {
  Queue,
  State,
  Order,
  Condition,
  Datum,
  Priority,
  Operation,
  Event
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

    then("assigning `queue.condition` does not compile", () => {
      const assign = () => {
        // @ts-expect-error: `condition` is computed by the queue
        queue.condition = Condition.BUSY;
      };
      expect(assign).toEqual(jasmine.any(Function));
    });
  });

  given("a queue is created, and `a` is added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
    });

    then("`queue.condition` is `Condition.WAITING`", () => {
      expect(queue.condition).toBe(Condition.WAITING);
    });
  });

  given("a queue is created, and `a` is added and taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
    });

    then("`queue.condition` is `Condition.BUSY`", () => {
      expect(queue.condition).toBe(Condition.BUSY);
    });
  });

  given("a queue is created, and `a` is added, taken and removed", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
      queue.remove("a");
    });

    then("`queue.condition` is `Condition.EMPTY`", () => {
      expect(queue.condition).toBe(Condition.EMPTY);
    });
  });

  given("a queue is created, and `a` is added, taken and put back", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
      queue.putBack("a");
    });

    then("`queue.condition` is `Condition.WAITING`", () => {
      expect(queue.condition).toBe(Condition.WAITING);
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

  and("a queue is created, and `a` then `b` are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
    });

    when("`queue.peek()` is invoked", () => {
      let result: Item | null;
      beforeEach(() => {
        result = queue.peek();
      });

      then("`queue.waiting[0]` is returned", () => {
        expect(result).toBe(queue.waiting[0]);
      });

      then("`queue.waiting` still holds `a` and `b`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a", "b"]);
      });

      then("`queue.working` is empty", () => {
        expect(queue.working).toEqual([]);
      });
    });
  });

  and("a queue is created with no items", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    when("`queue.peek()` is invoked", () => {
      let result: Item | null;
      beforeEach(() => {
        result = queue.peek();
      });

      then("`null` is returned", () => {
        expect(result).toBeNull();
      });
    });
  });
});

operation(Operation.UPDATE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.update` exists", () => {
      expect(queue.update).toBeDefined();
    });
  });

  and("a queue is created, and `a`, `b` (7) and `c` are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b", priority: 7, file: "report.pdf", pages: 3 });
      queue.add({ id: "c" });
    });

    when("`queue.update({ id: \"b\", file: \"summary.pdf\" })` is invoked", () => {
      let result: unknown;
      beforeEach(() => {
        result = queue.update({ id: "b", file: "summary.pdf" });
      });

      then("`undefined` is returned", () => {
        expect(result).toBeUndefined();
      });

      then("`queue.waiting[1]` is `b` with `file` `summary.pdf`, its other fields kept", () => {
        expect(queue.waiting[1]).toEqual({
          id: "b",
          priority: 7,
          file: "summary.pdf",
          pages: 3
        });
      });

      then("`queue.waiting` still holds `a`, `b`, then `c`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a", "b", "c"]);
      });
    });
  });

  and("a queue is created, and `a` is added and taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a", file: "report.pdf" });
      queue.take();
    });

    when("`queue.update({ id: \"a\", file: \"summary.pdf\" })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "a", file: "summary.pdf" });
      });

      then("`queue.working[0].file` is `summary.pdf`", () => {
        expect(queue.working[0].file).toBe("summary.pdf");
      });

      then("`queue.waiting` is empty", () => {
        expect(queue.waiting).toEqual([]);
      });
    });
  });

  and("a queue is created with `{ order: Order.PRIORITY }`, and `a` (5), `b` (5) and `c` (1) are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.PRIORITY });
      queue.add({ id: "a", priority: 5 });
      queue.add({ id: "b", priority: 5 });
      queue.add({ id: "c", priority: 1 });
    });

    when("`queue.update({ id: \"c\", priority: 5 })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "c", priority: 5 });
      });

      then("`queue.waiting` holds `a`, `b`, then `c`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a", "b", "c"]);
      });
    });

    when("`queue.update({ id: \"b\", priority: 10 })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "b", priority: 10 });
      });

      then("`queue.waiting` holds `b`, `a`, then `c`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["b", "a", "c"]);
      });
    });
  });

  and("a queue is created, and `a` is added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
    });

    when("`queue.update({ id: \"z\", file: \"summary.pdf\" })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "z", file: "summary.pdf" });
      });

      then("`queue.waiting` holds only `a`, unchanged", () => {
        expect(queue.waiting).toEqual([{ id: "a", priority: Priority.LOWEST }]);
      });

      then("`queue.working` is empty", () => {
        expect(queue.working).toEqual([]);
      });
    });
  });

  and("a queue is created, and `a` is added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
    });

    when("`queue.update({ id: \"a\", priority: 11 })` is invoked", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.update({ id: "a", priority: 11 });
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

      then("`queue.waiting[0].priority` is still `Priority.LOWEST`", () => {
        expect(queue.waiting[0].priority).toBe(Priority.LOWEST);
      });
    });
  });
});

operation(Operation.REMOVE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.remove` exists", () => {
      expect(queue.remove).toBeDefined();
    });
  });

  and("a queue is created, and `a` then `b` are added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
    });

    when("`queue.remove(\"a\")` is invoked", () => {
      let result: unknown;
      beforeEach(() => {
        result = queue.remove("a");
      });

      then("`undefined` is returned", () => {
        expect(result).toBeUndefined();
      });

      then("`queue.waiting` holds only `b`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["b"]);
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

    when("`queue.remove(\"a\")` is invoked", () => {
      beforeEach(() => {
        queue.remove("a");
      });

      then("`queue.working` is empty", () => {
        expect(queue.working).toEqual([]);
      });
    });
  });

  and("a queue is created, and `a` is added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
    });

    when("`queue.remove(\"z\")` is invoked", () => {
      beforeEach(() => {
        queue.remove("z");
      });

      then("`queue.waiting` still holds `a`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a"]);
      });
    });
  });

  and("a queue is created, and `a` is added", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
    });

    when("`queue.remove(\"\")` is invoked", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.remove("");
        } catch (err) {
          error = err as Error;
        }
      });

      then("an error is thrown", () => {
        expect(error).toBeDefined();
      });

      then("error message is 'Invalid id value: '", () => {
        expect(error?.message).toBe("Invalid id value: ");
      });
    });
  });
});

operation(Operation.PUT_BACK, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.putBack` exists", () => {
      expect(queue.putBack).toBeDefined();
    });
  });

  and("a queue is created, `a`, `b` and `c` are added, and `a` and `b` are taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
      queue.add({ id: "c" });
      queue.take();
      queue.take();
    });

    when("`queue.putBack(\"a\")` is invoked", () => {
      let result: unknown;
      beforeEach(() => {
        result = queue.putBack("a");
      });

      then("`undefined` is returned", () => {
        expect(result).toBeUndefined();
      });

      then("`queue.waiting` holds `a`, then `c`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["a", "c"]);
      });

      then("`queue.working` holds `b`", () => {
        expect(queue.working.map(({ id }) => id)).toEqual(["b"]);
      });
    });
  });

  and("a queue is created, and `a` and `b` are added, and `a` is taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.add({ id: "b" });
      queue.take();
    });

    ["b", "z"].forEach((id) => {
      when(`\`queue.putBack("${id}")\` is invoked`, () => {
        beforeEach(() => {
          queue.putBack(id);
        });

        then("`queue.waiting` still holds `b`", () => {
          expect(queue.waiting.map(({ id }) => id)).toEqual(["b"]);
        });

        then("`queue.working` still holds `a`", () => {
          expect(queue.working.map(({ id }) => id)).toEqual(["a"]);
        });
      });
    });
  });

  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    when("`queue.putBack(\"\")` is invoked", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.putBack("");
        } catch (err) {
          error = err as Error;
        }
      });

      then("an error is thrown", () => {
        expect(error).toBeDefined();
      });

      then("error message is 'Invalid id value: '", () => {
        expect(error?.message).toBe("Invalid id value: ");
      });
    });
  });

  and("a queue is created with `{ order: Order.PRIORITY }`, `a` (1), `b` (10) and `c` (5) are added, and `b` is taken", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue({ order: Order.PRIORITY });
      queue.add({ id: "a", priority: 1 });
      queue.add({ id: "b", priority: 10 });
      queue.add({ id: "c", priority: 5 });
      queue.take();
    });

    when("`queue.putBack(\"b\")` is invoked", () => {
      beforeEach(() => {
        queue.putBack("b");
      });

      then("`queue.waiting` holds `b`, `c`, then `a`", () => {
        expect(queue.waiting.map(({ id }) => id)).toEqual(["b", "c", "a"]);
      });
    });
  });
});

// Event

events(Event.ON_ADD, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onadd` setter exists", () => {
      expect(hasSetter(queue, Event.ON_ADD)).toBe(true);
    });
  });

  and("a queue is created, and `queue.onadd` is assigned a listener", () => {
    let queue: Queue;
    let onadd: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      onadd = jasmine.createSpy("onadd");
      queue.onadd = onadd;
    });

    when("`queue.add({ id: \"a\" })` is invoked", () => {
      beforeEach(() => {
        queue.add({ id: "a" });
      });

      then("the listener is called once", () => {
        expect(onadd).toHaveBeenCalledTimes(1);
      });

      then("`detail.item` is the item as the queue holds it", () => {
        expect(onadd.calls.mostRecent().args[0].detail.item).toBe(queue.waiting[0]);
      });
    });
  });

  and("a queue is created, and `queue.onadd` is assigned `first`, then `second`", () => {
    let queue: Queue;
    let first: jasmine.Spy;
    let second: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      first = jasmine.createSpy("first");
      second = jasmine.createSpy("second");
      queue.onadd = first;
      queue.onadd = second;
    });

    when("an item is added", () => {
      beforeEach(() => {
        queue.add({ id: "a" });
      });

      then("`first` is not called", () => {
        expect(first).not.toHaveBeenCalled();
      });

      then("`second` is called", () => {
        expect(second).toHaveBeenCalled();
      });
    });

    and("`queue.onadd` is assigned `null`", () => {
      beforeEach(() => {
        queue.onadd = null;
      });

      when("an item is added", () => {
        beforeEach(() => {
          queue.add({ id: "a" });
        });

        then("`second` is not called", () => {
          expect(second).not.toHaveBeenCalled();
        });
      });
    });
  });

  and("a queue is created, and `queue.onadd` is assigned a listener", () => {
    let queue: Queue;
    let onadd: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      onadd = jasmine.createSpy("onadd");
      queue.onadd = onadd;
    });

    when("`queue.onadd` is assigned `invalid`", () => {
      let error: Error;
      beforeEach(() => {
        try {
          queue.onadd = "invalid" as any;
        } catch (err) {
          error = err as Error;
        }
      });

      then("error message is 'Invalid onadd value: invalid'", () => {
        expect(error?.message).toBe("Invalid onadd value: invalid");
      });

      and("an item is added", () => {
        beforeEach(() => {
          queue.add({ id: "a" });
        });

        then("the listener is still called", () => {
          expect(onadd).toHaveBeenCalled();
        });
      });
    });

    when("`queue.add({ id: \"a\", priority: 11 })` is rejected", () => {
      beforeEach(() => {
        try {
          queue.add({ id: "a", priority: 11 });
        } catch {}
      });

      then("the listener is not called", () => {
        expect(onadd).not.toHaveBeenCalled();
      });
    });
  });
});

events(Event.ON_TAKE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.ontake` setter exists", () => {
      expect(hasSetter(queue, Event.ON_TAKE)).toBe(true);
    });
  });

  and("a queue is created, `a` is added, and `queue.ontake` is assigned a listener", () => {
    let queue: Queue;
    let ontake: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      ontake = jasmine.createSpy("ontake");
      queue.ontake = ontake;
    });

    when("`queue.take()` is invoked", () => {
      beforeEach(() => {
        queue.take();
      });

      then("the listener is called once", () => {
        expect(ontake).toHaveBeenCalledTimes(1);
      });

      then("`detail.item` is the item as the queue holds it", () => {
        expect(ontake.calls.mostRecent().args[0].detail.item).toBe(queue.working[0]);
      });

      when("`queue.take()` is invoked again, with no item waiting", () => {
        beforeEach(() => {
          queue.take();
        });

        then("the listener is not called again", () => {
          expect(ontake).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

events(Event.ON_UPDATE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onupdate` setter exists", () => {
      expect(hasSetter(queue, Event.ON_UPDATE)).toBe(true);
    });
  });

  and("a queue is created, `a` is added, and `queue.onupdate` is assigned a listener", () => {
    let queue: Queue;
    let onupdate: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      onupdate = jasmine.createSpy("onupdate");
      queue.onupdate = onupdate;
    });

    when("`queue.update({ id: \"a\", file: \"summary.pdf\" })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "a", file: "summary.pdf" });
      });

      then("the listener is called once", () => {
        expect(onupdate).toHaveBeenCalledTimes(1);
      });

      then("`detail.item` is the changed item as the queue holds it", () => {
        expect(onupdate.calls.mostRecent().args[0].detail.item).toBe(queue.waiting[0]);
      });
    });
  });

  and("a queue is created, `a` is added, and `queue.onupdate` is assigned a listener", () => {
    let queue: Queue;
    let onupdate: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      onupdate = jasmine.createSpy("onupdate");
      queue.onupdate = onupdate;
    });

    when("`queue.update({ id: \"z\" })` is invoked", () => {
      beforeEach(() => {
        queue.update({ id: "z" });
      });

      then("the listener is not called", () => {
        expect(onupdate).not.toHaveBeenCalled();
      });
    });
  });
});

events(Event.ON_REMOVE, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onremove` setter exists", () => {
      expect(hasSetter(queue, Event.ON_REMOVE)).toBe(true);
    });
  });

  and("a queue is created, `a` is added, and `queue.onremove` is assigned a listener", () => {
    let queue: Queue;
    let onremove: jasmine.Spy;
    let held: Item;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      held = queue.waiting[0];
      onremove = jasmine.createSpy("onremove");
      queue.onremove = onremove;
    });

    when("`queue.remove(\"a\")` is invoked", () => {
      beforeEach(() => {
        queue.remove("a");
      });

      then("the listener is called once", () => {
        expect(onremove).toHaveBeenCalledTimes(1);
      });

      then("`detail.item` is the item as the queue held it", () => {
        expect(onremove.calls.mostRecent().args[0].detail.item).toBe(held);
      });
    });
  });

  and("a queue is created, `a` is added, and `queue.onremove` is assigned a listener", () => {
    let queue: Queue;
    let onremove: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      onremove = jasmine.createSpy("onremove");
      queue.onremove = onremove;
    });

    when("`queue.remove(\"z\")` is invoked", () => {
      beforeEach(() => {
        queue.remove("z");
      });

      then("the listener is not called", () => {
        expect(onremove).not.toHaveBeenCalled();
      });
    });
  });
});

events(Event.ON_PUT_BACK, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onputback` setter exists", () => {
      expect(hasSetter(queue, Event.ON_PUT_BACK)).toBe(true);
    });
  });

  and("a queue is created, `a` is added and taken, and `queue.onputback` is assigned a listener", () => {
    let queue: Queue;
    let onputback: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
      onputback = jasmine.createSpy("onputback");
      queue.onputback = onputback;
    });

    when("`queue.putBack(\"a\")` is invoked", () => {
      beforeEach(() => {
        queue.putBack("a");
      });

      then("the listener is called once", () => {
        expect(onputback).toHaveBeenCalledTimes(1);
      });

      then("`detail.item` is the item as the queue holds it", () => {
        expect(onputback.calls.mostRecent().args[0].detail.item).toBe(queue.waiting[0]);
      });

      when("`queue.putBack(\"a\")` is invoked again", () => {
        beforeEach(() => {
          queue.putBack("a");
        });

        then("the listener is not called again", () => {
          expect(onputback).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

events(Event.ON_WAITING, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onwaiting` setter exists", () => {
      expect(hasSetter(queue, Event.ON_WAITING)).toBe(true);
    });
  });

  and("a queue is created, and `queue.onwaiting` is assigned a listener", () => {
    let queue: Queue;
    let onwaiting: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      onwaiting = jasmine.createSpy("onwaiting");
      queue.onwaiting = onwaiting;
    });

    when("`a` is added", () => {
      beforeEach(() => {
        queue.add({ id: "a" });
      });

      then("the listener is called with `detail.condition` `Condition.WAITING`", () => {
        expect(onwaiting).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({ detail: { condition: Condition.WAITING } })
        );
      });

      when("`b` is added", () => {
        beforeEach(() => {
          queue.add({ id: "b" });
        });

        then("the listener is not called again", () => {
          expect(onwaiting).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});

events(Event.ON_BUSY, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onbusy` setter exists", () => {
      expect(hasSetter(queue, Event.ON_BUSY)).toBe(true);
    });
  });

  and("a queue is created, `a` is added, and `queue.onbusy` is assigned a listener", () => {
    let queue: Queue;
    let onbusy: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      onbusy = jasmine.createSpy("onbusy");
      queue.onbusy = onbusy;
    });

    when("`a` is taken", () => {
      beforeEach(() => {
        queue.take();
      });

      then("the listener is called with `detail.condition` `Condition.BUSY`", () => {
        expect(onbusy).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({ detail: { condition: Condition.BUSY } })
        );
      });
    });
  });
});

events(Event.ON_EMPTY, () => {
  and("a queue is created", () => {
    let queue: Queue;
    beforeEach(() => {
      queue = new Queue();
    });

    then("`queue.onempty` setter exists", () => {
      expect(hasSetter(queue, Event.ON_EMPTY)).toBe(true);
    });
  });

  and("a queue is created, `a` is added and taken, and `queue.onempty` is assigned a listener", () => {
    let queue: Queue;
    let onempty: jasmine.Spy;
    beforeEach(() => {
      queue = new Queue();
      queue.add({ id: "a" });
      queue.take();
      onempty = jasmine.createSpy("onempty");
      queue.onempty = onempty;
    });

    when("`a` is removed", () => {
      beforeEach(() => {
        queue.remove("a");
      });

      then("the listener is called with `detail.condition` `Condition.EMPTY`", () => {
        expect(onempty).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({ detail: { condition: Condition.EMPTY } })
        );
      });
    });
  });

  and("a queue is created, and every event it dispatches is recorded in order", () => {
    let queue: Queue;
    let order: string[];
    beforeEach(() => {
      queue = new Queue();
      order = [];
      Object.values(Event).forEach((name) =>
        queue.addEventListener(name, (event) => order.push(event.type))
      );
    });

    when("`a` is added, taken, put back, taken again and removed", () => {
      beforeEach(() => {
        queue.add({ id: "a" });
        queue.take();
        queue.putBack("a");
        queue.take();
        queue.remove("a");
      });

      then("each item event comes before the condition event it causes", () => {
        expect(order).toEqual([
          Event.ON_ADD,
          Event.ON_WAITING,
          Event.ON_TAKE,
          Event.ON_BUSY,
          Event.ON_PUT_BACK,
          Event.ON_WAITING,
          Event.ON_TAKE,
          Event.ON_BUSY,
          Event.ON_REMOVE,
          Event.ON_EMPTY
        ]);
      });
    });
  });
});
