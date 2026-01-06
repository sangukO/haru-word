"use client";

import { toast } from "sonner";
import { withdraw } from "./actions";
import { useRouter } from "next/navigation";
import ConfirmToast from "@/components/ui/ConfirmToast"; // 경로 확인 필요

export default function WithdrawButton() {
  const router = useRouter();

  const handleWithdrawClick = () => {
    toast.custom(
      (t) => (
        <ConfirmToast
          t={t}
          title="정말 탈퇴하시겠습니까? 😢"
          description={
            <>
              저장된 모든 단어장이 <strong>즉시 삭제</strong>되며, 이 작업은
              되돌릴 수 없습니다.
            </>
          }
          confirmLabel="탈퇴하기"
          onConfirm={async () => {
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
            }
          }}
        />
      ),
      { duration: Infinity, position: "top-center" }
    );
  };

  return (
    <button
      onClick={handleWithdrawClick}
      className="group flex items-center justify-between w-full p-3 rounded-lg bg-gray-50 dark:bg-[#252525] hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30 cursor-pointer"
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
