import LandingPage from "@/components/LandingPage/LandingPage";
import LeftBar from "../components/LeftBar/LeftBar";

export default function Home() {
  return (
    <div className="container">
      <LeftBar />

      <div id="landing-side" className="form-side">
        <LandingPage />
      </div>
    </div>
  );
}
