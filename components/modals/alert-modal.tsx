"use client";

import { Loader } from "lucide-react";
import { useIsMounted } from "usehooks-ts";
import { Button } from "../ui/button";
import CustomModal from "../global/custom-modal";

interface IAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal: React.FC<IAlertModalProps> = ({
  isOpen,
  loading,
  onClose,
  onConfirm,
}) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return (
    <CustomModal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          disabled={loading}
          size={"sm"}
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button disabled={loading} size={"sm"} onClick={onConfirm}>
          {loading && <Loader size={18} className="animate-spin mr-1" />}
          Continue
        </Button>
      </div>
    </CustomModal>
  );
};

export default AlertModal;
