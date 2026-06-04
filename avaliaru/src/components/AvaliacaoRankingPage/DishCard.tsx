import { PratoRanking } from "@/types/avaliacaoRanking";

interface Props {
  prato: PratoRanking;
}

export default function DishCard({
  prato,
}: Props) {
  return (
    <div
      className="
      flex
      justify-between
      items-center
      bg-gray-50
      rounded-xl
      p-4
    "
    >
      <div>
        <h3 className="font-semibold">
          {prato.nome}
        </h3>

        <p className="text-sm text-gray-500">
          {prato.votos} avaliações
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <span className="font-bold text-[#0B2A59]">
          ⭐ {prato.nota}
        </span>

        <button
          className="
          bg-[#0B2A59]
          text-white
          px-5
          py-2
          rounded-lg
        "
        >
          Avaliar
        </button>
      </div>
    </div>
  );
}