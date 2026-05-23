import LeftBar from "@/components/LeftBar";
import RegisterPage from "@/components/RegisterPage";

export default function RegisterRoute() {
  return (
    <div className="container">
      <LeftBar />

      <div className="form-side">
        <RegisterPage />
      </div>
    </div>
  );
}
