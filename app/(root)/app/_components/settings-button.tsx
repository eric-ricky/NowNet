"use client";

import { BellRing, Settings } from "lucide-react";

import PushNotificationToggle from "@/components/global/push-notification-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useActiveUser from "@/hooks/db/use-active-user";

const SettingsButton = () => {
  const { activeUser } = useActiveUser();

  if (!activeUser) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"sm"} variant="ghost">
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-5">
        <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BellRing className="mr-2 h-4 w-4" />
            <span>Push Notification</span>
            <div className="ml-auto">
              <PushNotificationToggle user={activeUser} />
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsButton;
