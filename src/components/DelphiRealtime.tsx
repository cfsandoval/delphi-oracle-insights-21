
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Calendar, BarChart3, Eye, TrendingUp, Clock } from "lucide-react";
import { Study } from "@/types/study";
import { useLanguage } from "@/contexts/LanguageContext";
import RoundDetails from "./RoundDetails";

interface DelphiRealtimeProps {
  study: Study;
}

const DelphiRealtime = ({ study }: DelphiRealtimeProps) => {
  const { language, t } = useLanguage();
  const [selectedRound, setSelectedRound] = useState<any>(null);

  // Datos simulados para las rondas en tiempo real
  const rounds = [
    {
      round: 1,
      responses: 18,
      consensus: 52,
      status: "completed",
      date: "2024-01-15",
      duration: "3 horas"
    },
    {
      round: 2,
      responses: 16,
      consensus: 71,
      status: "completed", 
      date: "2024-01-15",
      duration: "2.5 horas"
    },
    {
      round: 3,
      responses: 15,
      consensus: 83,
      status: "active",
      date: "2024-01-15",
      duration: "En progreso (45 min)"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Activa</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  const getConsensusColor = (consensus: number) => {
    if (consensus >= 80) return "text-green-600";
    if (consensus >= 70) return "text-blue-600";
    if (consensus >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{study.title[language]}</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {t('study.realtime')}
            </Badge>
          </CardTitle>
          <p className="text-gray-600">{study.description[language]}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Indicador de Tiempo Real */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
            <span className="text-orange-800 font-medium">
              Sesión en Tiempo Real - Actualizaciones Automáticas
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Detalle de Rondas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Progreso por Rondas (Tiempo Real)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rounds.map((round) => (
              <div key={round.round} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-lg font-bold">R{round.round}</div>
                      <div className="text-xs text-gray-500">Ronda</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Respuestas:</span>
                        <span className="text-sm">{round.responses}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Consenso:</span>
                        <span className={`text-sm font-bold ${getConsensusColor(round.consensus)}`}>
                          {round.consensus}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Fecha:</span>
                        <span className="text-sm">{round.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Duración:</span>
                        <span className="text-sm">{round.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(round.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRound(round)}
                      className="flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Ver Detalles</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalles */}
      {selectedRound && (
        <RoundDetails
          round={selectedRound}
          isOpen={!!selectedRound}
          onClose={() => setSelectedRound(null)}
        />
      )}
    </div>
  );
};

export default DelphiRealtime;
