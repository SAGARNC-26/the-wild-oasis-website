export const metadata = {
  title: "Geast Area",
};
import { auth } from "../_lib/auth";
export default async function Page() {
  const session = await auth();
  if (!session?.user?.name) {
    return (
      <h2 className="font-semibold text-2xl text-red-400 mb-7">
        Welcome, Guest
      </h2>
    );
  }

  const firstName = session.user.name.split(" ").at(0);
  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome,{firstName}
    </h2>
  );
}
