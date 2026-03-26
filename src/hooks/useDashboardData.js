import { useState, useEffect, useCallback, useRef } from "react";
import { API_BASE } from "../constants/theme";

export function useDashboardData(loggedIn, mode) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastFetch, setLastFetch] = useState(null);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async (m) => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard?mode=${m}`);
      if (!res.ok) throw new Error("Bad response");
      const json = await res.json();
      setData(json);
      setConnected(true);
      setLastFetch(new Date());
    } catch {
      setConnected(false);
      setData(null);
    }
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    fetchData(mode);
    intervalRef.current = setInterval(() => fetchData(mode), 5000);
    return () => clearInterval(intervalRef.current);
  }, [loggedIn, mode, fetchData]);

  const resetData = useCallback(() => {
    setData(null);
    setConnected(false);
    setLastFetch(null);
  }, []);

  return { data, connected, lastFetch, fetchData, resetData };
}
