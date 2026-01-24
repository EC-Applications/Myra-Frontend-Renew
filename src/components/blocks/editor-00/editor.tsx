"use client";

import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { type EditorState, type SerializedEditorState } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { htmlToEditorState } from "@/components/editor/utils/htmlToEditorState";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  editorState,
  editorSerializedState,
  editorHtmlState,
  onChange,
  onSerializedChange,
  onHtmlChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  editorHtmlState?: string;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  onHtmlChange?: (editorHtmlState: string) => void;
}) {
  return (
    <div className="min-h-[80px] dark:placeholder:text-[#616265] placeholder:text-[20px] resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          editorState: (editor) => {
            // Priority order
            if (editorHtmlState) {
              editor.update(() => {
                htmlToEditorState(editorHtmlState, editor);
              });
              return;
            }

            if (editorSerializedState) {
              editor.setEditorState(
                editor.parseEditorState(JSON.stringify(editorSerializedState)),
              );
              return;
            }

            if (editorState) {
              editor.setEditorState(editorState);
            }
          },
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange
            onChange={(editorState, editor) => {
              onChange?.(editorState);
              const serialized = editorState.toJSON();
              onSerializedChange?.(serialized);
              if (onHtmlChange) {
                editorState.read(() => {
                  const html = $generateHtmlFromNodes(editor);
                  onHtmlChange(html);
                });
              }
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
