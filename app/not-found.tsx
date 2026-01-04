import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="space-y-6">
        <div className="text-7xl mb-6">😵‍💫</div>

        <h1 className="text-3xl font-bold text-[#111111] dark:text-[#F1F1F1]">
          길을 잃으셨나요?
        </h1>

        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            찾으시는 페이지가 삭제되었거나
            <br />
            주소가 잘못 입력된 것 같아요.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            (혹은 아직 세상에 나오지 않은 단어일지도 몰라요!)
          </p>
        </div>

        {/* 홈으로 이동 */}
        <div className="pt-8">
          <Link
            href="/"
            className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:opacity-80 transition-all shadow-lg hover:shadow-xl inline-block"
          >
            오늘의 단어 보러 가기
          </Link>
        </div>
      </div>
    </main>
  );
}
