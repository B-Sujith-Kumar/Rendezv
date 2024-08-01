import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useInsertEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const categoryIds = [];
      const { data: user, error: err } = await supabase
        .from("users")
        .select()
        .eq("email", data.email)
        .single();

      for (const category of data.categories) {
        const { data: existingCategory, error: fetchError } = await supabase
          .from("event_categories")
          .select("id")
          .eq("name", category.toLowerCase())
          .single();

        if (fetchError) {
          console.log(fetchError);
          console.log("in fetch error");
        }

        let categoryId;
        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const { data: newCategory, error: insertError } = await supabase
            .from("event_categories")
            .insert([{ name: category.toLowerCase() }])
            .single();

          if (insertError) {
            console.log(insertError);
          }

          categoryId = newCategory.id;
        }
        categoryIds.push(categoryId);
      }
      delete data.categories;
      delete data.email;

      const { data: newEvent, error } = await supabase
        .from("events")
        .insert({
          title: data.title,
          description: data.description,
          capacity: parseInt(data.capacity),
          meeting_link: data.meetingLink || "",
          is_online: data.eventMode === "Offline" ? false : true,
          is_paid: data.isPaid,
          price: data.ticketPrice ? parseInt(data.ticketPrice) : 0,
          date_time: data.dateField,
          banner: data.image,
          location: data.venue,
          venue_name: data.venueName,
          organizer_id: user.id,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
      }

      console.log(newEvent);

      for (const categoryId of categoryIds) {
        const { error: insertError } = await supabase
          .from("event_categories_mapping")
          .insert([{ event_id: newEvent.id, category_id: categoryId }]);
        if (insertError) {
          console.log(insertError);
        }
      }
      return newEvent;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
