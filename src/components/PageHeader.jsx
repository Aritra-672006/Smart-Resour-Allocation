export default function PageHeader({ icon, title, subtitle, children }) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="w-12 h-12 rounded-2xl bg-forest-500/15 border border-forest-500/25 flex items-center justify-center text-2xl">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-100">{title}</h1>
            {subtitle && <p className="text-slate-400 mt-1">{subtitle}</p>}
          </div>
        </div>
        {children && <div className="flex items-center gap-3">{children}</div>}
      </div>
    </div>
  )
}
