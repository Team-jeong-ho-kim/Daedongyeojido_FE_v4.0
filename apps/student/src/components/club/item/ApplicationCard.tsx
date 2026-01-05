import Image from "next/image";

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
    <div className="rounded-3xl bg-white px-5 py-4 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header with arrow */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 text-lg">
          {application.title}
        </h2>
        <Image
          src="/images/clubs/rightArrow.svg"
          alt="화살표"
          width={12}
          height={12}
          className="text-gray-400"
        />
      </div>

      {/* Deadline */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm">마감일 : {application.deadline}</p>
      </div>

      {/* View button */}
      <button
        type="button"
        onClick={() => onClick?.(application)}
        className="rounded-lg bg-primary-500 px-5 py-2 font-medium text-white transition-colors duration-200 hover:bg-primary-600"
      >
        조회
      </button>
    </div>
  );
}

export type { Application };
