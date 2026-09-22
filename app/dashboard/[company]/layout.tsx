import Sidebar from "@/components/Sidebar";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ company: string }>;
}) {
  // Await params to extract the dynamic company segment
  const { company } = await params;

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100">
      <Sidebar companySlug={company} />

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
