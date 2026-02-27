import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

interface BestProjectIntern {
  id: string;
  full_name: string;
  email: string;
  department: string;
  internship_type: string;
  project_title: string | null;
  supervisor: string | null;
  final_evaluation_score: number | null;
  end_date: string | null;
  is_top10: boolean;
  recruitment_eligible: boolean;
}

export function useBestProjects() {
  return useQuery({
    queryKey: ["best_projects"],
    queryFn: async () => {
      const { data: logs, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("entity_type", "best_project")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const ids = Array.from(new Set((logs ?? []).map((l) => l.entity_id).filter(Boolean)));
      if (!ids.length) return [] as BestProjectIntern[];
      const { data: interns, error: internsErr } = await supabase
        .from("interns")
        .select(
          "id, full_name, email, department, internship_type, project_title, supervisor, final_evaluation_score, end_date, is_top10, recruitment_eligible"
        )
        .in("id", ids);
      if (internsErr) throw internsErr;
      return (interns ?? []) as BestProjectIntern[];
    },
  });
}

export function useAddBestProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { intern_id: string; actor_email: string | null }) => {
      const row: TablesInsert<"activity_logs"> = {
        entity_type: "best_project",
        entity_id: payload.intern_id,
        action: "add",
        actor_email: payload.actor_email ?? undefined,
        metadata: {},
      };
      const { data, error } = await supabase.from("activity_logs").insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["best_projects"] });
    },
  });
}

