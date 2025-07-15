
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BarChart3, Play, Pause, CheckCircle } from "lucide-react";
import { Study } from "@/types/study";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudyCardProps {
  study: Study;
  onSelectStudy: (study: Study) => void;
}

const StudyCard = ({ study, onSelectStudy }: StudyCardProps) => {
  const { language, t } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-4 w-4" />;
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "paused": return <Pause className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <Card className="gradient-card hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{study.title[language]}</CardTitle>
            <CardDescription className="text-sm">{study.description[language]}</CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(study.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(study.status)}
                <span className="capitalize">{t(`status.${study.status}`)}</span>
              </div>
            </Badge>
            <Badge variant="outline">
              {study.methodology === "traditional" ? t('study.traditional') : t('study.realtime')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{study.experts}</span>
            </div>
            <p className="text-sm text-gray-600">{t('study.experts')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">
                {study.currentRound}/{study.rounds}
              </span>
            </div>
            <p className="text-sm text-gray-600">{t('study.rounds')}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{study.consensus}%</span>
            </div>
            <p className="text-sm text-gray-600">{t('study.consensus')}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {new Date(study.createdAt).toLocaleDateString()}
            </div>
            <p className="text-sm text-gray-600">{t('study.created')}</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            onClick={() => onSelectStudy(study)}
            className="flex-1"
          >
            {study.status === "draft" ? t('study.configure') : t('study.viewDetails')}
          </Button>
          {study.status === "active" && (
            <Button variant="outline">
              {t('study.pause')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudyCard;
