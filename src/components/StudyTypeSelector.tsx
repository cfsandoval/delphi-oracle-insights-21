
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, ArrowRight, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudyTypeSelectorProps {
  onSelectType: (type: 'traditional' | 'realtime') => void;
}

const StudyTypeSelector = ({ onSelectType }: StudyTypeSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Seleccione el Tipo de Estudio Delphi
        </h2>
        <p className="text-xl text-gray-600">
          Elige la metodología que mejor se adapte a tu investigación
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traditional Delphi */}
        <Card className="gradient-card hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-blue-300">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('study.traditional')}</CardTitle>
                <Badge className="mt-1 bg-blue-100 text-blue-800">Recomendado para estudios profundos</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-6">
              {t('study.traditional.description')}
            </CardDescription>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-1">Primera Ronda: Preguntas Abiertas</h4>
                    <p className="text-amber-700 text-sm">
                      Comienza con preguntas abiertas para capturar la diversidad de perspectivas. 
                      Las siguientes rondas se basarán en el análisis de estas respuestas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">2-4 Rondas</Badge>
                <Badge variant="secondary">Análisis Estadístico</Badge>
                <Badge variant="secondary">Feedback Detallado</Badge>
                <Badge variant="secondary">Alta Validez</Badge>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => onSelectType('traditional')}
            >
              {t('study.start.traditional')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Real-time Delphi */}
        <Card className="gradient-card hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-emerald-300">
          <CardHeader>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Activity className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{t('study.realtime')}</CardTitle>
                <Badge className="mt-1 bg-emerald-100 text-emerald-800">Ideal para decisiones rápidas</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base mb-6">
              {t('study.realtime.description')}
            </CardDescription>

            <div className="space-y-4 mb-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="font-semibold text-emerald-800 mb-1">Consenso en Tiempo Real</h4>
                <p className="text-emerald-700 text-sm">
                  Los expertos pueden ver las respuestas de otros participantes inmediatamente 
                  y ajustar sus opiniones en tiempo real.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Respuesta Inmediata</Badge>
                <Badge variant="secondary">Visualización Live</Badge>
                <Badge variant="secondary">Adaptación Rápida</Badge>
                <Badge variant="secondary">Alta Eficiencia</Badge>
              </div>
            </div>

            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => onSelectType('realtime')}
            >
              {t('study.start.realtime')}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-500">
          ¿No estás seguro? Consulta nuestra <a href="#" className="text-blue-600 hover:underline">guía de selección de metodología</a>
        </p>
      </div>
    </div>
  );
};

export default StudyTypeSelector;
