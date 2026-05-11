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
        <h2 className="text-xl font-semibold text-slate-900">
          {title}
        </h2>
      ) : null}

      {description ? (
        <p
          className={
            title
              ? "mt-1 text-sm leading-6 text-slate-600"
              : "text-sm leading-6 text-slate-600"
          }
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
