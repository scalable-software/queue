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
