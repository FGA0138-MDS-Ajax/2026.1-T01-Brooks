import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        placeholder="Pesquisar prato..."
        className="
        w-full
        bg-white
        rounded-2xl
        shadow-sm
        pl-12
        pr-4
        py-4
        outline-none
        border
        border-gray-200
      "
      />
    </div>
  );
}