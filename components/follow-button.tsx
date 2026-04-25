"use client";

import { useTransition } from "react";
import { followMissionary, unfollowMissionary } from "@/app/(admin)/admin/seguindo/actions";

type Props = {
  missionaryId: string;
  isFollowing: boolean;
};

export default function FollowButton({ missionaryId, isFollowing }: Props) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      if (isFollowing) {
        unfollowMissionary(missionaryId);
      } else {
        followMissionary(missionaryId);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-60 ${
        isFollowing
          ? "border border-slate-300 text-slate-800 hover:bg-slate-50"
          : "bg-slate-900 text-white hover:opacity-90"
      }`}
    >
      {pending ? "..." : isFollowing ? "Seguindo" : "Seguir"}
    </button>
  );
}
