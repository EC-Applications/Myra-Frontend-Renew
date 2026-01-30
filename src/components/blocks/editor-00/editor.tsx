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
import { useMemo } from "react";
import { cn } from "@/lib/utils";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
};

export function Editor({
  namespace = "editor",
  editorState,
  editorSerializedState,
  editorHtmlState,
  onChange,
  onSerializedChange,
  onHtmlChange,
  className,
}: {
  namespace?: string;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  editorHtmlState?: string;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  onHtmlChange?: (editorHtmlState: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[80px] dark:placeholder:text-[#616265] placeholder:text-[20px] resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
    >
      <LexicalComposer
        key={namespace}
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
          ...(editorHtmlState
            ? {
                editorState: (editor) => {
                  // Priority order
                  if (editorHtmlState) {
                    editor.update(() => {
                      htmlToEditorState(editorHtmlState, editor);
                    });
                    return;
                  }
                },
              }
            : {}),
        }}
        // initialConfig={{
        //   ...editorConfig,
        //   namespace,
        //   editorState: (editor) => {
        //     // Priority order
        //     if (editorHtmlState) {
        //       editor.update(() => {
        //         htmlToEditorState(editorHtmlState, editor);
        //       });
        //       return;
        //     }

        //     if (editorSerializedState) {
        //       editor.setEditorState(
        //         editor.parseEditorState(JSON.stringify(editorSerializedState)),
        //       );
        //       return;
        //     }

        //     if (editorState) {
        //       editor.setEditorState(editorState);
        //     }
        //   },
        // }}
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
