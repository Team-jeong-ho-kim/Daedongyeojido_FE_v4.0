import Image from "next/image";

type AdminProfileHeaderProps = {
  userName?: string;
  role?: string;
};

export function AdminProfileHeader(props: AdminProfileHeaderProps) {
  const { userName, role } = props;

  return (
    <>
      <div className="mb-10 flex items-center gap-8">
        <Image
          src="/admin-profile-default.svg"
          alt="프로필 이미지"
          className="h-20 w-20 rounded-full object-cover"
          width={80}
          height={80}
        />
        <div>
          <h2 className="font-semibold text-3xl tracking-tight">{userName}</h2>
          <p className="mt-2 font-medium text-gray-400 text-xl">
            {role || "ADMIN"}
          </p>
        </div>
      </div>
      <div className="mb-10 h-px w-full bg-gray-200" />
    </>
  );
}
