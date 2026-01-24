import { FormEvent, useEffect, useRef } from "react";
import { navigate } from "gatsby";

interface UseSearchProps {
    isSearchOpen: boolean;
    onSearchClose: () => void;
}

export default function useSearch({isSearchOpen, onSearchClose}: UseSearchProps) {

    const searchInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, [isSearchOpen]);

    const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedSearchTerm = searchInputRef.current?.value.trim() || "";
        
        if (trimmedSearchTerm) {
          navigate(`/post?search=${encodeURIComponent(trimmedSearchTerm)}`);
        } else {
          navigate(`/post`);
        }
        onSearchClose();
        if (searchInputRef.current) {
          searchInputRef.current.value = "";
        }
      };


  return {
    handleSearchSubmit,
    searchInputRef
  }
}
