import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type JuryEvaluation = Tables<"jury_evaluations">;
export type JuryEvaluationInsert = TablesInsert<"jury_evaluations">;

export const JURY_CRITERIA_WEIGHTS = {
  technical_quality: 25,
  innovation: 20,
  impact: 20,
  presentation_skills: 20,
  business_value: 15,
} as const;

export function computeJuryAverageScore(e: {
  technical_quality: number;
  innovation: number;
  impact: number;
  presentation_skills: number;
  business_value: number;
}): number {
  const sum =
    (e.technical_quality / 5) * JURY_CRITERIA_WEIGHTS.technical_quality +
    (e.innovation / 5) * JURY_CRITERIA_WEIGHTS.innovation +
    (e.impact / 5) * JURY_CRITERIA_WEIGHTS.impact +
    (e.presentation_skills / 5) * JURY_CRITERIA_WEIGHTS.presentation_skills +
    (e.business_value / 5) * JURY_CRITERIA_WEIGHTS.business_value;
  return Math.round(sum * 100) / 100;
}

export function useJuryEvaluations() {
  return useQuery({
    queryKey: ["jury_evaluations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jury_evaluations")
        .select("*, interns(full_name, department, status)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useJuryEvaluationsByIntern(internId: string | null) {
  return useQuery({
    queryKey: ["jury_evaluations", internId],
    queryFn: async () => {
      if (!internId) return [];
      const { data, error } = await supabase
        .from("jury_evaluations")
        .select("*")
        .eq("intern_id", internId);
      if (error) throw error;
      return (data ?? []) as JuryEvaluation[];
    },
    enabled: !!internId,
  });
}

export function useUpsertJuryEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: JuryEvaluationInsert) => {
      const { data, error } = await supabase
        .from("jury_evaluations")
        .upsert(row, { onConflict: "intern_id,evaluator_email" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["jury_evaluations"] });
      qc.invalidateQueries({ queryKey: ["jury_evaluations", variables.intern_id] });
    },
  });
}
