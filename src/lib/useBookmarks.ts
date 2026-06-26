"use client";

import { useCallback, useEffect, useState } from "react";
import { bookmarkApi } from "./api";
import { useAuth } from "@/context/AuthContext";

export function useBookmarkSet() {
  const { isAuthed } = useAuth();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isAuthed) {
      setIds(new Set());
      setLoaded(true);
      return;
    }
    bookmarkApi
      .list()
      .then((jobs) => {
        if (!active) return;
        setIds(new Set(jobs.map((j) => j.id)));
      })
      .catch(() => {})
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, [isAuthed]);

  const onChange = useCallback((jobId: string, bookmarked: boolean) => {
    setIds((prev) => {
      const next = new Set(prev);
      if (bookmarked) next.add(jobId);
      else next.delete(jobId);
      return next;
    });
  }, []);

  return { ids, loaded, onChange };
}
