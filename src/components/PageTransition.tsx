import type { FC, ReactNode } from "react";
import { ViewTransition } from "react";

/**
 * Wraps one page's content. Links tagged nav-forward (into a case study) and
 * nav-back (back to the list) slide in their direction; every other
 * navigation gets a short fade. Shared elements named elsewhere (a project's
 * title and picture) morph on top of this. Browsers without the View
 * Transitions API simply navigate.
 *
 * It sits in each page, not the layout: layouts persist across navigations,
 * so enter and exit would never fire there.
 */
export const PageTransition: FC<{ children: ReactNode }> = ({ children }) => (
  <ViewTransition
    enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
    exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "page-fade" }}
    default="none"
  >
    <div className="page">{children}</div>
  </ViewTransition>
);
