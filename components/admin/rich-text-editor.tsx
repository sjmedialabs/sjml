"use client"

import React, { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Undo,
  Redo,
} from "lucide-react"

interface RichTextEditorProps {
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  description?: string
}

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder,
  className = "",
  description,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class:
          "rich-text-editor-content min-h-[140px] px-3.5 py-3 text-sm admin-text-primary focus:outline-none leading-relaxed max-w-none [&_p]:mb-2 last:[&_p]:mb-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:list-item [&_li>p]:mb-0",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Synchronize external value changes if content differs
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false })
    }
  }, [editor, value])

  if (!editor) {
    return (
      <div className={`w-full min-w-0 ${className}`}>
        {label && <label className="block text-sm font-medium admin-text-secondary mb-1.5">{label}</label>}
        <div className="w-full min-h-[140px] px-4 py-3 rounded-lg admin-input text-sm admin-text-muted">
          Loading editor...
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-w-0 ${className}`}>
      {label && <label className="block text-sm font-medium admin-text-secondary mb-1.5">{label}</label>}
      {description && <p className="text-xs admin-text-muted mb-2">{description}</p>}

      <div className="rounded-xl border admin-border overflow-hidden admin-bg-tertiary focus-within:border-primary transition-colors shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-1.5 border-b admin-border admin-bg-secondary">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`cursor-pointer p-1.5 rounded text-xs transition-colors ${
              editor.isActive("bold")
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-[#525252] hover:text-black hover:bg-black/5"
            }`}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`cursor-pointer p-1.5 rounded text-xs transition-colors ${
              editor.isActive("italic")
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-[#525252] hover:text-black hover:bg-black/5"
            }`}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`cursor-pointer p-1.5 rounded text-xs transition-colors ${
              editor.isActive("strike")
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-[#525252] hover:text-black hover:bg-black/5"
            }`}
            title="Strikethrough"
            aria-label="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-black/10 mx-1" aria-hidden="true" />

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`cursor-pointer p-1.5 rounded text-xs transition-colors ${
              editor.isActive("bulletList")
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-[#525252] hover:text-black hover:bg-black/5"
            }`}
            title="Bullet List"
            aria-label="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Ordered List */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`cursor-pointer p-1.5 rounded text-xs transition-colors ${
              editor.isActive("orderedList")
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-[#525252] hover:text-black hover:bg-black/5"
            }`}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-black/10 mx-1" aria-hidden="true" />

          {/* Undo */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="cursor-pointer p-1.5 rounded text-xs text-[#525252] hover:text-black hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>

          {/* Redo */}
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="cursor-pointer p-1.5 rounded text-xs text-[#525252] hover:text-black hover:bg-black/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Editable Area */}
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
