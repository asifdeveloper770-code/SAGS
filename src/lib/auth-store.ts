// Mock frontend-only auth. NOT SECURE. For demo/preview only.
import { useEffect, useState } from "react";

export type Role = "student" | "corporate" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  enrolledCourseIds: string[];
  progress: Record<string, { completedLessons: string[]; passedQuizzes: string[]; certId?: string }>;
}

const STORAGE_KEY = "sags:user";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("sags:user"));
}

export function useUser() {
  const [user, setUserState] = useState<User | null>(null);
  useEffect(() => {
    setUserState(getUser());
    const onChange = () => setUserState(getUser());
    window.addEventListener("sags:user", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sags:user", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return user;
}

export function mockSignIn(email: string, role: Role = "student"): User {
  const existing = getUser();
  if (existing && existing.email === email) return existing;
  const user: User = {
    id: `u-${Date.now()}`,
    email,
    fullName: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    role,
    enrolledCourseIds: [],
    progress: {},
  };
  setUser(user);
  return user;
}

export function enrollCourse(courseId: string) {
  const u = getUser();
  if (!u) return;
  if (!u.enrolledCourseIds.includes(courseId)) u.enrolledCourseIds.push(courseId);
  if (!u.progress[courseId]) u.progress[courseId] = { completedLessons: [], passedQuizzes: [] };
  setUser(u);
}

export function markLessonComplete(courseId: string, lessonKey: string) {
  const u = getUser();
  if (!u) return;
  const p = u.progress[courseId] ?? { completedLessons: [], passedQuizzes: [] };
  if (!p.completedLessons.includes(lessonKey)) p.completedLessons.push(lessonKey);
  u.progress[courseId] = p;
  setUser(u);
}

export function markQuizPassed(courseId: string, moduleId: string) {
  const u = getUser();
  if (!u) return;
  const p = u.progress[courseId] ?? { completedLessons: [], passedQuizzes: [] };
  if (!p.passedQuizzes.includes(moduleId)) p.passedQuizzes.push(moduleId);
  u.progress[courseId] = p;
  setUser(u);
}

export function issueCertificate(courseId: string, certId: string) {
  const u = getUser();
  if (!u) return;
  const p = u.progress[courseId] ?? { completedLessons: [], passedQuizzes: [] };
  p.certId = certId;
  u.progress[courseId] = p;
  setUser(u);
}

export function nextCertNumber(stateCode: string): string {
  const key = "sags:certcount";
  const n = Number(window.localStorage.getItem(key) ?? "500") + 1;
  window.localStorage.setItem(key, String(n));
  return `SAGS-${stateCode}-${String(n).padStart(6, "0")}`;
}
