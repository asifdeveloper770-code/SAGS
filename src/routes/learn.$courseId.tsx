import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { courseById, type Course } from "@/lib/mock-data";
import {
  useUser,
  markLessonComplete,
  markQuizPassed,
  enrollCourse,
  issueCertificate,
  nextCertNumber,
} from "@/lib/auth-store";

export const Route = createFileRoute("/learn/$courseId")({
  loader: ({ params }): { course: Course } => {
    const course = courseById(params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `Learn: ${loaderData?.course.title ?? ""} — SAGS` }] }),
  notFoundComponent: () => <div className="p-24 text-center">Course not found.</div>,
  component: Learn,
});

const ID_VERIFY_QUESTIONS = [
  { q: "What is the last 4 digits of the SSN on file?", a: "1234" },
  { q: "What is your date of birth (MM/DD/YYYY)?", a: "01/01/1990" },
  { q: "What is your registered ZIP code?", a: "00000" },
];

function Learn() {
  const { course } = Route.useLoaderData() as { course: Course };
  const user = useUser();
  const navigate = useNavigate();

  const [moduleIdx, setModuleIdx] = useState(0);
  const [lessonIdx, setLessonIdx] = useState(0);
  const [mode, setMode] = useState<"lesson" | "quiz">("lesson");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState(0);
  const [idChallenge, setIdChallenge] = useState<{ q: string; a: string } | null>(null);
  const [idInput, setIdInput] = useState("");
  const [locked, setLocked] = useState(false);

  const mod = course.modules[moduleIdx];
  const lesson = mod.lessons[lessonIdx];
  const lessonKey = `${mod.id}-${lesson.id}`;
  const totalLessons = course.modules.reduce((n, m) => n + m.lessons.length, 0);
  const progress = user?.progress[course.id];
  const completed = progress?.completedLessons.length ?? 0;
  const pct = Math.round((completed / totalLessons) * 100);
  const canAdvance = timer >= 5; // demo: 5s minimum per lesson

  useEffect(() => {
    if (user && !user.enrolledCourseIds.includes(course.id)) enrollCourse(course.id);
  }, [user, course.id]);

  useEffect(() => {
    setTimer(0);
    const t = setInterval(() => setTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [moduleIdx, lessonIdx, mode]);

  // Random ID challenge on alcohol courses
  useEffect(() => {
    if (!course.requiresIdVerify) return;
    if (Math.random() < 0.15 && !idChallenge && !locked) {
      const pick = ID_VERIFY_QUESTIONS[Math.floor(Math.random() * ID_VERIFY_QUESTIONS.length)];
      setIdChallenge(pick);
    }
  }, [lessonIdx, moduleIdx]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <p>Please sign in to access the LMS.</p>
          <Link to="/auth" search={{ mode: "signin", next: `/learn/${course.id}` }} className="mt-4 inline-block bg-primary px-6 py-3 font-bold text-primary-foreground">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-md px-6 py-24 text-center border border-destructive mt-8">
          <div className="text-6xl">✕</div>
          <h1 className="mt-4 text-3xl font-extrabold text-destructive">Account Locked</h1>
          <p className="mt-2 text-muted-foreground">Identity verification failed. Per state regulation, this session has been suspended.</p>
          <Link to="/dashboard" className="mt-6 inline-block border border-foreground px-6 py-3 font-bold">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const advanceLesson = () => {
    markLessonComplete(course.id, lessonKey);
    if (lessonIdx + 1 < mod.lessons.length) {
      setLessonIdx(lessonIdx + 1);
    } else {
      setMode("quiz");
    }
  };

  const submitQuiz = () => {
    const correct = mod.quiz.every(q => answers[q.id] === q.answer);
    if (!correct) {
      alert("Score below passing threshold. Please review the module and try again.");
      setAnswers({});
      return;
    }
    markQuizPassed(course.id, mod.id);
    if (moduleIdx + 1 < course.modules.length) {
      setModuleIdx(moduleIdx + 1);
      setLessonIdx(0);
      setMode("lesson");
      setAnswers({});
    } else {
      // Complete!
      const certId = nextCertNumber(course.state);
      issueCertificate(course.id, certId);
      // Store cert in public registry
      const issued = {
        id: certId,
        studentName: user.fullName,
        courseTitle: course.title,
        courseId: course.id,
        issuedAt: new Date().toISOString().slice(0, 10),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 2).toISOString().slice(0, 10),
        status: "active" as const,
      };
      const raw = window.localStorage.getItem("sags:certs");
      const list = raw ? JSON.parse(raw) : [];
      list.push(issued);
      window.localStorage.setItem("sags:certs", JSON.stringify(list));
      navigate({ to: "/verify/$certId", params: { certId } });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* ID Challenge modal */}
      {idChallenge && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 backdrop-blur">
          <div className="w-full max-w-md border border-accent bg-background p-6 animate-in">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
              Identity Verification
            </div>
            <h2 className="mt-2 text-2xl font-extrabold">Random Security Check</h2>
            <p className="mt-4 text-sm text-muted-foreground">{idChallenge.q}</p>
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">Demo answer: {idChallenge.a}</p>
            <input
              value={idInput}
              onChange={e => setIdInput(e.target.value)}
              className="mt-3 w-full border border-border bg-background px-3 py-2"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setLocked(true)}
                className="flex-1 border border-destructive text-destructive py-2 text-xs font-bold uppercase"
              >
                Skip / Fail
              </button>
              <button
                onClick={() => {
                  if (idInput === idChallenge.a) {
                    setIdChallenge(null);
                    setIdInput("");
                  } else {
                    setLocked(true);
                  }
                }}
                className="flex-1 bg-accent py-2 text-xs font-bold uppercase text-accent-foreground"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        {/* Sidebar: modules */}
        <aside className="lg:col-span-3">
          <div className="border border-border p-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {course.stateLabel} · {course.authority}
            </div>
            <h2 className="mt-1 font-bold">{course.title}</h2>
            <div className="mt-3 h-1 w-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 font-mono text-[10px] text-muted-foreground">{pct}% complete</div>
          </div>
          <div className="mt-4 space-y-2">
            {course.modules.map((m, i) => {
              const passed = progress?.passedQuizzes.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`border p-3 ${i === moduleIdx ? "border-foreground" : "border-border opacity-70"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {passed && <span className="font-mono text-[10px] text-primary">✓</span>}
                  </div>
                  <div className="mt-1 text-sm font-semibold">{m.title}</div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-9">
          <div className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Module {moduleIdx + 1} · {mode === "lesson" ? `Lesson ${lessonIdx + 1}` : "Quiz"}
              </span>
              <span className="font-mono text-[10px] text-accent">
                {mode === "lesson"
                  ? canAdvance ? "READY TO ADVANCE" : `LOCKED · ${5 - timer}s`
                  : "PASSING SCORE 100%"}
              </span>
            </div>

            {mode === "lesson" ? (
              <div className="p-8">
                <h2 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h2>
                <div className="mt-2 font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {lesson.type} · {lesson.duration} min
                </div>
                {lesson.type === "video" && (
                  <div className="mt-6 aspect-video bg-foreground grid place-items-center text-background/40">
                    <div className="text-center">
                      <div className="mx-auto grid size-16 place-items-center border-2 border-white/40">
                        <div className="ml-1 size-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-white/80" />
                      </div>
                      <div className="mt-4 font-mono text-[10px] uppercase tracking-widest">Video Player · {lesson.duration}:00</div>
                    </div>
                  </div>
                )}
                <p className="mt-6 max-w-[70ch] text-muted-foreground leading-relaxed">{lesson.body}</p>

                <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
                  <div className="font-mono text-[10px] text-muted-foreground">
                    LESSON KEY {lessonKey}
                  </div>
                  <button
                    disabled={!canAdvance}
                    onClick={advanceLesson}
                    className={`px-6 py-3 text-sm font-bold uppercase tracking-wider ${
                      canAdvance
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "cursor-not-allowed bg-secondary text-muted-foreground"
                    }`}
                  >
                    {canAdvance ? "Continue →" : `Locked · ${5 - timer}s`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8">
                <h2 className="text-3xl font-extrabold tracking-tight">Module Quiz</h2>
                <p className="mt-2 text-muted-foreground">Pass all questions to unlock the next module.</p>
                <div className="mt-6 space-y-6">
                  {mod.quiz.map((q, qi) => (
                    <div key={q.id} className="border border-border p-4">
                      <div className="font-mono text-[10px] font-bold text-muted-foreground">Q{qi + 1}</div>
                      <p className="mt-1 font-semibold">{q.q}</p>
                      <div className="mt-3 space-y-2">
                        {q.options.map((opt, oi) => (
                          <label key={oi} className={`flex cursor-pointer items-center gap-3 border p-3 text-sm ${answers[q.id] === oi ? "border-primary bg-primary/5" : "border-border"}`}>
                            <input
                              type="radio"
                              checked={answers[q.id] === oi}
                              onChange={() => setAnswers(a => ({ ...a, [q.id]: oi }))}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={submitQuiz}
                  disabled={mod.quiz.some(q => answers[q.id] === undefined)}
                  className="mt-6 w-full bg-primary py-4 font-bold uppercase text-primary-foreground disabled:cursor-not-allowed disabled:bg-secondary disabled:text-muted-foreground"
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
