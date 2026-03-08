import type { ReactNode } from "react";

type PanelCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  right?: ReactNode;
};

export function PanelCard(props: PanelCardProps) {
  const { title, description, children, right } = props;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {description ? (
            <p className="mt-1 text-gray-500 text-sm">{description}</p>
          ) : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
