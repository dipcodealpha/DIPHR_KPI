interface PageTitleProps {
  title?: string;
  description?: string;
}

export function PageTitle({ title, description }: PageTitleProps) {
  if (!title && !description) {
    return null;
  }

  return (
    <div className="mb-1 min-w-0">
      {title ? (
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
      ) : null}

      {description ? (
        <p className={title ? "mt-1 text-sm text-slate-500" : "text-sm text-slate-500"}>
          {description}
        </p>
      ) : null}
    </div>
  );
}