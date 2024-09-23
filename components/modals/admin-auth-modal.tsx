import { api } from "@/convex/_generated/api";
import { useAdminAuthModal } from "@/hooks/modal-state/use-admin-auth-modal";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConvexHttpClient } from "convex/browser";
import { Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "../ui/form";
import { InputPassword } from "../ui/input-password";

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const formSchema = z.object({
  password: z.string().min(5, "Password is too short"),
});

const AdminAuthModal = () => {
  const { isOpen, onClose, login } = useAdminAuthModal();
  const { user, isLoaded } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) return;

    const toastId = toast.loading("Authenticating...", {
      id: "ADMIN_AUTH",
      style: {
        color: "black",
      },
    });

    try {
      const admin = await client.query(api.admins.getAdmin, {
        email: user.emailAddresses[0].emailAddress,
        password: values.password,
      });

      if (!admin) {
        toast.error("Please check password and try again!", {
          id: toastId,
          style: {
            color: "red",
          },
        });
        return;
      }

      toast.success("Authenticated successfully!", {
        id: toastId,
        style: {
          color: "black",
        },
      });
      login();
      onClose();
    } catch (error) {
      console.log("ERROR", error);
      toast.error("Something went wrong", {
        id: toastId,
        style: {
          color: "red",
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black-1/75 blur-sm" />

      <DialogContent className="sm:max-w-md">
        {!isLoaded && (
          <div className="flex items-center space-x-2 text-sm text-blue-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Loading...</span>
          </div>
        )}

        <DialogHeader className={cn({ "opacity-45": !isLoaded })}>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>
            You are logging in as{" "}
            <span className="text-blue-500 underline text-sm">
              {user?.emailAddresses[0].emailAddress}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={form.formState.isSubmitting || !isLoaded}
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <InputPassword placeholder="Enter Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter
              className={cn("sm:justify-start", { "opacity-45": !isLoaded })}
            >
              <DialogClose disabled={!isLoaded} asChild>
                <Link href={"/app"}>
                  <Button size={"sm"} type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </DialogClose>
              <Button
                disabled={!isLoaded || form.formState.isSubmitting}
                size={"sm"}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader size={20} className="animate-spin mr-1.5" />
                )}
                Login
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAuthModal;
