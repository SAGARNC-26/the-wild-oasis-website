"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

function Filter() {
  const searchParams = useSearchParams(); // ✅ Correct usage
  const router = useRouter();
  const pathname = usePathname();
  const activeFilter = searchParams.get("capacity") ?? "all";

  function handleFilter(filter: string) {
    const params = new URLSearchParams(searchParams.toString()); // ✅ Clone current params
    if (filter === "all") {
      params.delete("capacity");
    } else {
      params.set("capacity", filter);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="border border-primary-800 flex">
      <Button
        filter="all"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        filter="small"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;3 guests
      </Button>
      <Button
        filter="medium"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;7 guests
      </Button>
      <Button
        filter="large"
        handleFilter={handleFilter}
        activeFilter={activeFilter}
      >
        1&mdash;12 guests
      </Button>
    </div>
  );
}

function Button({
  filter,
  handleFilter,
  activeFilter,
  children,
}: {
  filter: string;
  handleFilter: (filter: string) => void;
  activeFilter: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === filter ? "bg-primary-700 text-primary-50" : ""
      }`}
      onClick={() => handleFilter(filter)}
    >
      {children}
    </button>
  );
}

export default Filter;
