import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";

export function htmlToEditorState(html: string, editor: any) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(html, "text/html");

  const nodes = $generateNodesFromDOM(editor, dom);
  const root = $getRoot();

  root.clear();
  root.append(...nodes);
}
