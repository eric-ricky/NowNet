"use client";

import { Button } from "@/components/ui/button";
import { Axe, MonitorSmartphone, Phone, Plus } from "lucide-react";
import React from "react";
import DevicesTable from "./_components/devices-table";
import { useDeviceModal } from "@/hooks/modal-state/use-device-modal";
import useActiveUser from "@/hooks/db/use-active-user";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const DevicesPage = () => {
  const { onOpen: onOpenDeviceModal, setDevice } = useDeviceModal();
  const { activeUser } = useActiveUser();
  const devices = useQuery(api.devices.getUsersDevices, {
    user: activeUser?._id,
  });

  const onNewDevice = () => {
    setDevice(undefined);
    onOpenDeviceModal();
  };

  return (
    <div className="flex flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4 md:px-8">
          <div className="border p-2 rounded-md text-muted-foreground">
            <MonitorSmartphone size={18} />
          </div>
          <h2 className="hidden md:flex font-semibold tracking-tight ml-2">
            My Devices
          </h2>

          <div className="ml-auto flex items-center space-x-4">
            <Button onClick={onNewDevice} size={"sm"} variant={"secondary"}>
              <Plus size={15} />
              <span className="hidden md:flex ml-1">New</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 overflow-x-hidden">
        <DevicesTable devices={devices || []} loading={!devices} />
      </div>
    </div>
  );
};

export default DevicesPage;
