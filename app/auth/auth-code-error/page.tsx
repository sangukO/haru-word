import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-7xl mb-6">❌</div>

      <h1 className="text-2xl font-bold mb-4">로그인에 실패했어요</h1>
      <p className="text-gray-400 mb-8 leading-relaxed">
        구글 로그인 과정에서 일시적인 문제가 발생했습니다.
        <br />
        처음부터 다시 시도해 주시겠어요?
      </p>

      <Link
        href="/"
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
