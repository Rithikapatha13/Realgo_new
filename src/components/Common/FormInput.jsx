export default function FormInput({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-slate-600">
          {label}
        </label>
      )}

      <input
        {...props}
        className="
          w-full px-3 py-2 rounded-lg
          border border-slate-300
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20
        "
      />
    </div>
  );
}
