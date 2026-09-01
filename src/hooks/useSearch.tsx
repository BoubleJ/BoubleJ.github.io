import { type ChangeEvent, type FormEvent, useEffect, useRef, useState } from "react";
import type { PostSummary } from "@/lib/posts";

export type SearchScope = "" | "title" | "content";

export interface IndexedPost extends PostSummary {
  body: string;
}

interface UseSearchProps {
  isSearchOpen: boolean;
  onSearchClose: () => void;
  initialQuery?: { term: string; scope: string } | null;
}

const DEBOUNCE_MS = 150;
const MAX_RESULTS = 8;

// v2-6: scope("" 전체 | "title" 제목·요약 | "content" 본문)에 따라 매칭 대상을 좁힌다.
export const matchesPost = (p: IndexedPost, term: string, scope: string): boolean => {
  const t = term.trim().toLowerCase();
  if (!t) return false;
  const inTitle =
    p.title.toLowerCase().includes(t) || p.summary.toLowerCase().includes(t);
  const inBody = p.body.toLowerCase().includes(t);
  if (scope === "title") return inTitle;
  if (scope === "content") return inBody;
  return inTitle || inBody; // 전체
};

export default function useSearch({
  isSearchOpen,
  onSearchClose,
  initialQuery,
}: UseSearchProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [scope, setScope] = useState<SearchScope>("");
  const [matches, setMatches] = useState<IndexedPost[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 검색창 첫 포커스 시 1회 fetch 후 메모리 캐시(같은 fetch가 동시에 여러 번 나가지 않도록 Promise 자체를 캐시)
  const indexPromiseRef = useRef<Promise<IndexedPost[]> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 사용자가 직접 입력·범위 변경을 했을 때만 결과 드롭다운을 연다.
  // /?search= 프리필로 term이 채워지는 경우엔 열지 않아야 검색 결과 목록을 가리지 않는다.
  const isUserEditingRef = useRef(false);

  // 프리필은 더 이상 아코디언을 열지 않으므로 열림은 항상 사용자가 아이콘을 누른 결과입니다.
  useEffect(() => {
    if (!isSearchOpen) {
      setIsDropdownOpen(false);
      return;
    }
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

  // /?search= 프리필 (Header 마운트 시 전달됨): 닫힌 상태에서도 값을 채워두어
  // 사용자가 검색창을 열면 직전 검색어가 그대로 남아 있게 한다.
  useEffect(() => {
    if (!initialQuery) return;
    setTerm(initialQuery.term);
    setScope(
      initialQuery.scope === "title" || initialQuery.scope === "content"
        ? initialQuery.scope
        : "",
    );
    if (searchInputRef.current) {
      searchInputRef.current.value = initialQuery.term;
    }
  }, [initialQuery]);

  const loadIndex = () => {
    if (!indexPromiseRef.current) {
      indexPromiseRef.current = fetch("/search-index.json").then(
        (res) => res.json() as Promise<IndexedPost[]>,
      );
    }
    return indexPromiseRef.current;
  };

  const handleSearchFocus = () => {
    loadIndex();
  };

  const runSearch = async (value: string, currentScope: SearchScope) => {
    const t = value.trim();
    if (!t) {
      setMatches([]);
      setIsDropdownOpen(false);
      return;
    }
    const index = await loadIndex();
    const results = index
      .filter((p) => matchesPost(p, t, currentScope))
      .slice(0, MAX_RESULTS);
    setMatches(results);
    setIsDropdownOpen(true);
  };

  // 입력 디바운스 150ms → matchesPost로 상위 8개를 드롭다운에 반환
  // biome-ignore lint/correctness/useExhaustiveDependencies: runSearch는 term/scope에서 파생되어 재생성돼도 동작에 영향 없음
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!isUserEditingRef.current) return;
    debounceRef.current = setTimeout(() => {
      runSearch(term, scope);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [term, scope]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    isUserEditingRef.current = true;
    setTerm(e.target.value);
  };

  const handleScopeChange = (value: string) => {
    isUserEditingRef.current = true;
    setScope(value as SearchScope);
  };

  const closeDropdown = () => setIsDropdownOpen(false);

  // input 안의 x 버튼 — 입력값만 비우고 포커스를 돌려준다. 목록은 그대로 두고
  // 사용자가 새 검색어를 치거나 빈 채로 제출하면 그때 이동한다.
  const clearTerm = () => {
    isUserEditingRef.current = true;
    setTerm("");
    setMatches([]);
    setIsDropdownOpen(false);
    searchInputRef.current?.focus();
  };

  const submitSearch = (value: string, currentScope: SearchScope) => {
    const trimmed = value.trim();
    if (trimmed) {
      const suffix = currentScope ? `&scope=${currentScope}` : "";
      window.location.assign(`/?search=${encodeURIComponent(trimmed)}${suffix}`);
    } else {
      window.location.assign("/");
    }
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 이동 전에 예약된 디바운스 검색을 취소하고 드롭다운을 닫는다
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isUserEditingRef.current = false;
    setIsDropdownOpen(false);
    searchInputRef.current?.blur();
    submitSearch(searchInputRef.current?.value ?? term, scope);
    onSearchClose();
  };

  // 드롭다운 항목 클릭으로 특정 포스트로 바로 이동
  const handleResultSelect = (slug: string) => {
    onSearchClose();
    window.location.assign(slug);
  };

  return {
    handleSearchSubmit,
    searchInputRef,
    term,
    scope,
    matches,
    isDropdownOpen,
    handleSearchChange,
    handleScopeChange,
    handleSearchFocus,
    closeDropdown,
    clearTerm,
    handleResultSelect,
  };
}
