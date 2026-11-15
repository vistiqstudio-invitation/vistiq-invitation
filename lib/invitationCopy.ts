export const invitationCopy = {
  wedding: {
    label: "Pernikahan",
    openingTitle: "Dengan penuh sukacita, kami mengundang Anda ke pernikahan kami.",
    openingDescription: "Kehadiran dan doa restu Anda menjadi kebahagiaan bagi kami.",
    closing: "Terima kasih atas kehadiran dan doa restu Anda.",
  },
  birthday: {
    label: "Ulang Tahun",
    openingTitle: "Ayo, rayakan ulang tahun bersama kami!",
    openingDescription: "Yuk, datang dan rayakan ulang tahunku bersama! Aku tidak sabar bertemu denganmu.",
    closing: "Terima kasih sudah ikut merayakan hari spesial ini.",
  },
  aqiqah: {
    label: "Akikah",
    openingTitle: "Dengan penuh syukur, kami mengundang Anda ke acara akikah buah hati kami.",
    openingDescription: "Kami berharap Anda berkenan hadir dan mendoakan buah hati kami agar tumbuh sehat dan berakhlak baik.",
    closing: "Terima kasih atas kehadiran dan doa untuk buah hati kami.",
  },
  khitan: {
    label: "Khitan",
    openingTitle: "Kami mengundang Anda untuk hadir pada acara khitan putra kami.",
    openingDescription: "Mohon doa agar putra kami selalu sehat dan tumbuh menjadi anak yang saleh.",
    closing: "Terima kasih atas kehadiran dan doa untuk putra kami.",
  },
} as const;

export type InvitationCopyCategory = keyof typeof invitationCopy;

type InvitationNames = {
  category?: string | null;
  baby_name?: string | null;
  groom_name?: string | null;
  bride_name?: string | null;
};

function invitationCopyCategory(category?: string | null): InvitationCopyCategory | null {
  if (!category || category === "wedding") return "wedding";
  if (category === "birthday" || category === "aqiqah" || category === "khitan") return category;
  return null;
}

export function invitationDisplayName(invitation: InvitationNames) {
  const category = invitationCopyCategory(invitation.category);
  if (category === "wedding") {
    return [invitation.groom_name?.trim(), invitation.bride_name?.trim()].filter(Boolean).join(" & ") || "Undangan Pernikahan";
  }
  return (category && invitation.baby_name?.trim()) || (category ? `Undangan ${invitationCopy[category].label}` : "Undangan Acara");
}

export function invitationShareMessage(guestName: string, url: string, invitation: InvitationNames) {
  const category = invitationCopyCategory(invitation.category);
  const child = invitation.baby_name?.trim();
  const couple = [invitation.groom_name?.trim(), invitation.bride_name?.trim()].filter(Boolean).join(" & ");
  const religiousGreeting = category === "wedding" || category === "aqiqah" || category === "khitan";
  const opening = category === "birthday"
    ? `Yuk, datang dan ikut merayakan ulang tahun ${child ? `*${child}*` : "anak kami"}!`
    : category === "aqiqah"
    ? `Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i ke acara akikah ${child ? `*${child}*` : "buah hati kami"}.`
    : category === "khitan"
    ? `Dengan penuh syukur, kami mengundang Bapak/Ibu/Saudara/i ke acara khitan ${child ? `*${child}*` : "putra kami"}.`
    : category === "wedding"
    ? `Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri pernikahan ${couple ? `*${couple}*` : "kami"}.`
    : "Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara kami.";
  return [
    religiousGreeting ? "Assalamu’alaikum Warahmatullahi Wabarakatuh" : null,
    category === "birthday" ? `Halo, *${guestName}*!` : `Yth. Bapak/Ibu/Saudara/i *${guestName}*,`,
    opening,
    `Detail undangan dan lokasi:\n${url}`,
    category ? invitationCopy[category].closing : "Terima kasih atas kehadiran Anda.",
    religiousGreeting ? "Wassalamu’alaikum Warahmatullahi Wabarakatuh" : null,
  ].filter(Boolean).join("\n\n");
}
