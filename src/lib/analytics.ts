import fs from "fs";
import path from "path";

// STUB analytics: counts persisted to a JSON file, same pattern as the other
// data/*.json stores. Good enough for a single-server deployment; swap for a
// real analytics table (or a service like Plausible/GA) once traffic grows.

export interface AnalyticsData {
  totalVisits: number;
  dailyVisits: Record<string, number>;
  productViews: Record<string, number>;
}

const ANALYTICS_PATH = path.join(process.cwd(), "data", "analytics.json");

function read(): AnalyticsData {
  try {
    return JSON.parse(fs.readFileSync(ANALYTICS_PATH, "utf-8"));
  } catch {
    return { totalVisits: 0, dailyVisits: {}, productViews: {} };
  }
}

function write(data: AnalyticsData): void {
  fs.writeFileSync(ANALYTICS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export function recordVisit(): void {
  const data = read();
  data.totalVisits += 1;
  const today = new Date().toISOString().slice(0, 10);
  data.dailyVisits[today] = (data.dailyVisits[today] ?? 0) + 1;
  write(data);
}

export function recordProductView(productId: string): void {
  const data = read();
  data.productViews[productId] = (data.productViews[productId] ?? 0) + 1;
  write(data);
}

export function getAnalytics(): AnalyticsData {
  return read();
}

export function getVisitsLast7Days(): { date: string; count: number }[] {
  const data = read();
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, count: data.dailyVisits[key] ?? 0 });
  }
  return days;
}
