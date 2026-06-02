import LeftBar from "@/components/LeftBar/LeftBar";
import LoginPage from "@/components/LoginPage/LoginPage";

export default function LoginRouter() {
  return (
    <div className="container">
      <LeftBar />
      <div className="right-side">
        <LoginPage />
      </div>
    </div>
  );
}
