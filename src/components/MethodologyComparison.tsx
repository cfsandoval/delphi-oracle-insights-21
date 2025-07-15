
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity, ArrowRight } from "lucide-react";

const MethodologyComparison = () => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="text-2xl">Metodologías Disponibles</CardTitle>
        <CardDescription>
          Elige la metodología que mejor se adapte a tu estudio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="traditional" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="traditional">Delphi Tradicional</TabsTrigger>
            <TabsTrigger value="realtime">Delphi Tiempo Real</TabsTrigger>
          </TabsList>
          <TabsContent value="traditional" className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Delphi Tradicional</h3>
                <p className="text-gray-600 mb-4">
                  Metodología clásica con rondas secuenciales, ideal para estudios de investigación 
                  profunda donde el tiempo permite reflexión detallada.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">2-4 Rondas</Badge>
                  <Badge variant="secondary">Análisis Estadístico</Badge>
                  <Badge variant="secondary">Feedback Detallado</Badge>
                  <Badge variant="secondary">Alta Validez</Badge>
                </div>
                <Button>
                  Comenzar Estudio Tradicional
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="realtime" className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Delphi Tiempo Real</h3>
                <p className="text-gray-600 mb-4">
                  Metodología adaptada para decisiones rápidas con feedback inmediato, 
                  perfecta para situaciones que requieren consenso urgente.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">Respuesta Inmediata</Badge>
                  <Badge variant="secondary">Visualización Live</Badge>
                  <Badge variant="secondary">Adaptación Rápida</Badge>
                  <Badge variant="secondary">Alta Eficiencia</Badge>
                </div>
                <Button>
                  Comenzar Estudio en Tiempo Real
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MethodologyComparison;
