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
  return (
    <button
      type="button"
      onClick={() => onClick?.(application)}
      className="w-full cursor-pointer rounded-3xl bg-white px-5 py-4 text-left shadow-sm transition-shadow duration-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="mb-6">
        <h2 className="font-semibold text-gray-900 text-lg">
          {application.title}
        </h2>
      </div>

      <div className="mb-6">
        <p className="text-gray-600 text-sm">마감일 : {application.deadline}</p>
      </div>

      <span className="inline-block rounded-lg bg-primary-500 px-5 py-2 font-medium text-white">
        조회
      </span>
    </button>
  );
}

export type { Application };
