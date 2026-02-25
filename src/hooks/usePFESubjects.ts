import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type PFESubject = Tables<"pfe_subjects">;

export const usePFESubjects = (type?: string) => {
  return useQuery({
    queryKey: ["pfe_subjects", type],
    queryFn: async () => {
      let query = supabase.from("pfe_subjects").select("*").order("created_at", { ascending: false });
      if (type) query = query.eq("type", type);
      const { data, error } = await query;
      if (error) throw error;
      return data as PFESubject[];
    },
  });
};

export const usePFESubjectById = (subjectId: string) => {
  return useQuery({
    queryKey: ["pfe_subject", subjectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pfe_subjects")
        .select("*")
        .eq("subject_id", subjectId)
        .maybeSingle();
      if (error) throw error;
      return data as PFESubject | null;
    },
    enabled: !!subjectId,
  });
};

export const useCreatePFESubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (subject: TablesInsert<"pfe_subjects">) => {
      const { data, error } = await supabase.from("pfe_subjects").insert(subject).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pfe_subjects"] }),
  });
};

export const useUpdatePFESubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<TablesInsert<"pfe_subjects">>) => {
      const { data, error } = await supabase.from("pfe_subjects").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pfe_subjects"] }),
  });
};

export const useDeletePFESubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pfe_subjects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pfe_subjects"] }),
  });
};

export const useApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, pfe_subjects(subject_id, title, department, site)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["applications"] }),
  });
};

export const useSubmitApplication = () => {
  return useMutation({
    mutationFn: async (application: TablesInsert<"applications">) => {
      const { data, error } = await supabase.from("applications").insert(application).select().single();
      if (error) throw error;
      return data;
    },
  });
};

export const generateSubjectId = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const { count, error } = await supabase.from("pfe_subjects").select("*", { count: "exact", head: true });
  const num = (count || 0) + 1;
  return `PFE-${year}-${String(num).padStart(3, "0")}`;
};

export const uploadApplicationFile = async (file: File, folder: string): Promise<string> => {
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("application-documents").upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("application-documents").getPublicUrl(fileName);
  return data.publicUrl;
};
