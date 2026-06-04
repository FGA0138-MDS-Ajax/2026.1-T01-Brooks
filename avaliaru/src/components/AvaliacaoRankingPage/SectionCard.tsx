import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function SectionCard({
  title,
  children,
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
      <h2 className="text-2xl font-semibold text-[#0B2A59] mb-6">
        {title}
      </h2>

      {children}
    </div>
  );
}