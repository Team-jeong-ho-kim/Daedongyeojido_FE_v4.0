import { useState } from "react";
import { toast } from "sonner";
import { useDecideDissolutionMutation } from "@/hooks/mutations";
import { PanelCard } from "./PanelCard";

export function DissolutionTab() {
  const [dissolutionClubId, setDissolutionClubId] = useState("");
  const decideDissolutionMutation = useDecideDissolutionMutation();

  const handleDecideDissolution = async (isDecision: boolean) => {
    if (!dissolutionClubId.trim()) {
      toast.error("처리할 동아리 ID를 입력해 주세요.");
      return;
    }

    try {
      await decideDissolutionMutation.mutateAsync({
        clubId: dissolutionClubId.trim(),
        isDecision,
      });
    } catch {}
  };

  return (
    <PanelCard
      title="동아리 해체 수락/거절"
      description="해체 요청이 온 동아리 ID를 입력해 처리합니다."
    >
      <div className="flex flex-wrap gap-2">
        <input
          value={dissolutionClubId}
          onChange={(event) => setDissolutionClubId(event.target.value)}
          placeholder="동아리 ID"
          className="w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <button
          type="button"
          className="rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => handleDecideDissolution(true)}
          disabled={decideDissolutionMutation.isPending}
        >
          수락
        </button>
        <button
          type="button"
          className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => handleDecideDissolution(false)}
          disabled={decideDissolutionMutation.isPending}
        >
          거절
        </button>
      </div>
    </PanelCard>
  );
}
