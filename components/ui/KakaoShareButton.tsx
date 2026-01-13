"use client";

import { useEffect } from "react";
import Script from "next/script";
import Image from "next/image";

declare global {
  interface Window {
    Kakao: any;
  }
}

interface KakaoShareButtonProps {
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export default function KakaoShareButton({
  title,
  description,
  imageUrl = "",
  link,
}: KakaoShareButtonProps) {
  // 환경변수 로드 확인
  const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;

  const handleShare = () => {
    // window가 없으면 중단
    if (typeof window === "undefined") return;

    // 카카오 객체가 아예 없으면
    if (!window.Kakao) {
      alert("카카오톡 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    // 로드는 됐는데 초기화가 안 된 경우
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_API_KEY);
    }

    const currentUrl = link
      ? `${window.location.origin}${link}`
      : window.location.href;

    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: title,
        description: description,
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
      buttons: [
        {
          title: "자세히 보기",
          link: {
            mobileWebUrl: currentUrl,
            webUrl: currentUrl,
          },
        },
      ],
    });
  };

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init(KAKAO_API_KEY);
          }
        }}
      />

      <button
        onClick={handleShare}
        className="relative w-7 h-7 cursor-pointer group outline-none shrink-0"
        aria-label="카카오톡으로 공유하기"
        title="카카오톡으로 공유하기"
      >
        <Image
          src="/images/kakaotalk_sharing_btn_small.png"
          alt="카카오톡 공유"
          width={28}
          height={28}
          priority // 페이지 로드 시 즉시 다운로드 (깜빡임 방지)
          className="w-7! h-7! object-cover"
        />

        {/* 2. 호버 이미지 (위에 덮어씀) */}
        <Image
          src="/images/kakaotalk_sharing_btn_small_ov.png"
          alt="카카오톡 공유 호버"
          width={28}
          height={28}
          priority // 페이지 로드 시 즉시 다운로드 (깜빡임 방지)
          className="absolute top-0 left-0 w-7! h-7! object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </button>
    </>
  );
}
