import { PratoRanking } from "@/types/avaliacaoRanking";

interface Props {
  pratos: PratoRanking[];
}

export default function RankingChart({
  pratos,
}: Props) {
  return (
    <div className="space-y-5">
      {pratos.map((prato) => (
        <div key={prato.id}>
          <div className="flex justify-between mb-2">
            <span>{prato.nome}</span>

            <span className="font-bold text-[#0B2A59]">
              {prato.nota}
            </span>
          </div>

          <div className="h-4 bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#0B2A59] rounded-full"
              style={{
                width: `${(prato.nota / 5) * 100}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}