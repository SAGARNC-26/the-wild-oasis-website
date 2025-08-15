import Spinner from "../_component/Spinner";
export default function Loading() {
  return (
    <div className="grid items-center justify-items-center ">
      <Spinner />

      <p className="text-primary-200 text-xl">Loading cabins...</p>
    </div>
  );
}
