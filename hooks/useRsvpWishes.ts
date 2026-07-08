"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Attendance = "Hadir" | "Tidak Hadir" | "Masih Ragu";

export type RsvpWish = {
  id: number;
  name: string;
  whatsapp: string | null;
  attendance: Attendance;
  message: string;
  created_at: string;
};

const PAGE_SIZE = 6;

export function useRsvpWishes(invitationId: number | null | undefined) {
  const instanceId = useId();
  const [entries, setEntries] = useState<RsvpWish[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!invitationId) return;

    const supabase = createClient();
    const { data } = await supabase
      .from("rsvp_wishes")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    setEntries(data ?? []);
  }, [invitationId]);

  useEffect(() => {
    if (!invitationId) return;

    fetchAll();

    const supabase = createClient();
    const channel = supabase
      .channel(`rsvp_wishes:${invitationId}:${instanceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "rsvp_wishes",
          filter: `invitation_id=eq.${invitationId}`,
        },
        (payload) => {
          setEntries((prev) => [payload.new as RsvpWish, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invitationId, fetchAll]);

  const submit = async (input: {
    name: string;
    whatsapp: string;
    attendance: Attendance;
    message: string;
  }) => {
    if (!invitationId) return { error: "Undangan tidak ditemukan." };

    setSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.from("rsvp_wishes").insert({
      invitation_id: invitationId,
      name: input.name,
      whatsapp: input.whatsapp || null,
      attendance: input.attendance,
      message: input.message,
    });

    setSubmitting(false);

    if (error) return { error: "Gagal mengirim. Silakan coba lagi." };

    setSubmitted(true);
    return { error: null };
  };

  const counts = {
    hadir: entries.filter((e) => e.attendance === "Hadir").length,
    tidakHadir: entries.filter((e) => e.attendance === "Tidak Hadir").length,
    raguRagu: entries.filter((e) => e.attendance === "Masih Ragu").length,
  };

  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;
  const loadMore = () => setVisibleCount((c) => c + PAGE_SIZE);

  return {
    entries: visibleEntries,
    totalCount: entries.length,
    counts,
    hasMore,
    loadMore,
    submit,
    submitting,
    submitted,
  };
}
