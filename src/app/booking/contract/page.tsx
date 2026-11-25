import { redirect } from "next/navigation";

// The dual-signature contract was replaced by the booking flow. Old links
// (from chats and emails) land on the bookings board instead of a dead page.
export default function LegacyContractPage() {
  redirect("/dashboard/projects");
}
