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

        then("`State.READY` exists", () => {
          expect(State.READY).toBeDefined();
        });

        then("`State.READY` is `ready`", () => {
          expect(State.READY).toBe("ready");
        });

        then("`State.PERSISTED` exists", () => {
          expect(State.PERSISTED).toBeDefined();
        });

        then("`State.PERSISTED` is `persisted`", () => {
          expect(State.PERSISTED).toBe("persisted");
        });

        then("no state name is taken by `EventTarget`", () => {
          const taken = Object.values(State).filter(
            (name) => name in EventTarget.prototype
          );
          expect(taken).toEqual([]);
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

        then("no data name is taken by `EventTarget`", () => {
          const taken = Object.values(Datum).filter(
            (name) => name in EventTarget.prototype
          );
          expect(taken).toEqual([]);
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

        then("`Operation.TAKE` exists", () => {
          expect(Operation.TAKE).toBeDefined();
        });

        then("`Operation.TAKE` is `take`", () => {
          expect(Operation.TAKE).toBe("take");
        });

        then("`Operation.PEEK` exists", () => {
          expect(Operation.PEEK).toBeDefined();
        });

        then("`Operation.PEEK` is `peek`", () => {
          expect(Operation.PEEK).toBe("peek");
        });

        then("`Operation.UPDATE` exists", () => {
          expect(Operation.UPDATE).toBeDefined();
        });

        then("`Operation.UPDATE` is `update`", () => {
          expect(Operation.UPDATE).toBe("update");
        });

        then("`Operation.REMOVE` exists", () => {
          expect(Operation.REMOVE).toBeDefined();
        });

        then("`Operation.REMOVE` is `remove`", () => {
          expect(Operation.REMOVE).toBe("remove");
        });

        then("`Operation.PUT_BACK` exists", () => {
          expect(Operation.PUT_BACK).toBeDefined();
        });

        then("`Operation.PUT_BACK` is `putBack`", () => {
          expect(Operation.PUT_BACK).toBe("putBack");
        });

        then("no operation name is taken by `EventTarget`", () => {
          const taken = Object.values(Operation).filter(
            (name) => name in EventTarget.prototype
          );
          expect(taken).toEqual([]);
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

      when("Event is an object", () => {
        then("`Event.ON_ADD` exists", () => {
          expect(Event.ON_ADD).toBeDefined();
        });

        then("`Event.ON_ADD` is `onadd`", () => {
          expect(Event.ON_ADD).toBe("onadd");
        });

        then("`Event.ON_TAKE` exists", () => {
          expect(Event.ON_TAKE).toBeDefined();
        });

        then("`Event.ON_TAKE` is `ontake`", () => {
          expect(Event.ON_TAKE).toBe("ontake");
        });

        then("`Event.ON_UPDATE` exists", () => {
          expect(Event.ON_UPDATE).toBeDefined();
        });

        then("`Event.ON_UPDATE` is `onupdate`", () => {
          expect(Event.ON_UPDATE).toBe("onupdate");
        });

        then("`Event.ON_REMOVE` exists", () => {
          expect(Event.ON_REMOVE).toBeDefined();
        });

        then("`Event.ON_REMOVE` is `onremove`", () => {
          expect(Event.ON_REMOVE).toBe("onremove");
        });

        then("`Event.ON_PUT_BACK` exists", () => {
          expect(Event.ON_PUT_BACK).toBeDefined();
        });

        then("`Event.ON_PUT_BACK` is `onputback`", () => {
          expect(Event.ON_PUT_BACK).toBe("onputback");
        });

        then("`Event.ON_WAITING` exists", () => {
          expect(Event.ON_WAITING).toBeDefined();
        });

        then("`Event.ON_WAITING` is `onwaiting`", () => {
          expect(Event.ON_WAITING).toBe("onwaiting");
        });

        then("`Event.ON_BUSY` exists", () => {
          expect(Event.ON_BUSY).toBeDefined();
        });

        then("`Event.ON_BUSY` is `onbusy`", () => {
          expect(Event.ON_BUSY).toBe("onbusy");
        });

        then("`Event.ON_EMPTY` exists", () => {
          expect(Event.ON_EMPTY).toBeDefined();
        });

        then("`Event.ON_EMPTY` is `onempty`", () => {
          expect(Event.ON_EMPTY).toBe("onempty");
        });

        then("`Event.ON_READY` exists", () => {
          expect(Event.ON_READY).toBeDefined();
        });

        then("`Event.ON_READY` is `onready`", () => {
          expect(Event.ON_READY).toBe("onready");
        });

        then("`Event.ON_UNAVAILABLE` exists", () => {
          expect(Event.ON_UNAVAILABLE).toBeDefined();
        });

        then("`Event.ON_UNAVAILABLE` is `onunavailable`", () => {
          expect(Event.ON_UNAVAILABLE).toBe("onunavailable");
        });

        then("no event name is taken by `EventTarget`", () => {
          const taken = Object.values(Event).filter(
            (name) => name in EventTarget.prototype
          );
          expect(taken).toEqual([]);
        });
      });
    });
  });
});
