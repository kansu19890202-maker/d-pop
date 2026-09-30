import { redirect } from "next/navigation";

export default async function EditPopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/pops/${id}`);
}
