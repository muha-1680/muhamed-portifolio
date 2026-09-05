import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";
import LoginForm from "@/components/LoginForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Panel",
};

export default async function AdminPage() {
  const authed = await isAuthenticated();
  return authed ? <AdminDashboard /> : <LoginForm />;
}