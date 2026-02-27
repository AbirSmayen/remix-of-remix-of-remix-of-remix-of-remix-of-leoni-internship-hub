import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useVotes(internIds?: string[]) {
  return useQuery({
    queryKey: ["votes", internIds],
    queryFn: async () => {
      const { data, error } = await supabase.from("votes").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLeaderboard() {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data: votesData, error: votesErr } = await supabase.from("votes").select("intern_id, score");
      if (votesErr) throw votesErr;
      const { data: internsData, error: internsErr } = await supabase
        .from("interns")
        .select("id, full_name, email, department, internship_type, is_top10, recruitment_eligible")
        .in("status", ["active", "pending_presentation"]);
      if (internsErr) throw internsErr;
      const byIntern: Record<string, { total: number; count: number }> = {};
      (votesData ?? []).forEach((v: { intern_id: string; score: number }) => {
        if (!byIntern[v.intern_id]) byIntern[v.intern_id] = { total: 0, count: 0 };
        byIntern[v.intern_id].total += v.score;
        byIntern[v.intern_id].count += 1;
      });
      const leaderboard = (internsData ?? []).map((i: { id: string; full_name: string; email: string; department: string; internship_type: string; is_top10: boolean; recruitment_eligible: boolean }) => {
        const d = byIntern[i.id] ?? { total: 0, count: 0 };
        const avgScore = d.count > 0 ? d.total / d.count : 0;
        return {
          ...i,
          avgScore: Math.round(avgScore * 100) / 100,
          voteCount: d.count,
          totalPoints: d.total,
        };
      });
      leaderboard.sort((a: { avgScore: number; voteCount: number }, b: { avgScore: number; voteCount: number }) => b.avgScore - a.avgScore || b.voteCount - a.voteCount);
      return leaderboard;
    },
  });
}

export function useCastVote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: TablesInsert<"votes">) => {
      const { data, error } = await supabase.from("votes").upsert(row, { onConflict: "intern_id,voter_id" }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["votes"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}

export function useHasVoted(voterId: string | null, internId: string | null) {
  return useQuery({
    queryKey: ["vote_check", voterId, internId],
    queryFn: async () => {
      if (!voterId || !internId) return false;
      const { data, error } = await supabase.from("votes").select("id").eq("voter_id", voterId).eq("intern_id", internId).maybeSingle();
      if (error) throw error;
      return !!data;
    },
    enabled: !!voterId && !!internId,
  });
}
