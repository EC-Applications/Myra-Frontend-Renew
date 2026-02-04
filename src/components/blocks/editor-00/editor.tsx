"use client";

import { $generateHtmlFromNodes } from "@lexical/html";
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { type EditorState, type SerializedEditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { htmlToEditorState } from "@/components/editor/utils/htmlToEditorState";
import { cn } from "@/lib/utils";
import { isEmpty } from "lodash";
import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { useRef, useEffect } from "react";

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
  placeholder
}: {
  namespace?: string;
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  editorHtmlState?: string;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  onHtmlChange?: (editorHtmlState: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const internalResetRef = useRef(0);
  const hadContentRef = useRef(false);

  useEffect(() => {
    const isEmpty = !editorHtmlState || editorHtmlState.trim() === "";

    if (isEmpty && hadContentRef.current) {
      // External reset detected (Formik resetForm)
      internalResetRef.current += 1;
      hadContentRef.current = false;
    }

    if (!isEmpty) {
      hadContentRef.current = true;
    }
  }, [editorHtmlState]);

  return (
    <div
      className={cn(
        "min-h-[80px] dark:placeholder:text-[#616265] placeholder:text-[20px] resize-none border-0 shadow-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
    >
      <LexicalComposer
        key={`${namespace}-${internalResetRef.current}`}
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
                  editor.update(() => {
                    htmlToEditorState(editorHtmlState, editor);
                  });
                },
              }
            : {}),
          ...(!editorState && !editorSerializedState && isEmpty(editorHtmlState)
            ? { editorState: undefined }
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
          <Plugins/>

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
