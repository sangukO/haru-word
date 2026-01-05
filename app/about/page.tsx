import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col max-w-3xl mx-auto justify-center px-6 py-20 break-keep">
      {/* 타이틀 */}
      <h1 className="text-3xl font-bold mb-8">하루단어 서비스 소개</h1>

      {/* 본문 영역 */}
      <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
        {/* 기획 의도 */}
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            하루단어를 만든 이유
          </h2>
          <p>
            숏폼 콘텐츠와 짧은 글에 익숙해진 요즘, 문득 적절한 단어가 떠오르지
            않아 답답함을 느끼신 적이 있나요?
          </p>
        </section>

        {/* 핵심 가치 */}
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            하나씩 쌓이는 성취감
          </h2>
          <p>
            '하루단어'는 학습의 부담을 덜어내기 위해 만들어졌습니다. 매일 자정,
            메인 화면에는 오직 하나의 새로운 단어만 갱신됩니다.
          </p>
        </section>

        {/* 제공 기능 */}
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            단어에만 집중하도록
          </h2>
          <p className="mb-2">
            복잡한 기능은 배제했습니다. 가독성을 최우선으로 고려한 디자인 속에서
            다음 내용들을 탐구해 보세요.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>단어의 정확한 뜻과 한자 표기</li>
            <li>실제 활용을 돕는 예문과 추가 지식</li>
            <li>국립국어원 선정 다듬은 말 소개</li>
          </ul>
        </section>

        {/* 타겟 대상 */}
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            지적 성장을 꿈꾸는 분들에게
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>업무 시작 전, 가볍게 지식을 충전하고 싶은 직장인</li>
            <li>어휘력 부족을 느끼지만 시간적 여유가 없는 사회초년생</li>
            <li>자기계발의 끈을 놓고 싶지 않은 모든 분</li>
          </ul>
        </section>

        {/* 개발자 이야기 */}
        <section>
          <h2 className="text-lg font-bold text-black dark:text-white mb-2">
            개발자 이야기
          </h2>
          <p>
            이 서비스는 개발자 개인의 포트폴리오이자, 실제로 제가 사용하고 싶어
            만든 프로젝트입니다. 피드백을 통해 조금씩 더 나은 서비스로 성장하고
            있습니다. 불편한 점이나 제안하고 싶은 기능이 있다면 언제든{" "}
            <a
              href="mailto:help@haruword.com"
              className="font-medium underline underline-offset-2 hover:text-black dark:hover:text-white transition-colors"
            >
              help@haruword.com
            </a>
            으로 문의해 주세요.
          </p>
        </section>
      </div>

      {/* 홈으로 이동 */}
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
