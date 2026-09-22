export default function Spinner({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[50vh] w-full space-y-5">
      <div className="w-16 h-16 border-[6px] border-gray-800 border-t-blue-500 rounded-full animate-spin" />
      {label && <p className="text-sm font-semibold tracking-wide text-gray-400">{label}</p>}
    </div>
  );
}
