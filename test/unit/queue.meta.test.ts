import { State, Operation, Event } from "@scalable.software/queue";

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
