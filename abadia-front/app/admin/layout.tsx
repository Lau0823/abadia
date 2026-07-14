import AdminLayoutClient from "@/components/AdminLayoutClient";

export const metadata = {
  title: "Dashboard | Abadia",
  description: "Panel de administración de Abadia",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
