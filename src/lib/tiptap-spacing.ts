import { Extension } from "@tiptap/core";

export interface SpacingOptions {
  types: string[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    spacing: {
      setSpacing: (spacing: string) => ReturnType;
      unsetSpacing: () => ReturnType;
    };
  }
}

/** Adds a `spacing` attribute (rendered as margin-bottom) to paragraphs and headings. */
export const Spacing = Extension.create<SpacingOptions>({
  name: "spacing",

  addOptions() {
    return { types: ["paragraph", "heading"] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          spacing: {
            default: null,
            parseHTML: (element) => element.style.marginBottom || null,
            renderHTML: (attributes) => {
              if (!attributes.spacing) return {};
              return { style: `margin-bottom: ${attributes.spacing}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setSpacing:
        (spacing: string) =>
        ({ commands, state }) => {
          const type = state.selection.$from.parent.type.name;
          if (!this.options.types.includes(type)) return false;
          return commands.updateAttributes(type, { spacing });
        },
      unsetSpacing:
        () =>
        ({ commands, state }) => {
          const type = state.selection.$from.parent.type.name;
          if (!this.options.types.includes(type)) return false;
          return commands.updateAttributes(type, { spacing: null });
        },
    };
  },
});
