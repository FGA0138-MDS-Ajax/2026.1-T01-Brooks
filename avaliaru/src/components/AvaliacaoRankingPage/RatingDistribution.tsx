import { RatingDistribution as RatingType }
from "@/types/avaliacaoRanking";

interface Props {
  ratings: RatingType[];
}

export default function RatingDistribution({
  ratings,
}: Props) {
  return (
    <div className="space-y-4">
      {ratings.map((item) => (
        <div
          key={item.estrelas}
          className="flex gap-4 items-center"
        >
          <span className="w-8">
            {item.estrelas}⭐
          </span>

          <div className="flex-1 h-4 bg-gray-200 rounded-full">
            <div
              className="h-full bg-green-600 rounded-full"
              style={{
                width: `${item.percentual}%`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}