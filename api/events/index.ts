import User from "@/backend/models/user.model";
import { host } from "@/constants";
import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useInsertEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      console.log(data);
      const eventDetails = {
        ...data,
        is_online: data.eventMode === "Offline" ? false : true,
      };
      delete eventDetails.eventMode;
      const res = await fetch(`${host}/events/create-event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventDetails),
      });
      console.log(res);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select()
        .eq("id", id)
        .single();
      if (error) {
        console.log(error);
      }
      const { data: catData, error: err } = await supabase
        .from("event_categories_mapping")
        .select(
          `
        event_id,
        event_categories (
          id,
          name
        )
      `
        )
        .eq("event_id", id);

      if (err) throw err;

      const categories = (catData as any).map(
        (mapping: any) => mapping.event_categories
      );
      return { data, categories };
    },
  });
};
