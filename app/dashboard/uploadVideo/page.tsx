// app/dashboard/uploadVideo/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authoptions";
import { redirect } from "next/navigation";
import UploadCard from "@/components/UI/UploadCard";

export default async function UploadVideoPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/dashboard/uploadVideo");

  return <UploadCard />;
}
