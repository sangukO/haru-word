import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="text-7xl mb-6">❌</div>

      <h1 className="text-2xl font-bold mb-3">로그인을 완료하지 못했어요</h1>
      <p className="text-gray-400 mb-8 leading-relaxed">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        <br className="hidden md:block" />
        같은 문제가 반복되면 고객센터로 문의해 주세요.
      </p>

      <div className="flex flex-col gap-4">
        <Link
          href="/login"
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition shadow-lg hover:shadow-xl inline-block"
        >
          로그인 페이지로 이동
        </Link>
        <Link
          href="/"
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition shadow-lg hover:shadow-xl inline-block"
        >
          홈 화면으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
