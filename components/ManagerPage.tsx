import Link from "next/link";

interface ManagerPageProps {
  companySlug?: string | null;
}

export default function ManagerPage({ companySlug }: ManagerPageProps) {
  return (
    <div className="p-8 md:p-12 min-h-screen bg-gray-950 text-gray-100 space-y-8 w-full">
      <div className="border-b border-gray-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {companySlug ? (
              <span>
                Managing branch:{" "}
                <strong className="text-blue-400 font-semibold">{companySlug}</strong>
              </span>
            ) : (
              "No company context assigned."
            )}
          </p>
        </div>

        {companySlug && (
          <Link
            href={`/dashboard/${companySlug}/add-staff?role=EMPLOYEE`}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition shadow-lg active:scale-95"
          >
            + Add Employee
          </Link>
        )}
      </div>
    </div>
  );
}
