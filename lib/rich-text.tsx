import { Fragment, type ReactNode } from "react";

/**
 * Safe mini-renderer for the course blurbs: takes a string with <b>...</b>
 * and <i>...</i> tags and returns React nodes via element factories only.
 */
export function renderRich(input: string): ReactNode {
  const parts = input.split(/(<b>[\s\S]*?<\/b>|<i>[\s\S]*?<\/i>)/g);
  return parts.map((part, i) => {
    if (part.startsWith("<b>") && part.endsWith("</b>")) {
      return <b key={i}>{part.slice(3, -4)}</b>;
    }
    if (part.startsWith("<i>") && part.endsWith("</i>")) {
      return <i key={i}>{part.slice(3, -4)}</i>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
