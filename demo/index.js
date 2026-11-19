import { component } from "@scalable.software/queue";

await component.Template.load("component.template.html");

customElements.define(component.Tag, component);
