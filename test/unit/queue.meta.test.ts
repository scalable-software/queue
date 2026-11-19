import { State, Order, Operation, Event } from "@scalable.software/queue";

// State
metadata(Metadata.STATE, () => {
  and("State imported", () => {
    then("State is defined", () => {
      expect(State).toBeDefined();
    });

    when("State is defined", () => {
      then("State is an object", () => {
        expect(typeof State).toBe("object");
      });

      when("State is an object", () => {
        then("`State.ORDER` exists", () => {
          expect(State.ORDER).toBeDefined();
        });

        then("`State.ORDER` is `order`", () => {
          expect(State.ORDER).toBe("order");
        });
      });
    });
  });
});

metadata(State.ORDER, () => {
  and("Order imported", () => {
    then("Order is defined", () => {
      expect(Order).toBeDefined();
    });

    and("Order is defined", () => {
      then("Order is an object", () => {
        expect(typeof Order).toBe("object");
      });

      when("Order is an object", () => {
        then("`Order.FIFO` exists", () => {
          expect(Order.FIFO).toBeDefined();
        });

        then("`Order.FIFO` is `fifo`", () => {
          expect(Order.FIFO).toBe("fifo");
        });

        then("`Order.PRIORITY` exists", () => {
          expect(Order.PRIORITY).toBeDefined();
        });

        then("`Order.PRIORITY` is `priority`", () => {
          expect(Order.PRIORITY).toBe("priority");
        });
      });
    });
  });
});

// Operation
metadata(Metadata.OPERATION, () => {
  and("Operation imported", () => {
    then("Operation is defined", () => {
      expect(Operation).toBeDefined();
    });

    when("Operation is defined", () => {
      then("Operation is an object", () => {
        expect(typeof Operation).toBe("object");
      });
    });
  });
});

// Event
metadata(Metadata.EVENT, () => {
  and("Event imported", () => {
    then("Event is defined", () => {
      expect(Event).toBeDefined();
    });

    when("Event is defined", () => {
      then("Event is an object", () => {
        expect(typeof Event).toBe("object");
      });
    });
  });
});
