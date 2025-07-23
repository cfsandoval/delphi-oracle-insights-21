import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, FileText, ExternalLink, Upload, BookOpen, HelpCircle } from "lucide-react";

const documentSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  category: z.enum(['tool_instructions', 'methodology']),
  type: z.enum(['pdf', 'url', 'text']),
  external_url: z.string().url().optional().or(z.literal('')),
  content: z.string().optional(),
  tags: z.string().optional(),
  language: z.enum(['es', 'en'])
});

type DocumentFormData = z.infer<typeof documentSchema>;

const Documentation = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'tool_instructions',
      type: 'text',
      external_url: '',
      content: '',
      tags: '',
      language: 'es'
    }
  });

  // Fetch documents
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData & { file_url?: string }) => {
      const { data: result, error } = await supabase
        .from('documents')
        .insert({
          title: data.title,
          description: data.description,
          category: data.category,
          type: data.type,
          file_url: data.file_url,
          external_url: data.external_url,
          content: data.content,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          language: data.language,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setIsAddDialogOpen(false);
      form.reset();
      setSelectedFile(null);
      toast({
        title: "Documento agregado",
        description: "El documento se ha agregado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "No se pudo agregar el documento.",
        variant: "destructive",
      });
    }
  });

  const handleFileUpload = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const onSubmit = async (data: DocumentFormData) => {
    try {
      let fileUrl = '';
      
      if (data.type === 'pdf' && selectedFile) {
        fileUrl = await handleFileUpload(selectedFile);
      }

      await addDocumentMutation.mutateAsync({
        ...data,
        file_url: fileUrl,
        external_url: data.external_url || undefined,
        content: data.content || undefined
      });
    } catch (error) {
      console.error('Error submitting document:', error);
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === 'tool_instructions' ? <HelpCircle className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />;
  };

  const getCategoryLabel = (category: string) => {
    return category === 'tool_instructions' ? 'Instructivos de Uso' : 'Metodología';
  };

  const toolInstructions = documents.filter(doc => doc.category === 'tool_instructions');
  const methodology = documents.filter(doc => doc.category === 'methodology');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Documentación</h1>
          <p className="text-muted-foreground">
            Instructivos de uso y documentación metodológica
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Documento</DialogTitle>
              <DialogDescription>
                Agrega un nuevo documento a la biblioteca de documentación
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título del documento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción del documento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="tool_instructions">Instructivos de Uso</SelectItem>
                            <SelectItem value="methodology">Metodología</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Texto</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="url">URL Externa</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('type') === 'pdf' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Archivo PDF</label>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </div>
                )}

                {form.watch('type') === 'url' && (
                  <FormField
                    control={form.control}
                    name="external_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Externa</FormLabel>
                        <FormControl>
                          <Input placeholder="https://ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch('type') === 'text' && (
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Contenido del documento" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Etiquetas</FormLabel>
                      <FormControl>
                        <Input placeholder="etiqueta1, etiqueta2, etiqueta3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separa las etiquetas con comas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={addDocumentMutation.isPending}>
                    {addDocumentMutation.isPending ? 'Guardando...' : 'Guardar'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tool_instructions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tool_instructions" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Instructivos de Uso
          </TabsTrigger>
          <TabsTrigger value="methodology" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Metodología
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tool_instructions" className="space-y-4">
          <div className="grid gap-4">
            {toolInstructions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay instructivos de uso disponibles. Agrega el primero.
                  </p>
                </CardContent>
              </Card>
            ) : (
              toolInstructions.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getCategoryIcon(doc.category)}
                          {doc.title}
                        </CardTitle>
                        {doc.description && (
                          <CardDescription>{doc.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {getCategoryLabel(doc.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {doc.content && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {doc.content.substring(0, 200)}...
                      </p>
                    )}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {doc.external_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.external_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver URL
                          </a>
                        </Button>
                      )}
                      {doc.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="methodology" className="space-y-4">
          <div className="grid gap-4">
            {methodology.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No hay documentación metodológica disponible. Agrega la primera.
                  </p>
                </CardContent>
              </Card>
            ) : (
              methodology.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getCategoryIcon(doc.category)}
                          {doc.title}
                        </CardTitle>
                        {doc.description && (
                          <CardDescription>{doc.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary">
                        {getCategoryLabel(doc.category)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {doc.content && (
                      <p className="text-sm text-muted-foreground mb-4">
                        {doc.content.substring(0, 200)}...
                      </p>
                    )}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {doc.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {doc.external_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.external_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Ver URL
                          </a>
                        </Button>
                      )}
                      {doc.file_url && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver PDF
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documentation;