import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface IProps {
  children: ReactNode;
  tip: string;
  tipstyle?: string;
}

const CustomTooltip = ({ children, tip, tipstyle }: IProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className={cn("p-1 bg-black text-xs", tipstyle)}>
          <p className="max-w-48 p-1">{tip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
