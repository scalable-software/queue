import { Queue, State, Order } from "@scalable.software/queue";

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
  });
});

// Data

// Operation

// Event
