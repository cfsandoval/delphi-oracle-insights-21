
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, BarChart3, Activity } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Users,
      title: "Gestión de Expertos",
      description: "Invita y coordina paneles de expertos de forma eficiente"
    },
    {
      icon: Target,
      title: "Múltiples Rondas",
      description: "Diseña rondas personalizadas con diferentes tipos de preguntas"
    },
    {
      icon: BarChart3,
      title: "Indicadores Automáticos",
      description: "Calcula consenso, estabilidad y convergencia automáticamente"
    },
    {
      icon: Activity,
      title: "Tiempo Real",
      description: "Implementa Delphi en tiempo real para decisiones rápidas"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <Card key={index} className="gradient-card hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="p-3 gradient-primary rounded-xl w-fit">
              <feature.icon className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-lg">{feature.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{feature.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturesSection;
