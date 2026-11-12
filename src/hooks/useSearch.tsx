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

export const matchesPost = (p: IndexedPost, term: string, scope: string): boolean => {
  const t = term.trim().toLowerCase();
  if (!t) return false;
  const inTitle =
    p.title.toLowerCase().includes(t) || p.summary.toLowerCase().includes(t);
  const inBody = p.body.toLowerCase().includes(t);
  if (scope === "title") return inTitle;
  if (scope === "content") return inBody;
  return inTitle || inBody;
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

  const indexPromiseRef = useRef<Promise<IndexedPost[]> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserEditingRef = useRef(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setIsDropdownOpen(false);
      return;
    }
    searchInputRef.current?.focus();
  }, [isSearchOpen]);

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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    isUserEditingRef.current = false;
    setIsDropdownOpen(false);
    searchInputRef.current?.blur();
    submitSearch(searchInputRef.current?.value ?? term, scope);
    onSearchClose();
  };

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
