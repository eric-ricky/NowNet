"use client";

import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    firstname: z.string().min(2, "First name is required").max(50, "Too long"),
    lastname: z.string().min(2, "Last name is required").max(50, "Too long"),
    phone: z.string().min(1, "Phone number is required"),
    accepted: z.boolean(),
  })
  .refine((data) => data.accepted, {
    message: "Required",
    path: ["accepted"],
  });

const NewUserComponent = ({
  user,
}: {
  user: {
    email: string;
    imageUrl: string;
    uid: string;
    firstName: string;
    lastName: string;
  };
}) => {
  const createUser = useMutation(api.users.createUser);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstname: user.firstName || "",
      lastname: user.lastName || "",
      phone: "",
      accepted: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const toastId = toast.loading("Signing you up...", {
      id: "loadingInvite",
      style: {
        color: "black",
      },
    });
    const { email, imageUrl, uid } = user;
    const { firstname, lastname, phone } = values;

    try {
      const userId = await createUser({
        uid,
        email,
        avatarUrl: imageUrl,
        name: `${firstname} ${lastname}`,
        phone,
        balance: 0,
      });

      await axios.post(`/api/knock/welcome-notification`, {
        recipient_userId: userId,
        recipient_email: email,
        recipient_username: `${firstname} ${lastname}`,
        username: `${firstname} ${lastname}`,
        primary_action_url: `${process.env.NEXT_PUBLIC_SITE_URL}/app`,
      });

      toast.success(`Signed up successfully.`, {
        id: toastId,
        style: {
          color: "black",
        },
      });

      setLoading(true);
      router.refresh();
    } catch (error: any) {
      console.log(error);
      const errorMsg =
        error instanceof ConvexError ? error.data : "Error creating account";
      toast.error(errorMsg, {
        id: toastId,
        style: {
          color: "red",
        },
      });
    }
  };

  const {
    formState: { isSubmitting },
  } = form;

  return (
    <div className="h-screen grid place-items-center px-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-400 opacity-20 blur-[100px]"></div>
      </div>

      <div className="md:w-[520px] w-full flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Logo isMobile />

          <div className="flex items-center ">
            <p className="text-sm mr-2">
              Welcome,
              <span className="font-semibold">{user.firstName}</span>
            </p>
            <UserButton />
          </div>
        </div>

        <Card className={cn("md:w-[520px] w-full relative")}>
          {loading && (
            <div className="absolute top-0 left-0 w-full h-full bg-white/65 z-50 rounded-md grid place-items-center">
              <Loader className="animate-spin" />
            </div>
          )}

          <CardContent className="grid gap-4 rounded-2xl bg-white px-5 py-8 relative">
            <CardTitle className="text-center">Create your account</CardTitle>

            <CardDescription className="text-center">
              A new account will be created for the email <br />
              <span className="text-slate-900">{user.email}</span>
            </CardDescription>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 pt-4"
              >
                <div className="grid grid-cols-12 gap-2 w-full">
                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name="firstname"
                      disabled={isSubmitting}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <FormField
                      control={form.control}
                      name="lastname"
                      disabled={isSubmitting}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <FormField
                      control={form.control}
                      disabled={isSubmitting}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex-1">
                            <FormControl>
                              <PhoneInput
                                placeholder="Enter phone number"
                                defaultCountry="KE"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-12">
                    <FormField
                      control={form.control}
                      name="accepted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                          <FormMessage />

                          <FormControl>
                            <Checkbox
                              disabled={isSubmitting}
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-xs">
                              I agree to the{" "}
                              <Link
                                href="#"
                                className="text-blue-500 underline"
                              >
                                Terms of service
                              </Link>{" "}
                              and{" "}
                              <Link
                                href="#"
                                className="text-blue-500 underline"
                              >
                                Privacy policy
                              </Link>{" "}
                              of Pulse Corporation
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting && <Loader className="mr-2 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
          <p className="font-medium leading-none text-xs text-center py-4">
            &copy;Copyright {new Date().getFullYear()}{" "}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default NewUserComponent;
