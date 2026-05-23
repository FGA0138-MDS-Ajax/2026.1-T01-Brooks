import LandingPage from "@/components/LandingPage";
import LeftBar from "../components/LeftBar";

export default function Home() {
  return (
    <div className="container">
      <LeftBar />

      <div id="land-side">
        <LandingPage />
      </div>
    </div>
  );
}
