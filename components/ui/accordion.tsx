import * as React from "react";

import { cn } from "@/lib/utils";

const Accordion = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => (
  <div
    className={cn(
      "grid divide-y divide-neutral-200 max-w-xl mx-auto mt-8",
      className
    )}
  >
    {children}
  </div>
);

const AccordionItem = ({
  className,
  title,
  content,
}: {
  className?: string;
  title: string;
  content: string;
}) => (
  <div className={cn("py-5", className)}>
    <details className="group">
      <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
        <span>{title}</span>
        <span className="transition group-open:rotate-180">
          <svg
            fill="none"
            height="24"
            shape-rendering="geometricPrecision"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </span>
      </summary>
      <p className="text-neutral-600 mt-3 group-open:animate-fadeIn">
        {content}
      </p>
    </details>
  </div>
);

export { Accordion, AccordionItem };
