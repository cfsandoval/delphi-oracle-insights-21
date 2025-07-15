
import { BarChart3 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const StudyEmptyState = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">
        <BarChart3 className="h-16 w-16 mx-auto" />
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{t('study.empty.title')}</h3>
      <p className="text-gray-500">{t('study.empty.description')}</p>
    </div>
  );
};

export default StudyEmptyState;
