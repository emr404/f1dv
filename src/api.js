import { useEffect, useState } from "react";

const API_URL = "https://api.jolpi.ca/ergast/f1";
const requests = new Map();

async function fetchPage(path) {
  const response = await fetch(`${API_URL}/${path}`);
  if (!response.ok)
    throw new Error(`Unable to load F1 data (${response.status}).`);
  const data = await response.json();
  return data.MRData;
}

async function fetchData(path) {
  const data = await fetchPage(path);
  // Jolpica caps each response at 100 records, including the driver directory.
  if (path.startsWith("drivers.json")) {
    const drivers = [...data.DriverTable.Drivers];
    const pageSize = Number(data.limit);
    if (pageSize > 0) {
      for (
        let offset = pageSize;
        offset < Number(data.total);
        offset += pageSize
      ) {
        const page = await fetchPage(
          `drivers.json?limit=${pageSize}&offset=${offset}`,
        );
        drivers.push(...page.DriverTable.Drivers);
      }
    }
    return { ...data, DriverTable: { ...data.DriverTable, Drivers: drivers } };
  }
  return data;
}

// Share requests across pages and StrictMode's effect replay.
export function useF1Data(path, { keepPreviousData = false } = {}) {
  const [result, setResult] = useState({ path, data: null, error: null });
  useEffect(() => {
    if (!path) return;
    let active = true;
    const cached = requests.get(path);
    if (!cached || Date.now() - cached.createdAt > 60_000) {
      requests.set(path, {
        createdAt: Date.now(),
        promise: fetchData(path).catch((error) => {
          requests.delete(path);
          throw error;
        }),
      });
    }
    requests.get(path).promise.then(
      (data) => {
        if (active) setResult({ path, data, error: null });
      },
      (error) => {
        if (active) setResult({ path, data: null, error: error.message });
      },
    );
    return () => {
      active = false;
    };
  }, [path]);
  const isCurrent = result.path === path;
  return {
    data: isCurrent || keepPreviousData ? result.data : null,
    error: isCurrent ? result.error : null,
    isFetching:
      Boolean(path) && (!isCurrent || (!result.data && !result.error)),
  };
}

export function useSeasons() {
  const { data, error } = useF1Data("seasons.json?limit=100&offset=0");
  return {
    seasons: [
      ...new Set([
        String(new Date().getFullYear()),
        ...(data?.SeasonTable.Seasons.map(({ season }) => season) ?? []),
      ]),
    ].sort((a, b) => Number(b) - Number(a)),
    error,
  };
}
