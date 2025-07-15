
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroSectionProps {
  setActiveView: (view: string) => void;
  onSelectStudyType?: (type: 'traditional' | 'realtime') => void;
}

const HeroSection = ({ setActiveView, onSelectStudyType }: HeroSectionProps) => {
  const { t } = useLanguage();

  const handleDocumentation = () => {
    window.open("https://docs.lovable.dev/", "_blank");
  };

  const handleCreateStudy = () => {
    if (onSelectStudyType) {
      setActiveView("create");
    } else {
      setActiveView("create");
    }
  };

  return (
    <div className="text-center py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        {t('hero.title')}
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        {t('hero.description')}
      </p>
      <div className="flex justify-center space-x-4">
        <Button size="lg" className="gradient-primary" onClick={handleCreateStudy}>
          <Plus className="h-5 w-5 mr-2" />
          {t('hero.createStudy')}
        </Button>
        <Button size="lg" variant="outline" onClick={handleDocumentation}>
          <BookOpen className="h-5 w-5 mr-2" />
          {t('hero.documentation')}
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
