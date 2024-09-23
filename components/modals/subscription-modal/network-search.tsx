"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { api } from "@/convex/_generated/api";
import { INetworksData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { CheckCheck, ChevronsUpDown, Search, Wifi } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface IProps {
  selectedNetwork: INetworksData | undefined;
  setSelectedNetwork: Dispatch<SetStateAction<INetworksData | undefined>>;
}

const NetworkSearch = ({ selectedNetwork, setSelectedNetwork }: IProps) => {
  const [open, setOpen] = useState(false);
  const [searchName, setSearchName] = useState("");

  const networks = useQuery(api.wifis.getWifiByName, {
    name: searchName,
  });

  return (
    <div className="p-4 md:px-8 pb-8 space-y-4">
      <div className="flex items-center gap-4">
        <Wifi className="text-black" />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedNetwork?.name || "Find Network"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="max-w-fit md:min-w-[700px] w-full p-0">
            <div className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground">
              {/* command input */}
              <div className="flex items-center border-b px-3">
                <Search className="h-4 w-4 shrink-0 opacity-50" />
                <Input
                  value={searchName}
                  onChange={(v) => setSearchName(v.target.value)}
                  placeholder="Search network..."
                  className={cn(
                    "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-none focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  )}
                />
              </div>

              {/* command list */}
              <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
                {/* empty */}
                {searchName && networks && networks.length < 1 && (
                  <div className="py-6 text-center text-sm">No item found</div>
                )}

                {/* command group */}
                <div className="overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
                  {networks?.map((net) => (
                    // command item
                    <div
                      key={net._id}
                      role="button"
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:pointer-events-none",
                        {
                          "bg-accent text-accent-foreground":
                            net._id === selectedNetwork?._id,
                        }
                      )}
                      onClick={() => {
                        setSelectedNetwork(net);
                        setSearchName("");
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center w-full">
                        {net._id === selectedNetwork?._id && (
                          <CheckCheck
                            size={15}
                            className="text-muted-foreground mr-1"
                          />
                        )}
                        <span className="flex-1">{net.name}</span>
                        <span className="text-xs bg-slate-800 text-white py-1 px-2 rounded-xl">
                          {net.rate}/month
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default NetworkSearch;
