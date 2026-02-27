import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Presentation = Tables<"presentations">;
export type PresentationInsert = TablesInsert<"presentations">;

export function usePresentations() {
  return useQuery({
    queryKey: ["presentations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("presentations")
        .select("*, interns(full_name, email, department, status)")
        .order("scheduled_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}

export function usePresentationByInternId(internId: string | null) {
  return useQuery({
    queryKey: ["presentation", internId],
    queryFn: async () => {
      if (!internId) return null;
      const { data, error } = await supabase
        .from("presentations")
        .select("*")
        .eq("intern_id", internId)
        .maybeSingle();
      if (error) throw error;
      return data as Presentation | null;
    },
    enabled: !!internId,
  });
}

export function useUpsertPresentation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: PresentationInsert & { id?: string }) => {
      const { id, ...rest } = row;
      const { data, error } = await supabase
        .from("presentations")
        .upsert(rest, { onConflict: "intern_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["presentations"] });
      if (variables.intern_id) qc.invalidateQueries({ queryKey: ["presentation", variables.intern_id] });
    },
  });
}
