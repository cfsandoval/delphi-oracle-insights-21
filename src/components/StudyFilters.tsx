
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface StudyFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterMethodology: string;
  setFilterMethodology: (methodology: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}

const StudyFilters = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterMethodology,
  setFilterMethodology,
  filterCategory,
  setFilterCategory
}: StudyFiltersProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar estudios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="draft">Borrador</SelectItem>
          <SelectItem value="active">Activo</SelectItem>
          <SelectItem value="paused">Pausado</SelectItem>
          <SelectItem value="completed">Completado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterMethodology} onValueChange={setFilterMethodology}>
        <SelectTrigger className="w-full lg:w-48">
          <SelectValue placeholder="Metodología" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas</SelectItem>
          <SelectItem value="traditional">Tradicional</SelectItem>
          <SelectItem value="realtime">Tiempo Real</SelectItem>
        </SelectContent>
      </Select>
      
      <div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="desarrollo territorial">Desarrollo Territorial</SelectItem>
            <SelectItem value="salud pública">Salud Pública</SelectItem>
            <SelectItem value="construcción de paz">Construcción de Paz</SelectItem>
            <SelectItem value="educación">Educación</SelectItem>
            <SelectItem value="medio ambiente">Medio Ambiente</SelectItem>
            <SelectItem value="política pública">Política Pública</SelectItem>
            <SelectItem value="economía">Economía</SelectItem>
            <SelectItem value="tecnología">Tecnología</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StudyFilters;
