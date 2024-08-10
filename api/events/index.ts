import User from "@/backend/models/user.model";
import { host } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
        const res = await axios.get(`${host}/events/get-event/${id}`);
        return res.data.event;
    },
  });
};
