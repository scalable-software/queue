import {
  State,
  Order,
  Condition,
  Datum,
  Priority,
  Operation,
  Event
} from "@scalable.software/queue";

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

        then("`State.CONDITION` exists", () => {
          expect(State.CONDITION).toBeDefined();
        });

        then("`State.CONDITION` is `condition`", () => {
          expect(State.CONDITION).toBe("condition");
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

metadata(State.CONDITION, () => {
  and("Condition imported", () => {
    then("Condition is defined", () => {
      expect(Condition).toBeDefined();
    });

    and("Condition is defined", () => {
      then("Condition is an object", () => {
        expect(typeof Condition).toBe("object");
      });

      when("Condition is an object", () => {
        then("`Condition.EMPTY` exists", () => {
          expect(Condition.EMPTY).toBeDefined();
        });

        then("`Condition.EMPTY` is `empty`", () => {
          expect(Condition.EMPTY).toBe("empty");
        });

        then("`Condition.WAITING` exists", () => {
          expect(Condition.WAITING).toBeDefined();
        });

        then("`Condition.WAITING` is `waiting`", () => {
          expect(Condition.WAITING).toBe("waiting");
        });

        then("`Condition.BUSY` exists", () => {
          expect(Condition.BUSY).toBeDefined();
        });

        then("`Condition.BUSY` is `busy`", () => {
          expect(Condition.BUSY).toBe("busy");
        });
      });
    });
  });
});

// Datum
metadata(Metadata.DATUM, () => {
  and("Datum imported", () => {
    then("Datum is defined", () => {
      expect(Datum).toBeDefined();
    });

    when("Datum is defined", () => {
      then("Datum is an object", () => {
        expect(typeof Datum).toBe("object");
      });

      when("Datum is an object", () => {
        then("`Datum.WAITING` exists", () => {
          expect(Datum.WAITING).toBeDefined();
        });

        then("`Datum.WAITING` is `waiting`", () => {
          expect(Datum.WAITING).toBe("waiting");
        });

        then("`Datum.WORKING` exists", () => {
          expect(Datum.WORKING).toBeDefined();
        });

        then("`Datum.WORKING` is `working`", () => {
          expect(Datum.WORKING).toBe("working");
        });
      });
    });
  });
});

metadata("priority", () => {
  and("Priority imported", () => {
    then("Priority is defined", () => {
      expect(Priority).toBeDefined();
    });

    and("Priority is defined", () => {
      then("Priority is an object", () => {
        expect(typeof Priority).toBe("object");
      });

      when("Priority is an object", () => {
        then("`Priority.LOWEST` exists", () => {
          expect(Priority.LOWEST).toBeDefined();
        });

        then("`Priority.LOWEST` is `1`", () => {
          expect(Priority.LOWEST).toBe(1);
        });

        then("`Priority.HIGHEST` exists", () => {
          expect(Priority.HIGHEST).toBeDefined();
        });

        then("`Priority.HIGHEST` is `10`", () => {
          expect(Priority.HIGHEST).toBe(10);
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

      when("Operation is an object", () => {
        then("`Operation.ADD` exists", () => {
          expect(Operation.ADD).toBeDefined();
        });

        then("`Operation.ADD` is `add`", () => {
          expect(Operation.ADD).toBe("add");
        });
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
