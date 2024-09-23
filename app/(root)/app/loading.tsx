import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen grid place-items-center">
      <Loader2 size={24} className="animate-spin" />
    </div>
  );
};

export default Loading;
