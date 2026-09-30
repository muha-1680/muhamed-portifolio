import Navbar from "@/components/Navbar";
import { getContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();
  const firstName = content.about.name.split(" ")[0];

  return (
    <>
      {/* Theme color chosen in /admin, applied before paint */}
      <style>{`:root{--primary:${content.colors.primary};}`}</style>
      <Navbar firstName={firstName} profilePhoto={content.about.profilePhoto} />
      <main className="page-wrap">{children}</main>
    </>
  );
}
