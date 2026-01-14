"use client";

import Script from "next/script";

export default function KakaoScript() {
  return (
    <Script
      src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
      // 지연 로딩 사용
      strategy="lazyOnload"
      onLoad={() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
          const key = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
          if (key) window.Kakao.init(key);
        }
      }}
    />
  );
}
