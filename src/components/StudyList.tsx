
import { useState } from "react";
import { Study } from "@/types/study";
import { useStudies } from "@/hooks/useStudies";
import StudyCard from "./StudyCard";
import StudyFilters from "./StudyFilters";
import StudyEmptyState from "./StudyEmptyState";
import { useLanguage } from "@/contexts/LanguageContext";

interface StudyListProps {
  onSelectStudy: (study: Study) => void;
}

const StudyList = ({ onSelectStudy }: StudyListProps) => {
  const { studies } = useStudies();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethodology, setFilterMethodology] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const filteredStudies = studies.filter(study => {
    const matchesSearch = study.title[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
                         study.description[language].toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || study.status === filterStatus;
    const matchesMethodology = filterMethodology === "all" || study.methodology === filterMethodology;
    const matchesCategory = filterCategory === "all" || study.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesMethodology && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <StudyFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterMethodology={filterMethodology}
        setFilterMethodology={setFilterMethodology}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredStudies.map((study) => (
          <StudyCard
            key={study.id}
            study={study}
            onSelectStudy={onSelectStudy}
          />
        ))}
      </div>

      {filteredStudies.length === 0 && <StudyEmptyState />}
    </div>
  );
};

export default StudyList;
