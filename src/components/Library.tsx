
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, FileText, HelpCircle, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { libraryItems, LibraryItem } from "@/data/libraryData";

const Library = () => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         item.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesLanguage = item.language === language;
    
    return matchesSearch && matchesType && matchesLanguage;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'book':
        return <BookOpen className="h-4 w-4" />;
      case 'guide':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-100 text-blue-800';
      case 'book':
        return 'bg-green-100 text-green-800';
      case 'guide':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {t('library.title')}
          </CardTitle>
          <CardDescription>
            {t('library.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t('library.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterType} onValueChange={setFilterType} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">{t('library.filter.all')}</TabsTrigger>
                <TabsTrigger value="articles">{t('library.filter.articles')}</TabsTrigger>
                <TabsTrigger value="books">{t('library.filter.books')}</TabsTrigger>
                <TabsTrigger value="guides">{t('library.filter.guides')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                      <CardDescription>
                        {item.authors.join(', ')} ({item.year})
                      </CardDescription>
                    </div>
                    <Badge className={`ml-2 ${getTypeColor(item.type)}`}>
                      <div className="flex items-center gap-1">
                        {getTypeIcon(item.type)}
                        {item.type}
                      </div>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{item.abstract}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  {(item.url || item.doi) && (
                    <div className="flex gap-2">
                      {item.doi && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`https://doi.org/${item.doi}`} target="_blank" rel="noopener noreferrer">
                            DOI <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                      {item.url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Link <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron resultados para tu búsqueda.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Library;
