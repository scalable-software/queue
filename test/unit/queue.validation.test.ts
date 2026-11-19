import { Validate, Order } from "@scalable.software/queue";

// Options
validation("options", () => {
  given("Validate is imported", () => {
    then("Validate is defined", () => {
      expect(Validate).toBeDefined();
    });

    then("`Validate.options` exists", () => {
      expect(Validate.options).toBeDefined();
    });

    [{}, { order: Order.FIFO }, { order: Order.PRIORITY }].forEach((options) => {
      and(`\`value\` is \`${JSON.stringify(options)}\``, () => {
        let value: any;
        beforeEach(() => {
          value = options;
        });

        when("`Validate.options(value)` is called", () => {
          let result: unknown;
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              result = Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("`value` is returned", () => {
            expect(result).toBe(value);
          });
        });
      });
    });
  });
});

validation("options", () => {
  given("Validate is imported", () => {
    const invalid: [unknown, string][] = [
      ["fifo", "Invalid options value: fifo"],
      [null, "Invalid options value: null"],
      [1, "Invalid options value: 1"]
    ];

    invalid.forEach(([invalid, message]) => {
      and(`\`value\` is \`${invalid}\``, () => {
        let value: any;
        beforeEach(() => {
          value = invalid;
        });

        when("`Validate.options(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then(`error message is '${message}'`, () => {
            expect((error as Error).message).toEqual(message);
          });
        });
      });
    });
  });
});

validation("options", () => {
  given("Validate is imported", () => {
    [{ order: "invalid" }, { order: null }].forEach((options) => {
      and(`\`value\` is \`${JSON.stringify(options)}\``, () => {
        let value: any;
        beforeEach(() => {
          value = options;
        });

        when("`Validate.options(value)` is called", () => {
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              Validate.options(value);
            } catch (err) {
              error = err;
            }
          });

          then("an error is thrown", () => {
            expect(error).not.toBeUndefined();
          });

          then("error message is 'Invalid options value: order is invalid'", () => {
            expect((error as Error).message).toEqual(
              "Invalid options value: order is invalid"
            );
          });
        });
      });
    });
  });
});

// Item
validation("item", () => {
  given("Validate is imported", () => {
    then("`Validate.item` exists", () => {
      expect(Validate.item).toBeDefined();
    });

    [
      { id: "a" },
      { id: "a", priority: 1 },
      { id: "a", priority: 10, file: "report.pdf" }
    ].forEach((item) => {
      and(`\`value\` is \`${JSON.stringify(item)}\``, () => {
        let value: any;
        beforeEach(() => {
          value = item;
        });

        when("`Validate.item(value)` is called", () => {
          let result: unknown;
          let error: unknown | undefined;
          beforeEach(() => {
            try {
              result = Validate.item(value);
            } catch (err) {
              error = err;
            }
          });

          then("no error is thrown", () => {
            expect(error).toBeUndefined();
          });

          then("`value` is returned", () => {
            expect(result).toBe(value);
          });
        });
      });
    });
  });
});
