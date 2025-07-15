import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Users, FileText, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const StudyPreview: React.FC = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  // Mock data for preview - en producción vendría de la base de datos
  const study = {
    id: studyId,
    title: language === 'es' ? 'Estudio Delphi: Futuro de la Inteligencia Artificial' : 'Delphi Study: Future of Artificial Intelligence',
    description: language === 'es' 
      ? 'Este estudio tiene como objetivo evaluar las tendencias futuras y el impacto de la inteligencia artificial en diversos sectores industriales. Su experiencia es fundamental para obtener perspectivas valiosas.'
      : 'This study aims to assess future trends and the impact of artificial intelligence across various industrial sectors. Your expertise is crucial for obtaining valuable insights.',
    estimatedDuration: '15-20 minutos',
    numberOfRounds: '3 rondas',
    expertiseArea: 'Inteligencia Artificial',
    questions: [
      {
        id: 1,
        text: language === 'es' 
          ? '¿Cuál considera que será el impacto de la IA en el sector salud en los próximos 5 años?'
          : 'What do you consider will be the impact of AI in the healthcare sector in the next 5 years?',
        type: 'likert',
        scale: 5
      },
      {
        id: 2,
        text: language === 'es'
          ? 'Enumere las tres principales ventajas de implementar IA en procesos empresariales'
          : 'List the three main advantages of implementing AI in business processes',
        type: 'open'
      },
      {
        id: 3,
        text: language === 'es'
          ? '¿Qué nivel de preparación considera que tienen las empresas para adoptar IA?'
          : 'What level of readiness do you think companies have to adopt AI?',
        type: 'multiple_choice',
        options: [
          language === 'es' ? 'Muy preparadas' : 'Very prepared',
          language === 'es' ? 'Moderadamente preparadas' : 'Moderately prepared',
          language === 'es' ? 'Poco preparadas' : 'Poorly prepared',
          language === 'es' ? 'No preparadas' : 'Not prepared'
        ]
      }
    ]
  };

  const handleStartStudy = () => {
    navigate(`/study/${studyId}/participate`);
  };

  const renderLikertScale = (scale: number) => (
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-muted-foreground">
        {language === 'es' ? 'Totalmente en desacuerdo' : 'Strongly disagree'}
      </span>
      <div className="flex gap-2">
        {Array.from({ length: scale }, (_, i) => (
          <div key={i} className="w-8 h-8 border-2 border-muted rounded-full flex items-center justify-center text-sm">
            {i + 1}
          </div>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        {language === 'es' ? 'Totalmente de acuerdo' : 'Strongly agree'}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'es' ? 'Volver' : 'Back'}
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{language === 'es' ? 'Vista Previa del Estudio' : 'Study Preview'}</h1>
          <p className="text-muted-foreground">
            {language === 'es' 
              ? 'Revise los detalles del estudio antes de participar'
              : 'Review the study details before participating'
            }
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Study Information */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{study.title}</CardTitle>
                <CardDescription className="mt-2">{study.description}</CardDescription>
              </div>
              <Badge variant="secondary">
                {language === 'es' ? 'Vista Previa' : 'Preview'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{study.estimatedDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{study.numberOfRounds}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{study.expertiseArea}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {language === 'es' ? 'Preguntas del Estudio' : 'Study Questions'}
            </CardTitle>
            <CardDescription>
              {language === 'es' 
                ? 'Las siguientes preguntas aparecerán en el cuestionario real'
                : 'The following questions will appear in the actual questionnaire'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {study.questions.map((question, index) => (
              <div key={question.id}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      {index + 1}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{question.text}</p>
                      
                      {question.type === 'likert' && renderLikertScale(question.scale)}
                      
                      {question.type === 'open' && (
                        <div className="mt-2">
                          <div className="w-full h-20 border-2 border-dashed border-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">
                              {language === 'es' ? 'Área de respuesta abierta' : 'Open response area'}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {question.type === 'multiple_choice' && (
                        <div className="mt-2 space-y-2">
                          {question.options?.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-muted rounded-full"></div>
                              <span className="text-sm">{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < study.questions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">
                  {language === 'es' ? '¿Listo para comenzar?' : 'Ready to start?'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'es' 
                    ? 'Al continuar, iniciará la primera ronda del estudio Delphi'
                    : 'By continuing, you will start the first round of the Delphi study'
                  }
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigate(-1)}>
                  {language === 'es' ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button onClick={handleStartStudy}>
                  {language === 'es' ? 'Comenzar Estudio' : 'Start Study'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};