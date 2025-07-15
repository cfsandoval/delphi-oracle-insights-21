
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, BarChart3, FileText, TrendingUp } from "lucide-react";

interface RoundDetailsProps {
  round: {
    round: number;
    responses: number;
    consensus: number;
    status: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

const RoundDetails = ({ round, isOpen, onClose }: RoundDetailsProps) => {
  const mockResponses = [
    { expert: "Dr. María García", response: "Implementar políticas de desarrollo rural sostenible", timestamp: "2024-01-15 10:30" },
    { expert: "Ing. Carlos López", response: "Fortalecer la infraestructura vial en zonas rurales", timestamp: "2024-01-15 11:45" },
    { expert: "Dra. Ana Rodríguez", response: "Promover la educación técnica y tecnológica", timestamp: "2024-01-15 14:20" }
  ];

  const mockStatistics = {
    averageLength: 145,
    themes: ["Infraestructura", "Educación", "Sostenibilidad", "Tecnología"],
    participation: 85
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Resultados Ronda {round.round}</span>
          </DialogTitle>
          <DialogDescription>
            Análisis detallado de respuestas y consenso alcanzado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estadísticas Generales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-800">{round.responses}</p>
                <p className="text-sm text-blue-600">Respuestas</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-800">{round.consensus}%</p>
                <p className="text-sm text-green-600">Consenso</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50">
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-800">{mockStatistics.participation}%</p>
                <p className="text-sm text-purple-600">Participación</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-amber-800">{mockStatistics.averageLength}</p>
                <p className="text-sm text-amber-600">Palabras prom.</p>
              </CardContent>
            </Card>
          </div>

          {/* Progreso de Consenso */}
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Consenso</CardTitle>
              <CardDescription>Evolución del acuerdo entre expertos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Consenso Alcanzado</span>
                  <span>{round.consensus}%</span>
                </div>
                <Progress value={round.consensus} className="w-full h-3" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Temas Identificados */}
          <Card>
            <CardHeader>
              <CardTitle>Temas Principales Identificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockStatistics.themes.map((theme, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {theme}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Respuestas de Expertos */}
          <Card>
            <CardHeader>
              <CardTitle>Respuestas de Expertos</CardTitle>
              <CardDescription>Muestra de las respuestas recibidas (anonimizadas)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockResponses.map((response, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">{response.expert}</span>
                      <span className="text-xs text-gray-500">{response.timestamp}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{response.response}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoundDetails;
