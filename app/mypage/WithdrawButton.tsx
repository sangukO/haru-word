"use client";

import { toast } from "sonner";
import { withdraw } from "./actions";
import { useRouter } from "next/navigation";

export default function WithdrawButton() {
  const router = useRouter();

  const handleWithdrawClick = () => {
    toast.custom(
      (t) => (
        <div className="w-full flex flex-col gap-4 p-4 md:min-w-[400px]">
          {/* 제목 & 설명 */}
          <div>
            <h3 className="font-bold text-base mb-1">
              정말 탈퇴하시겠습니까? 😢
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              저장된 모든 단어장이 <strong>즉시 삭제</strong>되며, 이 작업은
              되돌릴 수 없습니다.
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => toast.dismiss(t)}
              className="px-3 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              취소
            </button>

            <button
              onClick={async () => {
                toast.dismiss(t);
                const loadingToast = toast.loading("탈퇴 처리 중입니다...");
                try {
                  await withdraw();

                  toast.dismiss(loadingToast);
                  toast("탈퇴되었습니다.", {
                    description: "이용해 주셔서 감사합니다.",
                  });

                  router.replace("/");
                  router.refresh();
                } catch (error) {
                  toast.dismiss(loadingToast);
                  toast.error("탈퇴 처리에 실패했습니다.");
                  console.error(error);
                }
              }}
              className="px-3 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
            >
              탈퇴하기
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  return (
    <button
      onClick={handleWithdrawClick}
      className="group flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 dark:bg-[#252525] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30  cursor-pointer"
    >
      <div className="flex items-center gap-2">
        {/* 휴지통 아이콘 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-500 group-hover:text-red-500 transition-colors"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>

        {/* 텍스트 */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          회원 탈퇴
        </span>
      </div>

      {/* 우측 설명 */}
      <span className="text-xs text-gray-400 group-hover:text-red-400 transition-colors">
        계정 삭제
      </span>
    </button>
  );
}
