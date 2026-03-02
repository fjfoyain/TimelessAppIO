import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wallet - Timeless",
  description: "Manage your Timeless wallet. Add funds, withdraw, and view transaction history.",
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
