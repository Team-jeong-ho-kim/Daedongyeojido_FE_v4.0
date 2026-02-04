import Link from "next/link";

const actionItems = [
  {
    id: 1,
    title: "동아리 알아보기",
    description:
      "현재 대덕소프트웨어마이스터고등학교에 있는 모든 동아리를 한눈에 조회하고 각 동아리의 특징을 알아보세요!",
    buttonText: "동아리 알아보기",
    href: "/clubs",
  },
  {
    id: 2,
    title: "동아리 가입하기",
    description:
      "동아리에 가입하고 싶으신가요? 이제 대동여지도 안에서 쉽고 신속하게 버튼을 눌러 동아리 공고를 확인해보세요!",
    buttonText: "동아리 가입하기",
    href: "/clubs",
  },
  {
    id: 3,
    title: "대동여지도란?",
    description:
      "대동여지도는 동아리에 대해 궁금하신가요? 이제 버튼을 눌러 소개 페이지로 안내에 이동하세요!",
    buttonText: "소개 페이지 바로가기",
    href: "/about",
  },
  {
    id: 4,
    title: "동아리 만들기",
    description:
      "동아리를 새롭게 만들고 싶으신가요? 인증을 받고 글을 작성하여, 동아리를 직접 만들고, 관리하고, 새로운 인재를 찾아보세요!",
    buttonText: "바로가기",
    href: "/clubs/create",
  },
];

export default function ActionSection() {
  return (
    <section className="w-full bg-black py-15">
      <div className="mx-auto max-w-7xl px-8 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {actionItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between space-y-6"
            >
              <div className="space-y-2">
                <h3 className="font-bold text-2xl text-white">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
              <Link
                href={item.href}
                className="inline-block w-fit rounded-[12px] bg-primary-500 px-6 py-2 font-medium text-lg text-white transition-colors hover:bg-primary-600"
              >
                {item.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
