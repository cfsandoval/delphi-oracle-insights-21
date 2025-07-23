import React, { useState } from 'react';
import { Study } from '@/types/study';
import StudyCard from './StudyCard';
import StudyFilters from './StudyFilters';
import StudyEmptyState from './StudyEmptyState';
import { FeedbackTooltip } from './FeedbackTooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, Globe } from 'lucide-react';
import { useSupabaseStudies } from '@/hooks/useSupabaseStudies';

interface StudyListWithSectionsProps {
  onSelectStudy: (study: Study) => void;
}

const StudyListWithSections: React.FC<StudyListWithSectionsProps> = ({ onSelectStudy }) => {
  const { studies, isLoading } = useSupabaseStudies();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodologyFilter, setMethodologyFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filterStudies = (studyList: Study[]) => {
    return studyList.filter(study => {
      const matchesSearch = study.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.title.es.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.description.es.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || study.status === statusFilter;
      const matchesMethodology = methodologyFilter === 'all' || study.methodology === methodologyFilter;
      const matchesCategory = categoryFilter === 'all' || study.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesMethodology && matchesCategory;
    });
  };

  // Separar estudios públicos y privados
  const privateStudies = filterStudies(studies.filter(study => !study.isPublic));
  const publicStudies = filterStudies(studies.filter(study => study.isPublic));

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudyFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={statusFilter}
        setFilterStatus={setStatusFilter}
        filterMethodology={methodologyFilter}
        setFilterMethodology={setMethodologyFilter}
        filterCategory={categoryFilter}
        setFilterCategory={setCategoryFilter}
      />

      <Tabs defaultValue="private" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="private" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            My Studies ({privateStudies.length})
          </TabsTrigger>
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Public Studies ({publicStudies.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="private" className="space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Private Studies
            </h3>
            <p className="text-gray-600 mb-4">
              Studies that only you can view and manage.
            </p>
            
            {privateStudies.length > 0 ? (
              <div className="grid gap-4">
                {privateStudies.map(study => (
                  <StudyCard
                    key={study.id}
                    study={study}
                    onSelectStudy={onSelectStudy}
                  />
                ))}
              </div>
            ) : (
              <StudyEmptyState />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="public" className="space-y-4 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Public Studies
            </h3>
            <p className="text-gray-600 mb-4">
              Studies that are publicly visible and can be viewed by anyone.
            </p>
            
            {publicStudies.length > 0 ? (
              <div className="grid gap-4">
                {publicStudies.map(study => (
                  <StudyCard
                    key={study.id}
                    study={study}
                    onSelectStudy={onSelectStudy}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Public Studies Found</h3>
                <p className="text-gray-500">
                  {searchTerm || statusFilter !== 'all' || methodologyFilter !== 'all' || categoryFilter !== 'all'
                    ? 'No public studies match your current filters.'
                    : 'No public studies available at the moment.'}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <FeedbackTooltip pageName="Study List" />
    </div>
  );
};

export default StudyListWithSections;