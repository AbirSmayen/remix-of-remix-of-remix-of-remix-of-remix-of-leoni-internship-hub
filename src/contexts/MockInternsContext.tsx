import { createContext, useContext, useMemo, useState } from "react";

export type DirectorVote = { directorId: string; value: 1 | 2 | 3 | 4 | 5 };

export type MockIntern = {
  id: number;
  name: string;
  supervisor: string;
  project: string;
  department: string;
  internshipType: string;
  score: number | null;
  locked: boolean;
  isBestProject: boolean;
  votes: DirectorVote[];
  isTop10: boolean;
  recruitmentEligible: boolean;
  email?: string;
};

type MockInternsContextValue = {
  interns: MockIntern[];
  setInterns: React.Dispatch<React.SetStateAction<MockIntern[]>>;
  addToBestProjects: (internId: number) => void;
  lockEvaluation: (internId: number, score: number) => void;
  castVote: (internId: number, directorId: string, value: 1 | 2 | 3 | 4 | 5) => void;
  computeTop10: () => void;
};

const MockInternsContext = createContext<MockInternsContextValue | null>(null);

const initialMockInterns: MockIntern[] = [
  {
    id: 1,
    name: "Ahmed Ben Ali",
    supervisor: "Supervisor 1",
    email: "ahmed.benali@demo.tn",
    project: "AI Predictive Maintenance System",
    department: "Engineering",
    internshipType: "PFE",
    score: null,
    locked: false,
    isBestProject: false,
    votes: [],
    isTop10: false,
    recruitmentEligible: false,
  },
  {
    id: 2,
    name: "Sarra Trabelsi",
    supervisor: "Supervisor 1",
    email: "sarra.trabelsi@demo.tn",
    project: "Supply Chain Optimization",
    department: "Engineering",
    internshipType: "PFE",
    score: null,
    locked: false,
    isBestProject: false,
    votes: [],
    isTop10: false,
    recruitmentEligible: false,
  },
  {
    id: 3,
    name: "Youssef Khaled",
    supervisor: "Supervisor 2",
    email: "youssef.khaled@demo.tn",
    project: "ERP Automation Tool",
    department: "IT",
    internshipType: "Summer",
    score: null,
    locked: false,
    isBestProject: false,
    votes: [],
    isTop10: false,
    recruitmentEligible: false,
  },
];

export function MockInternsProvider({ children }: { children: React.ReactNode }) {
  const [interns, setInterns] = useState<MockIntern[]>(initialMockInterns);

  const value = useMemo<MockInternsContextValue>(() => {
    const lockEvaluation = (internId: number, score: number) => {
      setInterns((prev) =>
        prev.map((i) =>
          i.id === internId
            ? {
                ...i,
                score,
                locked: true,
              }
            : i
        )
      );
    };

    const addToBestProjects = (internId: number) => {
      setInterns((prev) =>
        prev.map((i) =>
          i.id === internId
            ? {
                ...i,
                isBestProject: true,
              }
            : i
        )
      );
    };

    const castVote = (internId: number, directorId: string, value: 1 | 2 | 3 | 4 | 5) => {
      setInterns((prev) =>
        prev.map((i) => {
          if (i.id !== internId) return i;
          if (!i.isBestProject) return i;
          if (i.votes.some((v) => v.directorId === directorId)) return i;
          return {
            ...i,
            votes: [...i.votes, { directorId, value }],
          };
        })
      );
    };

    const computeTop10 = () => {
      setInterns((prev) => {
        const best = prev.filter((i) => i.isBestProject);
        const sorted = [...best].sort((a, b) => {
          const aPts = a.votes.reduce((s, v) => s + v.value, 0);
          const bPts = b.votes.reduce((s, v) => s + v.value, 0);
          return bPts - aPts || (b.score ?? 0) - (a.score ?? 0);
        });
        const top10Ids = new Set(sorted.slice(0, 10).map((i) => i.id));
        return prev.map((i) => {
          if (!i.isBestProject) {
            return { ...i, isTop10: false, recruitmentEligible: false };
          }
          const isTop10 = top10Ids.has(i.id);
          return { ...i, isTop10, recruitmentEligible: isTop10 };
        });
      });
    };

    return { interns, setInterns, addToBestProjects, lockEvaluation, castVote, computeTop10 };
  }, [interns]);

  return <MockInternsContext.Provider value={value}>{children}</MockInternsContext.Provider>;
}

export function useMockInterns() {
  const ctx = useContext(MockInternsContext);
  if (!ctx) throw new Error("useMockInterns must be used within MockInternsProvider");
  return ctx;
}

