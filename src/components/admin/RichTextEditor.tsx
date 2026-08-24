"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  ChevronDown,
  Italic,
  Link2,
  List,
  ListOrdered,
  Palette,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
} from "lucide-react";
import { FontSize } from "@/lib/tiptap-font-size";
import { Spacing } from "@/lib/tiptap-spacing";
import { FACTSHEET_PROSE_CLASSES } from "@/lib/factsheet-prose";
import { cn } from "@/lib/utils";

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Ink", value: "#1a1613" },
  { label: "Brand", value: "#8b1a3a" },
  { label: "Gold", value: "#9c7a3f" },
  { label: "Slate", value: "#3d5a6c" },
  { label: "Forest", value: "#2f5d4e" },
  { label: "Navy", value: "#1b458f" },
];

const FONT_SIZES = [
  { label: "Small", value: "0.9375rem" },
  { label: "Normal", value: "" },
  { label: "Large", value: "1.25rem" },
  { label: "X-Large", value: "1.5rem" },
];

const SPACING_OPTIONS = [
  { label: "Compact", value: "0.5em" },
  { label: "Normal", value: "" },
  { label: "Relaxed", value: "1.5em" },
  { label: "Wide", value: "2.5em" },
];

function ToolbarButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        active ? "bg-brand-700 text-paper" : "text-ink-300 hover:bg-paper/10 hover:text-paper"
      )}
    >
      {children}
    </button>
  );
}

function ColorPicker({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Text color"
        title="Text color"
        className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-ink-300 transition-colors hover:bg-paper/10 hover:text-paper"
      >
        <Palette className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-2 w-48 rounded-xl border border-paper/10 bg-ink-900 p-3 shadow-xl">
          <div className="grid grid-cols-3 gap-2">
            {TEXT_COLORS.map((color) => (
              <button
                key={color.label}
                type="button"
                onClick={() => {
                  if (color.value) {
                    editor.chain().focus().setColor(color.value).run();
                  } else {
                    editor.chain().focus().unsetColor().run();
                  }
                  setOpen(false);
                }}
                title={color.label}
                className="flex flex-col items-center gap-1 rounded-lg p-1.5 transition-colors hover:bg-paper/10"
              >
                <span
                  className="h-5 w-5 rounded-full border border-paper/20"
                  style={{ backgroundColor: color.value || "#8f8f8f" }}
                />
                <span className="text-[9px] text-ink-400">{color.label}</span>
              </button>
            ))}
          </div>
          <label className="mt-3 flex items-center justify-between gap-2 border-t border-paper/10 pt-3 text-xs text-ink-400">
            Custom
            <input
              type="color"
              onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
              className="h-6 w-10 cursor-pointer rounded border border-paper/15 bg-transparent"
            />
          </label>
        </div>
      )}
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: {
          openOnClick: false,
          autolink: false,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Spacing,
      Placeholder.configure({
        placeholder: "Write the factsheet content here…",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: cn(FACTSHEET_PROSE_CLASSES, "min-h-[24rem] px-6 py-5 focus:outline-none"),
      },
    },
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
  });

  const liveState = useEditorState({
    editor,
    selector: ({ editor: instance }) => {
      if (!instance) return null;
      return {
        bold: instance.isActive("bold"),
        italic: instance.isActive("italic"),
        underline: instance.isActive("underline"),
        strike: instance.isActive("strike"),
        bulletList: instance.isActive("bulletList"),
        orderedList: instance.isActive("orderedList"),
        blockquote: instance.isActive("blockquote"),
        link: instance.isActive("link"),
        heading: instance.isActive("heading", { level: 2 })
          ? "2"
          : instance.isActive("heading", { level: 3 })
            ? "3"
            : "0",
        fontSize: (instance.getAttributes("textStyle").fontSize as string | undefined) ?? "",
        spacing:
          (instance.state.selection.$from.parent.attrs.spacing as string | undefined) ?? "",
        canUndo: instance.can().undo(),
        canRedo: instance.can().redo(),
      };
    },
  });

  // `useEditorState`'s snapshot only refreshes on editor transactions, so on
  // first mount (before any transaction has fired) it still reflects the
  // pre-creation `null` editor even though `editor` itself is already ready.
  // Fall back to an all-inactive default so the toolbar renders immediately.
  const state = liveState ?? {
    bold: false,
    italic: false,
    underline: false,
    strike: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    link: false,
    heading: "0" as const,
    fontSize: "",
    spacing: "",
    canUndo: false,
    canRedo: false,
  };

  if (!editor) {
    return (
      <div className="min-h-[26rem] animate-pulse rounded-2xl border border-paper/10 bg-paper/[0.03]" />
    );
  }

  function setLink() {
    const previousUrl = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor!.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-paper/15">
      <div className="max-h-[34rem] overflow-y-auto">
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-paper/10 bg-ink-900 px-3 py-2">
          <select
            aria-label="Block style"
            value={state.heading}
            onChange={(event) => {
              const value = event.target.value;
              if (value === "0") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: Number(value) as 2 | 3 }).run();
            }}
            className="h-8 rounded-lg border border-paper/15 bg-ink-900 px-2 text-xs text-paper outline-none focus:border-brand-500"
          >
            <option value="0">Paragraph</option>
            <option value="2">Heading</option>
            <option value="3">Subheading</option>
          </select>

          <select
            aria-label="Font size"
            value={state.fontSize}
            onChange={(event) => {
              const value = event.target.value;
              if (value) editor.chain().focus().setFontSize(value).run();
              else editor.chain().focus().unsetFontSize().run();
            }}
            className="h-8 rounded-lg border border-paper/15 bg-ink-900 px-2 text-xs text-paper outline-none focus:border-brand-500"
          >
            {FONT_SIZES.map((size) => (
              <option key={size.label} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Paragraph spacing"
            value={state.spacing}
            onChange={(event) => {
              const value = event.target.value;
              if (value) editor.chain().focus().setSpacing(value).run();
              else editor.chain().focus().unsetSpacing().run();
            }}
            className="h-8 rounded-lg border border-paper/15 bg-ink-900 px-2 text-xs text-paper outline-none focus:border-brand-500"
          >
            {SPACING_OPTIONS.map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="mx-1 h-5 w-px bg-paper/10" />

          <ToolbarButton
            label="Bold"
            active={state.bold}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Italic"
            active={state.italic}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Underline"
            active={state.underline}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            active={state.strike}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <ColorPicker editor={editor} />

          <div className="mx-1 h-5 w-px bg-paper/10" />

          <ToolbarButton
            label="Bullet list"
            active={state.bulletList}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Numbered list"
            active={state.orderedList}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Callout box (example / how we can help)"
            active={state.blockquote}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <div className="mx-1 h-5 w-px bg-paper/10" />

          <ToolbarButton label="Add link" active={state.link} onClick={setLink}>
            <Link2 className="h-4 w-4" />
          </ToolbarButton>
          {state.link && (
            <ToolbarButton
              label="Remove link"
              onClick={() => editor.chain().focus().unsetLink().run()}
            >
              <Unlink className="h-4 w-4" />
            </ToolbarButton>
          )}

          <div className="ml-auto flex items-center gap-1">
            <ToolbarButton
              label="Undo"
              disabled={!state.canUndo}
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo2 className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              label="Redo"
              disabled={!state.canRedo}
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo2 className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>

        <div className="bg-paper">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
