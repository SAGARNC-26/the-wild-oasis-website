// app/cabins/page.tsx
/*import { Suspense } from "react";
import Filter from "../_component/Filter";
import CabinList from "../_component/CabinList";
import Spinner from "../_component/Spinner";

export const revalidate = 3600;

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] };
}) {
  const rawFilter = searchParams?.capacity ?? "all";
  const filter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter;

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites...
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
      </Suspense>
    </div>
  );
}
*/
// app/cabins/page.tsx
import { Suspense } from "react";
import Filter from "../_component/Filter";
import Spinner from "../_component/Spinner";
import dynamic from "next/dynamic";
import { ReservationProvider } from "../_component/ReservationContext";

export const revalidate = 3600;

// Lazy-load CabinList as a client component
const CabinList = dynamic(() => import("../_component/CabinList"), {
  ssr: false,
  loading: () => <Spinner />,
});

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] };
}) {
  const rawFilter = searchParams?.capacity ?? "all";
  const filter = Array.isArray(rawFilter) ? rawFilter[0] : rawFilter;

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites...
      </p>
      <div className="flex justify-end mb-8">
        <Filter />
      </div>
      <Suspense fallback={<Spinner />} key={filter}>
        <CabinList filter={filter} />
        <ReservationProvider />
      </Suspense>
    </div>
  );
}
