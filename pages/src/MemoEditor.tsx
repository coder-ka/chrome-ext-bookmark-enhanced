import React, { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HashtagNode } from "@lexical/hashtag";
import { Tag } from "./schema";
import { $nodesOfType } from "lexical";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { $getNodeByKey } from "lexical";

function onError(error: Error) {
  console.error(error);
}

export function MemoEditor({
  className,
  defaultContent,
  onChange,
}: {
  className: string;
  defaultContent?: string;
  onChange?: (content: string, tags: Tag[]) => void;
}) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: "Memopad",
        theme: {
          hashtag: "text-pink-500",
        },
        onError,
        editorState: defaultContent,
        nodes: [HashtagNode],
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
            editorState.read(() => {
              const hashtags = $nodesOfType(HashtagNode);

              onChange &&
                onChange(
                  JSON.stringify(editorState.toJSON()),
                  hashtags.map((node) => ({
                    name: node.__text,
                  }))
                );
            });
          }}
        />
        <HistoryPlugin />
        <HashtagPlugin></HashtagPlugin>
        {/* <MutationListenerPlugin></MutationListenerPlugin> */}
      </div>
    </LexicalComposer>
  );
}

// function MutationListenerPlugin() {
//   const [editor] = useLexicalComposerContext();

//   const removeMutationListener = editor.registerMutationListener(
//     HashtagNode,
//     (mutatedNodes) => {
//       for (let [nodeKey, mutation] of mutatedNodes) {
//         editor.getEditorState().read(() => {
//           console.log(nodeKey, mutation);
//           const node: HashtagNode | null = $getNodeByKey(nodeKey);
//           console.log(node?.__text);
//         });
//       }
//     }
//   );

//   useEffect(() => {
//     return () => {
//       removeMutationListener();
//     };
//   }, []);

//   return null;
// }
