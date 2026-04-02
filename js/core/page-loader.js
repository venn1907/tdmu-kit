import { injectFragment } from "./include.js";

export async function injectSections(sections) {
  await Promise.all(sections.map(({ slot, file }) => injectFragment(slot, file)));
  sections.forEach(({ init }) => init?.());
}
