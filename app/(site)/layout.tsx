import Sidebar from "@/components/Sidebar";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const content = await getContent();

  return (
    <div className="portfolio">
      {/* Theme colors chosen in /admin, applied before paint */}
      <style>{`:root{--primary:${content.colors.primary};--bg:${content.colors.bg};}`}</style>
      <Sidebar name={content.about.name} />
      <main className="content">{children}</main>
    </div>
  );
}