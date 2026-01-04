import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-4 text-center text-xs text-gray-400 dark:text-gray-500">
      {/* 약관 및 정책 링크 */}
      <div className="flex justify-center items-center gap-3 mb-2">
        <Link
          href="/policy/service"
          className="hover:text-gray-600 dark:hover:text-gray-300 hover:underline underline-offset-4 transition-colors"
        >
          이용약관
        </Link>
        {/* 구분선 */}
        <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
        <Link
          href="/policy/privacy"
          className="font-bold hover:text-gray-600 dark:hover:text-gray-300 hover:underline underline-offset-4 transition-colors"
        >
          개인정보처리방침
        </Link>
      </div>

      {/* 저작권 표시 */}
      <p className="mb-2">© 하루단어. All rights reserved.</p>
    </footer>
  );
}
