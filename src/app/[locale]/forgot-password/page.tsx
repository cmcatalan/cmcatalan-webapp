import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export default async function ForgotPassword() {
  const session = await auth();

  if (session?.user) {
    redirect("/change-password");
    return null;
  }

  return <ForgotPasswordForm />;
}
