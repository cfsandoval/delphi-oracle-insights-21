
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Target, Info, Download } from "lucide-react";
import { useState } from "react";

const ConsensusAnalysis = () => {
  const [selectedMetric, setSelectedMetric] = useState("variacion");
  const [selectedRound, setSelectedRound] = useState("all");

  // Datos simulados para los gráficos
  const consensusEvolution = [
    { round: "R1", consensus: 45, responses: 15, cv: 0.65 },
    { round: "R2", consensus: 67, responses: 14, cv: 0.42 },
    { round: "R3", consensus: 78, responses: 13, cv: 0.23 }
  ];

  const responseDistribution = [
    { range: "1-2", count: 2, percentage: 15 },
    { range: "3-4", count: 3, percentage: 23 },
    { range: "5-6", count: 4, percentage: 31 },
    { range: "7-8", count: 3, percentage: 23 },
    { range: "9-10", count: 1, percentage: 8 }
  ];

  const consensusIndicators = [
    { indicator: "Coeficiente de Variación", value: 0.23, interpretation: "Alto Consenso", color: "#22c55e" },
    { indicator: "Rango Intercuartílico", value: 1.2, interpretation: "Convergencia Buena", color: "#3b82f6" },
    { indicator: "Consenso W de Kendall", value: 0.72, interpretation: "Acuerdo Fuerte", color: "#8b5cf6" },
    { indicator: "Índice de Estabilidad", value: 0.85, interpretation: "Muy Estable", color: "#f59e0b" }
  ];

  const radarData = [
    { metric: "Claridad", value: 85, fullMark: 100 },
    { metric: "Relevancia", value: 92, fullMark: 100 },
    { metric: "Factibilidad", value: 78, fullMark: 100 },
    { metric: "Impacto", value: 88, fullMark: 100 },
    { metric: "Sostenibilidad", value: 75, fullMark: 100 },
    { metric: "Innovación", value: 82, fullMark: 100 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartConfig = {
    consensus: { label: "Consenso", color: "#2563eb" },
    responses: { label: "Respuestas", color: "#dc2626" },
    cv: { label: "Coef. Variación", color: "#16a34a" }
  };

  const getInterpretation = (consensus: number) => {
    if (consensus >= 80) return { level: "Excelente", color: "bg-green-100 text-green-800", recommendation: "Nivel óptimo de consenso alcanzado. Proceder con implementación." };
    if (consensus >= 70) return { level: "Bueno", color: "bg-blue-100 text-blue-800", recommendation: "Buen nivel de consenso. Considerar una ronda adicional para consolidar." };
    if (consensus >= 60) return { level: "Moderado", color: "bg-yellow-100 text-yellow-800", recommendation: "Consenso moderado. Se recomienda continuar con rondas adicionales." };
    return { level: "Bajo", color: "bg-red-100 text-red-800", recommendation: "Consenso insuficiente. Revisar preguntas y metodología." };
  };

  const currentConsensus = 78;
  const interpretation = getInterpretation(currentConsensus);

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold mb-2">Análisis Avanzado de Consenso</h2>
          <p className="text-gray-600">Indicadores estadísticos y visualizaciones interactivas</p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedRound} onValueChange={setSelectedRound}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las Rondas</SelectItem>
              <SelectItem value="1">Ronda 1</SelectItem>
              <SelectItem value="2">Ronda 2</SelectItem>
              <SelectItem value="3">Ronda 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Indicadores Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {consensusIndicators.map((indicator, index) => (
          <Card key={index} className="relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 w-full h-1" 
              style={{ backgroundColor: indicator.color }}
            />
            <CardContent className="p-4 text-center">
              <h4 className="font-semibold text-sm mb-1">{indicator.indicator}</h4>
              <p className="text-2xl font-bold mb-1">{indicator.value}</p>
              <Badge variant="outline" className="text-xs">
                {indicator.interpretation}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Interpretación General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Interpretación del Consenso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Consenso General: {currentConsensus}%</p>
                <Badge className={`${interpretation.color} mt-1`}>
                  Nivel {interpretation.level}
                </Badge>
              </div>
              <div className="text-right">
                <Progress value={currentConsensus} className="w-32 h-3" />
              </div>
            </div>
            <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex items-start space-x-2">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-800">Recomendación</p>
                  <p className="text-blue-700 text-sm mt-1">{interpretation.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Interactivos */}
      <Tabs defaultValue="evolution" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="evolution">Evolución</TabsTrigger>
          <TabsTrigger value="distribution">Distribución</TabsTrigger>
          <TabsTrigger value="radar">Análisis Radar</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="evolution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Evolución del Consenso por Rondas</span>
              </CardTitle>
              <CardDescription>
                Seguimiento del progreso del acuerdo entre expertos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <LineChart data={consensusEvolution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="consensus" 
                    stroke="var(--color-consensus)" 
                    strokeWidth={3}
                    dot={{ fill: "var(--color-consensus)", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Distribución de Respuestas</span>
              </CardTitle>
              <CardDescription>
                Análisis de la dispersión de las valoraciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <BarChart data={responseDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="var(--color-consensus)" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Análisis Multidimensional</span>
              </CardTitle>
              <CardDescription>
                Evaluación de diferentes aspectos del consenso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[400px]">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Consenso"
                    dataKey="value"
                    stroke="var(--color-consensus)"
                    fill="var(--color-consensus)"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChartIcon className="h-5 w-5" />
                <span>Comparativo de Indicadores</span>
              </CardTitle>
              <CardDescription>
                Distribución porcentual de los niveles de acuerdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <PieChart>
                      <Pie
                        data={responseDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="percentage"
                      >
                        {responseDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="flex flex-col justify-center space-y-3">
                  {responseDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">
                        Rango {item.range}: {item.percentage}% ({item.count} respuestas)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Estadísticas Avanzadas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas Detalladas</CardTitle>
          <CardDescription>Métricas estadísticas para interpretación académica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Medidas de Tendencia Central</h4>
              <div className="space-y-1 text-sm">
                <p>Media: 6.8</p>
                <p>Mediana: 7.0</p>
                <p>Moda: 7.0</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Medidas de Dispersión</h4>
              <div className="space-y-1 text-sm">
                <p>Desviación Estándar: 1.56</p>
                <p>Varianza: 2.43</p>
                <p>Rango: 6.0</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Indicadores de Consenso</h4>
              <div className="space-y-1 text-sm">
                <p>Alpha de Cronbach: 0.89</p>
                <p>Kappa de Cohen: 0.73</p>
                <p>ICC: 0.82</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsensusAnalysis;
