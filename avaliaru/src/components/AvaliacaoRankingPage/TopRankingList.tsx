import { Trophy } from "lucide-react";
import { PratoRanking } from "@/types/avaliacaoRanking";

interface Props {
  pratos: PratoRanking[];
}

export default function TopRankingList({
  pratos,
}: Props) {
  return (
    <div className="space-y-4">
      {pratos.map((prato, index) => (
        <div
          key={prato.id}
          className="
          flex
          justify-between
          border-b
          pb-3
        "
        >
          <div className="flex gap-3">
            <span className="font-bold text-[#0B2A59]">
              {index + 1}
            </span>

            <span>{prato.nome}</span>
          </div>

          <Trophy
            size={18}
            className="text-yellow-500"
          />
        </div>
      ))}
    </div>
  );
}