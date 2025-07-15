import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const StudyParticipation: React.FC = () => {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<number, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - en producción vendría de la base de datos
  const study = {
    id: studyId,
    title: language === 'es' ? 'Estudio Delphi: Futuro de la Inteligencia Artificial' : 'Delphi Study: Future of Artificial Intelligence',
    round: 1,
    questions: [
      {
        id: 1,
        text: language === 'es' 
          ? '¿Cuál considera que será el impacto de la IA en el sector salud en los próximos 5 años?'
          : 'What do you consider will be the impact of AI in the healthcare sector in the next 5 years?',
        type: 'likert',
        scale: 5,
        required: true
      },
      {
        id: 2,
        text: language === 'es'
          ? 'Enumere las tres principales ventajas de implementar IA en procesos empresariales'
          : 'List the three main advantages of implementing AI in business processes',
        type: 'open',
        required: true
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
        ],
        required: true
      }
    ]
  };

  const currentQuestionData = study.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / study.questions.length) * 100;
  const isLastQuestion = currentQuestion === study.questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;

  const handleResponseChange = (value: any) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestionData.id]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionData.required && !responses[currentQuestionData.id]) {
      toast.error(language === 'es' ? 'Por favor responda la pregunta antes de continuar' : 'Please answer the question before continuing');
      return;
    }

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Aquí se enviarían las respuestas a la base de datos
      console.log('Submitting responses:', responses);
      
      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(language === 'es' ? 'Respuestas enviadas exitosamente' : 'Responses submitted successfully');
      navigate('/study-completed', { state: { studyTitle: study.title, round: study.round } });
    } catch (error) {
      toast.error(language === 'es' ? 'Error al enviar respuestas' : 'Error submitting responses');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderQuestion = () => {
    const response = responses[currentQuestionData.id];

    switch (currentQuestionData.type) {
      case 'likert':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {language === 'es' ? 'Totalmente en desacuerdo' : 'Strongly disagree'}
              </span>
              <span className="text-sm text-muted-foreground">
                {language === 'es' ? 'Totalmente de acuerdo' : 'Strongly agree'}
              </span>
            </div>
            <RadioGroup
              value={response?.toString()}
              onValueChange={(value) => handleResponseChange(parseInt(value))}
              className="flex justify-between"
            >
              {Array.from({ length: currentQuestionData.scale }, (_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <RadioGroupItem value={(i + 1).toString()} id={`scale-${i + 1}`} />
                  <Label htmlFor={`scale-${i + 1}`} className="text-sm">
                    {i + 1}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'open':
        return (
          <Textarea
            value={response || ''}
            onChange={(e) => handleResponseChange(e.target.value)}
            placeholder={language === 'es' ? 'Escriba su respuesta aquí...' : 'Write your answer here...'}
            className="min-h-[120px]"
          />
        );

      case 'multiple_choice':
        return (
          <RadioGroup
            value={response}
            onValueChange={handleResponseChange}
            className="space-y-3"
          >
            {currentQuestionData.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'es' ? 'Salir' : 'Exit'}
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{study.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">
              {language === 'es' ? `Ronda ${study.round}` : `Round ${study.round}`}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {language === 'es' 
                ? `Pregunta ${currentQuestion + 1} de ${study.questions.length}`
                : `Question ${currentQuestion + 1} of ${study.questions.length}`
              }
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{language === 'es' ? 'Progreso' : 'Progress'}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Badge variant="outline" className="mt-1">
                {currentQuestion + 1}
              </Badge>
              <div className="flex-1">
                <CardTitle className="text-lg leading-relaxed">
                  {currentQuestionData.text}
                  {currentQuestionData.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </CardTitle>
                {currentQuestionData.type === 'likert' && (
                  <CardDescription className="mt-2">
                    {language === 'es' 
                      ? 'Seleccione el nivel que mejor represente su opinión'
                      : 'Select the level that best represents your opinion'
                    }
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderQuestion()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstQuestion}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'es' ? 'Anterior' : 'Previous'}
              </Button>

              <div className="flex gap-2">
                {study.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index <= currentQuestion ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : isLastQuestion ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {isSubmitting 
                  ? (language === 'es' ? 'Enviando...' : 'Submitting...')
                  : isLastQuestion 
                    ? (language === 'es' ? 'Finalizar' : 'Finish')
                    : (language === 'es' ? 'Siguiente' : 'Next')
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudyParticipation;