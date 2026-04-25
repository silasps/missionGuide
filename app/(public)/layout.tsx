import PublicFooter from "@/components/public-footer";
import PublicHeader from "@/components/public-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader />
      <div className="min-h-[calc(100vh-140px)] sm:min-h-[calc(100vh-160px)]">{children}</div>
      <PublicFooter />
    </div>
  );
}