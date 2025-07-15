
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import DelphiTraditional from "@/components/DelphiTraditional";
import DelphiRealtime from "@/components/DelphiRealtime";
import StudyList from "@/components/StudyList";
import CreateStudy from "@/components/CreateStudy";
import Library from "@/components/Library";
import StudyTypeSelector from "@/components/StudyTypeSelector";

const Index = () => {
  const { user, isLoading } = useAuth();
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [selectedStudyType, setSelectedStudyType] = useState<'traditional' | 'realtime' | null>(null);

  // Redirect to auth if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const handleSelectStudyType = (type: 'traditional' | 'realtime') => {
    setSelectedStudyType(type);
    setActiveView("create");
  };

  const handleStudyCreated = () => {
    setSelectedStudyType(null);
    setActiveView("studies");
  };

  return (
    <div className="min-h-screen">
      <Header activeView={activeView} setActiveView={setActiveView} />

      <main className="container mx-auto px-6 py-8">
        {activeView === "dashboard" && <Dashboard setActiveView={setActiveView} onSelectStudyType={handleSelectStudyType} />}

        {activeView === "studies" && (
          <StudyList onSelectStudy={setSelectedStudy} />
        )}

        {activeView === "library" && <Library />}

        {activeView === "create" && !selectedStudyType && (
          <StudyTypeSelector onSelectType={handleSelectStudyType} />
        )}

        {activeView === "create" && selectedStudyType && (
          <CreateStudy 
            methodology={selectedStudyType}
            onStudyCreated={handleStudyCreated} 
            onBack={() => setSelectedStudyType(null)}
          />
        )}

        {selectedStudy && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setSelectedStudy(null)}
              >
                ← {t('common.back')}
              </Button>
              <Badge variant="secondary">
                {selectedStudy.methodology === "traditional" ? "Delphi Tradicional" : "Delphi Tiempo Real"}
              </Badge>
            </div>
            
            {selectedStudy.methodology === "traditional" ? (
              <DelphiTraditional study={selectedStudy} />
            ) : (
              <DelphiRealtime study={selectedStudy} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
