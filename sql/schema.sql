-- ==========================================
-- 1. 테이블 구조 (Schema Structure)
-- ==========================================

-- 1-1. Categories (카테고리 정보)
CREATE TABLE IF NOT EXISTS public.categories (
  id text NOT NULL,
  sort_order integer NOT NULL,
  name text NOT NULL,
  description text,
  color text NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 1-2. Site Stats (방문자 수 통계)
CREATE TABLE IF NOT EXISTS public.site_stats (
  id integer NOT NULL,
  total_views bigint DEFAULT 0,
  CONSTRAINT site_stats_pkey PRIMARY KEY (id)
);

-- 1-3. Words (단어장 메인)
CREATE TABLE IF NOT EXISTS public.words (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  date date NOT NULL,
  word text NOT NULL,
  meaning text NOT NULL,
  hanja text,
  example text NOT NULL,
  detail text,
  refined_word text,
  category text,
  CONSTRAINT words_pkey PRIMARY KEY (id),
  CONSTRAINT words_category_fkey FOREIGN KEY (category) REFERENCES public.categories(id)
);

-- 1-4. User Roles (RBAC: 권한 관리)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL UNIQUE,
  role text DEFAULT 'user'::text CHECK (role = ANY (ARRAY['admin'::text, 'user'::text])),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- 1-5. Bookmarks (북마크)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  word_id bigint NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT bookmarks_pkey PRIMARY KEY (id),
  CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT bookmarks_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(id)
);

-- 1-6. Ai Logs (AI 서비스 로그)
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL,
  feature_name text DEFAULT 'sentence-generation',
  target_word_ids bigint[],
  generated_sentence text,
  error_message text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT ai_usage_logs_pkey PRIMARY KEY (id),
  CONSTRAINT ai_usage_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- ==========================================
-- 2. RLS(Row Level Security) 활성화
-- ==========================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.words ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 3. 보안 정책 (RLS Policies)
-- ==========================================

-- [Categories]
CREATE POLICY "누구나 카테고리 보기 가능" ON public.categories FOR SELECT TO public USING (true);
-- (백오피스용 추가 정책)
CREATE POLICY "관리자만 카테고리 관리" ON public.categories FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- [Site Stats]
CREATE POLICY "통계 누구나 조회" ON public.site_stats FOR SELECT TO public USING (true);

-- [Words]
CREATE POLICY "누구나 단어 보기 가능" ON public.words FOR SELECT TO public USING (true);

CREATE POLICY "관리자만 단어 추가 가능" ON public.words FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "관리자만 단어 수정 가능" ON public.words FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "관리자만 단어 삭제 가능" ON public.words FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- [User Roles]
CREATE POLICY "자기 자신의 역할은 읽을 수 있음" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- [Bookmarks]
CREATE POLICY "내 북마크만 보기" ON public.bookmarks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "내 북마크 추가" ON public.bookmarks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "내 북마크 삭제" ON public.bookmarks FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- [Ai Logs]
CREATE POLICY "로그인한 유저만 생성 가능" ON public.ai_usage_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "자기 기록만 조회 가능" ON public.ai_usage_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);