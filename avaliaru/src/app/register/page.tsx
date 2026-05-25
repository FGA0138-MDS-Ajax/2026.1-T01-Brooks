import LeftBar from "@/components/LeftBar/LeftBar";
import RegisterPage from "@/components/RegisterPage/RegisterPage";

export default function RegisterRoute() {
  return (
    <div className="container">
      <LeftBar />

      <div className="right-side">
        <RegisterPage />
      </div>
    </div>
  );
}
