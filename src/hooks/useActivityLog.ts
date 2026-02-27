import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";

export function useActivityLogs(entityType?: string, entityId?: string) {
  return useQuery({
    queryKey: ["activity_logs", entityType, entityId],
    queryFn: async () => {
      let q = supabase.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(100);
      if (entityType) q = q.eq("entity_type", entityType);
      if (entityId) q = q.eq("entity_id", entityId);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useLogActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (row: TablesInsert<"activity_logs">) => {
      const { data, error } = await supabase.from("activity_logs").insert(row).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activity_logs"] }),
  });
}
