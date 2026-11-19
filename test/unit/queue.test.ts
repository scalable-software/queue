import { Queue, State, Order, Condition, Datum } from "@scalable.software/queue";

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

// Event
