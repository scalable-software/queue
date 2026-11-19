import { Queue, Order, Operation, Event } from "@scalable.software/queue";

const $ = (id) => document.getElementById(id);

let queue;

// The item in the form, with the fields that are filled in
const item = () => {
  const data = new FormData($("item"));
  const entry = { id: data.get("id") };
  data.get("priority") && (entry.priority = Number(data.get("priority")));
  data.get("file") && (entry.file = data.get("file"));
  return entry;
};

// What each operation is given from the form
const invoke = {
  [Operation.ADD]: () => queue.add(item()),
  [Operation.TAKE]: () => queue.take(),
  [Operation.PEEK]: () => queue.peek(),
  [Operation.UPDATE]: () => queue.update(item()),
  [Operation.REMOVE]: () => queue.remove(item().id),
  [Operation.PUT_BACK]: () => queue.putBack(item().id)
};

// Show the data and the states as the queue holds them
const show = () => {
  $("waiting").textContent = JSON.stringify(queue.waiting, null, 2);
  $("working").textContent = JSON.stringify(queue.working, null, 2);
  $("condition").textContent = queue.condition;
  $("order").value = queue.order;
};

// Log an event, oldest first, with its local time and its detail
const log = (event) => {
  const entry = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  entry.textContent = `${time} ${event.type} ${JSON.stringify(event.detail)}`;
  $("log").append(entry);
};

const create = (order) => {
  queue = new Queue({ order });
  Object.values(Event).forEach((name) =>
    queue.addEventListener(name, (event) => {
      log(event);
      show();
    })
  );
  show();
};

// Operations: one button for each, from the `Operation` list
Object.values(Operation).forEach((operation) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = operation;
  button.addEventListener("click", () => {
    $("error").textContent = "";
    $("returned").textContent = "—";
    try {
      const result = invoke[operation]();
      $("returned").textContent = JSON.stringify(result) ?? "undefined";
    } catch (error) {
      $("error").textContent = error.message;
    }
    show();
  });
  $("operations").append(button);
});

// States: `order` is chosen when the queue is created
Object.values(Order).forEach((order) => $("order").append(new Option(order, order)));
$("order").addEventListener("change", ({ target }) => create(target.value));

$("clear").addEventListener("click", () => $("log").replaceChildren());

create(Order.FIFO);
