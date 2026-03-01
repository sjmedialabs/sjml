"use client"

import { useRef, useEffect, useCallback } from "react"
import { Bold, Italic, List, ListOrdered, Heading2, Heading3, Type } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here…",
  className = "",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalChange = useRef(false)

  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    const next = value || ""
    if (el.innerHTML !== next) {
      el.innerHTML = next
    }
  }, [value])

  const emitChange = useCallback(() => {
    const el = editorRef.current
    if (!el) return
    isInternalChange.current = true
    onChange(el.innerHTML)
  }, [onChange])

  const exec = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    emitChange()
  }

  const block = (tag: string) => {
    exec("formatBlock", tag)
  }

  return (
    <div className={`border admin-border rounded-lg overflow-hidden admin-bg-tertiary ${className}`}>
      <div className="flex flex-wrap gap-1 p-2 border-b admin-border-light bg-black/20">
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <span className="w-px bg-border self-stretch my-1" aria-hidden />
        <button
          type="button"
          onClick={() => block("h2")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => block("h3")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => block("p")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Paragraph"
        >
          <Type className="w-4 h-4" />
        </button>
        <span className="w-px bg-border self-stretch my-1" aria-hidden />
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Bullet list"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="p-2 rounded hover:bg-white/10 admin-text-primary"
          title="Numbered list"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="rich-text-editor-content p-4 admin-text-primary outline-none text-sm"
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={emitChange}
        onPaste={(e) => {
          e.preventDefault()
          const text = e.clipboardData.getData("text/plain")
          document.execCommand("insertText", false, text)
          emitChange()
        }}
      />
    </div>
  )
}
