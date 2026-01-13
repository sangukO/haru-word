"use client";

import { toast } from "sonner";
import { withdraw } from "./actions";
import { useRouter } from "next/navigation";
import ConfirmToast from "@/components/ui/ConfirmToast"; // 경로 확인 필요
import { Trash } from "lucide-react";

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
        <Trash size={16} className="text-gray-500 group-hover:text-red-500" />

        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400">
          회원 탈퇴
        </span>
      </div>

      <span className="text-xs text-gray-400 group-hover:text-red-400">
        계정 삭제
      </span>
    </button>
  );
}
