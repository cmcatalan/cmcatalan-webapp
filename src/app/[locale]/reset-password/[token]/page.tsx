import { auth } from "@/auth";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ params }: Props) {
  const { token } = await params;
  const session = await auth();

  if (session?.user) {
    redirect("/change-password");
    return null;
  }

  return <ResetPasswordForm token={token} />;
}
