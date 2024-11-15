import { Helmet } from "react-helmet-async";
import { useAuthRedirect } from "@/middlewares/authRedirect";

export function Dashboard() {
  const token = useAuthRedirect();

  if (!token) {
    return null;
  }

  return (
    <>
      <Helmet title="Dashboard" />
      <div className="grid grid-cols-12 gap-4">
        {/* Título */}
        <div className="col-span-12 flex">
          <h1 className="text-3xl font-bold tracking-tight mr-3">Dashboard</h1>
        </div>
      </div>
    </>
  );
}
