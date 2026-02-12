interface Application {
  id: number;
  title: string;
  deadline: string;
}

interface ApplicationCardProps {
  application: Application;
  onClick?: (application: Application) => void;
}

export default function ApplicationCard({
  application,
  onClick,
}: ApplicationCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.(application);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: button 안에 button이 있어 div 사용
    <div
      onClick={() => onClick?.(application)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(application);
        }
      }}
      role="button"
      tabIndex={0}
      className="w-full cursor-pointer rounded-3xl bg-white px-5 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">
          {application.title}
        </h2>
      </div>

      {/* Deadline */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">마감일 : {application.deadline}</p>
      </div>

      {/* View button */}
      <button
        type="button"
        onClick={handleClick}
        className="rounded-lg bg-primary-500 px-5 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-600"
      >
        조회
      </button>
    </div>
  );
}

export type { Application };
