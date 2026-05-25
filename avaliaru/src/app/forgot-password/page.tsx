import ForgotPasswordPage from "@/components/ForgotPassword/ForgotPasswordPage";
import LeftBar from "@/components/LeftBar/LeftBar";

export default function ForgotPasswordRoute() {
  return (
    <div className="container">
      <LeftBar />
      <div className="right-side">
        <ForgotPasswordPage />
      </div>
    </div>
  );
}
