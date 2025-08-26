import React, { useEffect } from "react";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from "./menu-bar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import CharacterCount from "@tiptap/extension-character-count";

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    HTMLAttributes: {
                        class: "list-disc ml-3",
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: "list-decimal ml-3",
                    }
                }
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            CharacterCount.configure({
                // limit: 240,
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: "min-h-[220px] border rounded-md bg-slate-50 dark:bg-gray-800 py-2 px-3"
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;

        const currentContent = editor.getHTML();
        if (content !== currentContent) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);
    
    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
