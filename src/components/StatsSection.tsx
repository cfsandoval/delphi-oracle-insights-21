
import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  const stats = [
    { label: "Estudios Activos", value: "12", trend: "+3 esta semana" },
    { label: "Expertos Participando", value: "48", trend: "+8 nuevos" },
    { label: "Consenso Promedio", value: "78%", trend: "+5% vs anterior" },
    { label: "Rondas Completadas", value: "34", trend: "6 en progreso" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="gradient-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-gray-600">{stat.label}</p>
            <p className="text-sm text-emerald-600 mt-1">{stat.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;
