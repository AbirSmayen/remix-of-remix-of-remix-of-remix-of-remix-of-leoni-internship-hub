import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Intern = Tables<"interns">;
export type InternInsert = TablesInsert<"interns">;

export const INTERN_STATUS = {
  active: "active",
  pending_presentation: "pending_presentation",
  completed_archived: "completed_archived",
} as const;

export function useInterns(filters?: { status?: string; department?: string; site?: string; supervisor?: string; isTop10?: boolean; recruitmentEligible?: boolean }) {
  return useQuery({
    queryKey: ["interns", filters],
    queryFn: async () => {
      let q = supabase.from("interns").select("*").order("created_at", { ascending: false });
      if (filters?.status) q = q.eq("status", filters.status);
      if (filters?.department) q = q.eq("department", filters.department);
      if (filters?.site) q = q.eq("site", filters.site);
      if (filters?.supervisor) q = q.eq("supervisor", filters.supervisor);
      if (filters?.isTop10 === true) q = q.eq("is_top10", true);
      if (filters?.recruitmentEligible === true) q = q.eq("recruitment_eligible", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as Intern[];
    },
  });
}

/** Alumni = completed_archived interns */
export function useAlumni(filters?: { department?: string; site?: string; isTop10?: boolean; recruitmentEligible?: boolean }) {
  return useQuery({
    queryKey: ["alumni", filters],
    queryFn: async () => {
      let q = supabase
        .from("interns")
        .select("*")
        .eq("status", INTERN_STATUS.completed_archived)
        .order("final_evaluation_score", { ascending: false, nullsFirst: false });
      if (filters?.department) q = q.eq("department", filters.department);
      if (filters?.site) q = q.eq("site", filters.site);
      if (filters?.isTop10 === true) q = q.eq("is_top10", true);
      if (filters?.recruitmentEligible === true) q = q.eq("recruitment_eligible", true);
      const { data, error } = await q;
      if (error) throw error;
      return data as Intern[];
    },
  });
}

export function useActiveInterns() {
  return useInterns({ status: INTERN_STATUS.active });
}

export function usePendingPresentationInterns() {
  return useInterns({ status: INTERN_STATUS.pending_presentation });
}

export function useCreateIntern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: InternInsert) => {
      const { data, error } = await supabase.from("interns").insert(row).select().single();
      if (error) throw error;
      return data as Intern;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interns"] });
      qc.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}

export function useUpdateIntern() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<InternInsert>) => {
      const { data, error } = await supabase.from("interns").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data as Intern;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["interns"] });
      qc.invalidateQueries({ queryKey: ["alumni"] });
    },
  });
}

export function useArchiveIntern() {
  const update = useUpdateIntern();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      final_evaluation_score?: number;
      presentation_score?: number;
      voting_score?: number;
      is_top10?: boolean;
      recruitment_eligible?: boolean;
      equipment_returned?: boolean;
    }) => {
      return update.mutateAsync({
        id: params.id,
        status: INTERN_STATUS.completed_archived,
        final_evaluation_score: params.final_evaluation_score ?? null,
        presentation_score: params.presentation_score ?? null,
        voting_score: params.voting_score ?? null,
        is_top10: params.is_top10 ?? false,
        recruitment_eligible: params.recruitment_eligible ?? false,
        equipment_returned: params.equipment_returned ?? false,
      });
    },
  });
}

/** Current user's intern record (for Stagiaire – match by email) */
export function useMyIntern(userEmail: string | undefined) {
  return useQuery({
    queryKey: ["my_intern", userEmail],
    queryFn: async () => {
      if (!userEmail) return null;
      const { data, error } = await supabase
        .from("interns")
        .select("*")
        .eq("email", userEmail)
        .in("status", [INTERN_STATUS.active, INTERN_STATUS.pending_presentation])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as Intern | null;
    },
    enabled: !!userEmail,
  });
}
