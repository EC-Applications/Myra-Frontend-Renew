import { type JSX } from "react";
import { ContentEditable as LexicalContentEditable } from "@lexical/react/LexicalContentEditable";

type Props = {
  placeholder: string;
  className?: string;
  placeholderClassName?: string;
};

export function ContentEditable({
  placeholder,
  className,
  placeholderClassName,
}: Props): JSX.Element {
  return (
    <LexicalContentEditable
      className={
        className ??
        `
          ContentEditable__root
          relative text-base block min-h-72 overflow-auto py-2
          focus:outline-none

          /* inline code */
          [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5
          dark:[&_code]:bg-zinc-800 dark:[&_code]:text-zinc-100

          /* force children inside code to inherit dark bg */
          dark:[&_code_*]:bg-transparent
          dark:[&_code_strong]:text-zinc-100
          dark:[&_code_strong]:font-bold

          /* optional: normalize spans, em, etc */
          dark:[&_code_span]:bg-transparent
          dark:[&_code_em]:bg-transparent
        `
      }
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={
            placeholderClassName ??
            `dark:text-[#616265] text-base pointer-events-none absolute top-0 left-0 overflow-hidden py-2.5 text-ellipsis select-none`
          }
        >
          {placeholder}
        </div>
      }
    />
  );
}
