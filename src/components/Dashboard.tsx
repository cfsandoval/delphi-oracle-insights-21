import HeroSection from "./HeroSection";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import MethodologyComparison from "./MethodologyComparison";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardProps {
  setActiveView: (view: string) => void;
  onSelectStudyType?: (type: 'traditional' | 'realtime') => void;
}

const Dashboard = ({ setActiveView, onSelectStudyType }: DashboardProps) => {
  return (
    <div className="space-y-8">
      <HeroSection setActiveView={setActiveView} onSelectStudyType={onSelectStudyType} />
      <StatsSection />
      <FeaturesSection />
      <MethodologyComparison />
    </div>
  );
};

export default Dashboard;
