import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-6xl text-gray-900 md:text-8xl">
          404
        </h1>
        <h2 className="mb-4 font-bold text-2xl text-gray-700 md:text-3xl">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="mb-8 text-gray-600 text-lg">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="inline-block rounded-lg bg-primary-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
