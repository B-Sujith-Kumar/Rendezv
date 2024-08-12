import User from "@/backend/models/user.model";
import { host } from "@/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";

export const useInsertEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const eventDetails = {
        ...data,
        banner: data.image,
        is_online: data.eventMode === "Offline" ? false : true,
      };
      delete eventDetails.image;
      delete eventDetails.eventMode;

      const res = await axios.post(`${host}/events/create-event`, eventDetails);
      return res.data;
    },
    onSuccess: async (res) => {
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

export const useFreeEvents = () => {
  return useQuery({
    queryKey: ["freeEvents"],
    queryFn: async () => {
      const res = await axios.get(`${host}/events/get-free-events`);
      return res.data.events;
    },
  });
};

export const useOnlineEvents = () => {
  return useQuery({
    queryKey: ["onlineEvents"],
    queryFn: async () => {
      const res = await axios.get(`${host}/events/get-online-events`);
      return res.data.events;
    },
  });
};