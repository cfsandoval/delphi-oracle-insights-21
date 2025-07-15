
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, Target, Plus, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useStudies } from "@/hooks/useStudies";
import { Study } from "@/types/study";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreateStudyProps {
  methodology?: 'traditional' | 'realtime';
  onStudyCreated: () => void;
  onBack?: () => void;
}

const CreateStudy = ({ methodology, onStudyCreated, onBack }: CreateStudyProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [studyData, setStudyData] = useState({
    title: { es: "", en: "" },
    description: { es: "", en: "" },
    methodology: methodology || "" as "traditional" | "realtime" | "",
    rounds: 3,
    participants: [],
    questions: [],
    duration: ""
  });
  const [newParticipant, setNewParticipant] = useState({ 
    name: "", 
    email: "", 
    expertise: "",
    institution: "",
    region: ""
  });
  const [newQuestion, setNewQuestion] = useState({ text: "", type: "open", options: "" });
  const { toast } = useToast();
  const { createStudy } = useStudies();

  const steps = [
    { id: 1, title: "Basic Information", icon: Target },
    { id: 2, title: "Configuration", icon: Clock },
    { id: 3, title: "Expert Panel", icon: Users },
    { id: 4, title: "Questions", icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateStudy();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      setStudyData({
        ...studyData,
        participants: [...studyData.participants, { ...newParticipant, id: Date.now() }]
      });
      setNewParticipant({ name: "", email: "", expertise: "", institution: "", region: "" });
    }
  };

  const removeParticipant = (id: number) => {
    setStudyData({
      ...studyData,
      participants: studyData.participants.filter(p => p.id !== id)
    });
  };

  const addQuestion = () => {
    if (newQuestion.text) {
      setStudyData({
        ...studyData,
        questions: [...studyData.questions, { ...newQuestion, id: Date.now() }]
      });
      setNewQuestion({ text: "", type: "open", options: "" });
    }
  };

  const removeQuestion = (id: number) => {
    setStudyData({
      ...studyData,
      questions: studyData.questions.filter(q => q.id !== id)
    });
  };

  const handleCreateStudy = () => {
    const newStudy = createStudy({
      title: studyData.title,
      description: studyData.description,
      methodology: studyData.methodology as "traditional" | "realtime",
      status: "draft" as const,
      experts: studyData.participants.length,
      rounds: studyData.methodology === "traditional" ? studyData.rounds : 1,
      currentRound: 0,
      consensus: 0
    });

    toast({
      title: "Study created successfully!",
      description: `The study "${studyData.title.en}" has been saved and is ready to begin.`,
    });
    onStudyCreated();
  };

  const progress = (currentStep / 4) * 100;

  const colombianRegions = [
    "Caribbean Region", "Pacific Region", "Andean Region", "Orinoquía Region", 
    "Amazon Region", "Bogotá D.C.", "Antioquia", "Valle del Cauca", "Santander"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {onBack && (
        <Button variant="outline" onClick={onBack} className="mb-4">
          ← {t('common.back')}
        </Button>
      )}
      
      {/* Progress Header */}
      <Card className="gradient-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Create New Delphi Study</CardTitle>
              <CardDescription>Configure your study step by step</CardDescription>
              {methodology && (
                <div className="mt-2">
                  <Badge className={methodology === 'traditional' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}>
                    {methodology === 'traditional' ? t('study.traditional') : t('study.realtime')}
                  </Badge>
                </div>
              )}
            </div>
            <Badge variant="outline">Step {currentStep} of 4</Badge>
          </div>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between mt-2">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full ${currentStep >= step.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <step.icon className={`h-4 w-4 ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>
                  <span className={`text-sm ${currentStep >= step.id ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="gradient-card">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Basic Study Information</h3>
                <p className="text-gray-600">Define the fundamental aspects of your territorial research</p>
                {methodology === 'traditional' && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-amber-800 mb-1">Reminder: First Round</h4>
                        <p className="text-amber-700 text-sm">
                          This traditional Delphi study will begin with <strong>open questions</strong> in the first round 
                          to capture the full diversity of expert perspectives.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title-en">Study Title (English)</Label>
                  <Input
                    id="title-en"
                    placeholder="e.g., Sustainable Development Priorities - Pacific Region"
                    value={studyData.title.en}
                    onChange={(e) => setStudyData({...studyData, title: {...studyData.title, en: e.target.value}})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="title-es">Study Title (Spanish)</Label>
                  <Input
                    id="title-es"
                    placeholder="ej: Prioridades de Desarrollo Sostenible - Región Pacífica"
                    value={studyData.title.es}
                    onChange={(e) => setStudyData({...studyData, title: {...studyData.title, es: e.target.value}})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description-en">Description (English)</Label>
                  <Textarea
                    id="description-en"
                    placeholder="Describe the objectives, geographical and sectoral scope of your Delphi study..."
                    rows={4}
                    value={studyData.description.en}
                    onChange={(e) => setStudyData({...studyData, description: {...studyData.description, en: e.target.value}})}
                  />
                </div>

                <div>
                  <Label htmlFor="description-es">Description (Spanish)</Label>
                  <Textarea
                    id="description-es"
                    placeholder="Describa los objetivos, alcance geográfico y sectorial de su estudio Delphi..."
                    rows={4}
                    value={studyData.description.es}
                    onChange={(e) => setStudyData({...studyData, description: {...studyData.description, es: e.target.value}})}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && methodology && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Methodology Configuration</h3>
                <p className="text-gray-600">{methodology === 'traditional' ? 'Traditional Delphi' : 'Real-time Delphi'} study parameters</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {methodology === "traditional" ? t('study.traditional') : t('study.realtime')}
                </h4>
                <p className="text-blue-700 text-sm">
                  {methodology === "traditional" 
                    ? `Classic methodology with ${studyData.rounds} sequential rounds starting with open questions. Ideal for deep territorial studies with detailed statistical analysis.`
                    : `Methodology adapted for rapid territorial decisions with immediate feedback during ${studyData.duration}. Perfect for urgent consensus on public policies.`
                  }
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Methodology</Label>
                  <Select value={studyData.methodology} onValueChange={(value) => setStudyData({...studyData, methodology: value as "traditional" | "realtime"})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select methodology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="traditional">Traditional Delphi</SelectItem>
                      <SelectItem value="realtime">Real-time Delphi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {studyData.methodology === "traditional" && (
                  <>
                    <div>
                      <Label htmlFor="rounds">Number of Rounds</Label>
                      <Select value={studyData.rounds.toString()} onValueChange={(value) => setStudyData({...studyData, rounds: parseInt(value)})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 Rounds</SelectItem>
                          <SelectItem value="3">3 Rounds</SelectItem>
                          <SelectItem value="4">4 Rounds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800 mb-1">Important: First Round</h4>
                          <p className="text-amber-700 text-sm">
                            The first round of traditional Delphi uses <strong>open questions</strong> to 
                            capture the diversity of expert perspectives. Subsequent rounds will 
                            be based on the analysis of these initial responses.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {studyData.methodology === "realtime" && (
                  <div>
                    <Label htmlFor="duration">Session Duration</Label>
                    <Select value={studyData.duration} onValueChange={(value) => setStudyData({...studyData, duration: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30min">30 minutes</SelectItem>
                        <SelectItem value="60min">1 hour</SelectItem>
                        <SelectItem value="90min">1.5 hours</SelectItem>
                        <SelectItem value="120min">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Expert Panel</h3>
                <p className="text-gray-600">Invite territorial and sectoral experts who will participate in the study</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="participantName">Expert Name</Label>
                    <Input
                      id="participantName"
                      placeholder="Full name"
                      value={newParticipant.name}
                      onChange={(e) => setNewParticipant({...newParticipant, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="participantEmail">Email</Label>
                    <Input
                      id="participantEmail"
                      type="email"
                      placeholder="email@example.com"
                      value={newParticipant.email}
                      onChange={(e) => setNewParticipant({...newParticipant, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="participantExpertise">Area of Expertise</Label>
                    <Input
                      id="participantExpertise"
                      placeholder="e.g., Territorial Development, Public Policy"
                      value={newParticipant.expertise}
                      onChange={(e) => setNewParticipant({...newParticipant, expertise: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="participantInstitution">Institution</Label>
                    <Input
                      id="participantInstitution"
                      placeholder="e.g., University, Municipality, NGO"
                      value={newParticipant.institution}
                      onChange={(e) => setNewParticipant({...newParticipant, institution: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="participantRegion">Region/Department</Label>
                    <Select value={newParticipant.region} onValueChange={(value) => setNewParticipant({...newParticipant, region: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {colombianRegions.map((region) => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button onClick={addParticipant} className="w-full" disabled={!newParticipant.name || !newParticipant.email}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Expert
                </Button>

                {studyData.participants.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Added Experts ({studyData.participants.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {studyData.participants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-gray-600">{participant.email}</p>
                            <p className="text-sm text-gray-500">
                              {participant.expertise} • {participant.institution} • {participant.region}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeParticipant(participant.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold mb-2">Study Questions</h3>
                <p className="text-gray-600">Configure the questions that experts will evaluate</p>
                {studyData.methodology === "traditional" && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-amber-700 text-sm">
                      <strong>Reminder:</strong> For traditional Delphi, start with open questions in the first round
                    </p>
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="questionText">Question</Label>
                  <Textarea
                    id="questionText"
                    placeholder="Write the question that experts will evaluate..."
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label>Response Type</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open Response (Recommended for R1)</SelectItem>
                      <SelectItem value="scale">Numerical Scale (1-10)</SelectItem>
                      <SelectItem value="likert">Likert Scale</SelectItem>
                      <SelectItem value="multiple">Multiple Choice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(newQuestion.type === "multiple" || newQuestion.type === "likert") && (
                  <div>
                    <Label htmlFor="questionOptions">Options (comma separated)</Label>
                    <Input
                      id="questionOptions"
                      placeholder="Option 1, Option 2, Option 3..."
                      value={newQuestion.options}
                      onChange={(e) => setNewQuestion({...newQuestion, options: e.target.value})}
                    />
                  </div>
                )}
                
                <Button onClick={addQuestion} className="w-full" disabled={!newQuestion.text}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>

                {studyData.questions.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Added Questions ({studyData.questions.length})</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {studyData.questions.map((question, index) => (
                        <div key={question.id} className="flex items-start justify-between p-3 bg-white/50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium">Question {index + 1}</p>
                            <p className="text-sm text-gray-600 mt-1">{question.text}</p>
                            <Badge variant="outline" className="mt-2">
                              {question.type === "open" ? "Open" : 
                               question.type === "scale" ? "Scale 1-10" :
                               question.type === "likert" ? "Likert" : "Multiple"}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          {t('common.previous')}
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            (currentStep === 1 && (!studyData.title.en || !studyData.description.en)) ||
            (currentStep === 2 && !studyData.methodology) ||
            (currentStep === 3 && studyData.participants.length === 0) ||
            (currentStep === 4 && studyData.questions.length === 0)
          }
        >
          {currentStep === 4 ? t('common.create') + " Study" : t('common.next')}
        </Button>
      </div>
    </div>
  );
};

export default CreateStudy;
