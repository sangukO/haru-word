import Link from "next/link";

export default function ServicePage() {
  return (
    <main className="flex flex-1 flex-col max-w-3xl mx-auto justify-center px-6 py-20 break-keep">
      <h1 className="text-3xl font-bold mb-8">하루단어 이용약관</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            제1조 (목적)
          </h2>
          <p>
            본 약관은 '하루단어'(이하 "서비스"라 함)가 제공하는 단어 학습
            서비스의 이용조건 및 절차, 이용자와 운영자의 권리, 의무, 책임사항을
            규정함을 목적으로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            제2조 (용어의 정의)
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              "서비스"란 '하루단어'가 제공하는 단어 학습 및 관련 제반 기능을
              의미합니다.
            </li>
            <li>
              "이용자"란 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 회원
              및 비회원을 말합니다.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            제3조 (약관의 효력 및 변경)
          </h2>
          <p>
            운영자는 필요하다고 인정되는 경우 관련 법령을 위배하지 않는 범위
            내에서 본 약관을 개정할 수 있습니다. 약관이 변경될 경우, 서비스 내
            공지사항을 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            제4조 (서비스의 제공)
          </h2>
          <p>서비스는 다음과 같은 기능을 제공합니다.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>매일 새로운 단어 콘텐츠 제공</li>
            <li>단어 검색 및 조회 기능</li>
            <li>기타 운영자가 추가 개발하여 제공하는 일체의 기능</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            제5조 (면책 조항)
          </h2>
          <p>
            본 서비스는 개인 포트폴리오 및 학습 목적으로 운영되며, 제공되는
            정보의 정확성이나 신뢰도에 대해 보증하지 않습니다. 서비스 이용으로
            인해 발생한 손해에 대해서는 운영자가 책임을 지지 않습니다.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-[#333]">
        <Link
          href="/"
          className="text-sm text-gray-500 hover:text-black dark:hover:text-white underline underline-offset-4"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
