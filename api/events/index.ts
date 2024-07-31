import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const categoryIds = [];
      console.log(data);
    //   for (const category of data.categories) {
    //     const { data: existingCategory, error: fetchError } = await supabase
    //       .from("event_categories")
    //       .select("id")
    //       .eq("name", category)
    //       .single();

    //     if (fetchError) throw fetchError;

    //     let categoryId;
    //     if (existingCategory) {
    //       categoryId = existingCategory.id;
    //     } else {
    //       const { data: newCategory, error: insertError } = await supabase
    //         .from("event_categories")
    //         .insert([{ name: category }])
    //         .single();

    //       if (insertError) throw insertError;

    //       categoryId = newCategory.id;
    //     }
    //     categoryIds.push(categoryId);
    //   }

    //   const { data: newEvent, error } = await supabase
    //     .from("events")
    //     .insert({
    //       ...data,
    //       meeting_link: data.meetingLink || "",
    //       is_online: data.eventMode,
    //       is_paid: data.isPaid,
    //       price: data.ticketPrice,
    //       date_time: data.dateField,
    //       banner: data.image,
    //       location: data.venue,
    //       venue_name: data.venueName,
    //     })
    //     .single();
    //   if (error) {
    //     throw error;
    //   }
    //   return newEvent;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
