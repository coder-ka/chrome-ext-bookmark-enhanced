import React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

function onError(error: Error) {
  console.error(error);
}

export function Memopad({
  className,
  defaultContent,
  onChange,
}: {
  className: string;
  defaultContent?: string;
  onChange?: (content: string) => void;
}) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Memopad",
        theme: {},
        onError,
        editorState(editor) {
          if (defaultContent !== undefined) {
            editor.setEditorState(editor.parseEditorState(defaultContent));
          }
        },
      }}
    >
      <div className="relative w-full">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className={`w-full p-2 min-h-[120px] ${className}`}
            />
          }
          placeholder={
            <div className="absolute left-0 top-[1px] p-2 text-gray-400">
              Here is a memo area.
              <br />
              Enter # to start adding tags.
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState) => {
            onChange && onChange(JSON.stringify(editorState.toJSON()));
          }}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
