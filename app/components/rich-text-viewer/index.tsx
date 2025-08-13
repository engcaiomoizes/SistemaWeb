import React from "react";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";

interface RichTextViewerProps {
    content: string;
}

export default function RichTextViewer({ content }: RichTextViewerProps) {
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
        ],
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: "outline-none",
            },
        },
    })
    
    return (
        <div>
            <EditorContent editor={editor} />
        </div>
    );
}
