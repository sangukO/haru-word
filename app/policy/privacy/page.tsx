import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="flex flex-1 flex-col max-w-3xl mx-auto justify-center px-6 py-20 break-keep">
      <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
        <p>
          '하루단어'(이하 "서비스")는 이용자의 개인정보를 중요시하며, "개인정보
          보호법" 등 관련 법령을 준수하고 있습니다.
        </p>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            1. 수집하는 개인정보 항목
          </h2>
          <p className="mb-2">
            본 서비스는 회원가입 및 기능 제공을 위해 아래와 같은 개인정보를
            수집하고 있습니다.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>수집항목:</strong> 이메일 주소, 이름, 프로필 사진
            </li>
            <li>
              <strong>수집방법:</strong> 소셜 로그인(Google) 연동을 통한 자동
              수집
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            2. 개인정보의 수집 및 이용목적
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스 이용에 따른 본인 확인 및 식별</li>
            <li>개인화된 단어장 서비스 제공</li>
            <li>서비스 관련 공지사항 전달</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            3. 개인정보의 보유 및 이용기간
          </h2>
          <p>
            이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용목적이
            달성되면 지체 없이 파기합니다. 단, 이용자가 회원 탈퇴를 요청하거나
            정보 제공 동의를 철회할 경우 해당 정보를 즉시 파기합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            4. 개인정보의 제3자 제공
          </h2>
          <p>
            서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            다만, 법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와
            방법에 따라 수사기관의 요구가 있는 경우는 예외로 합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            5. 문의처
          </h2>
          <p>
            서비스 이용 및 개인정보 보호와 관련된 문의사항은 아래 개발자
            연락처로 문의해 주시기 바랍니다.
          </p>
          <p className="mt-2 text-gray-500">이메일: help@haruword.com</p>
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
