import { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  value: string;
}

export default function StatCard({
  icon,
  title,
  value,
}: Props) {
  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-md
      border-l-[6px]
      border-[#0B2A59]
      p-6
    "
    >
      <div className="text-[#0B2A59] mb-3">
        {icon}
      </div>

      <h3 className="text-gray-500 text-sm">
        {title}
      </h3>

      <p className="text-2xl font-bold text-[#0B2A59]">
        {value}
      </p>
    </div>
  );
}