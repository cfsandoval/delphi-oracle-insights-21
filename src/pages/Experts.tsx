import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRoles } from '@/hooks/useRoles';
import { ExpertManagement } from '@/components/ExpertManagement';
import { RoleManager } from '@/components/RoleManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

export default function Experts() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isManager, isLoading: rolesLoading } = useRoles();

  const handleSetActiveView = (view: string) => {
    navigate('/');
  };

  if (authLoading || rolesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Only admins and managers can access expert management
  if (!isAdmin() && !isManager()) {
    return (
      <div className="min-h-screen bg-background">
        <Header activeView="experts" setActiveView={handleSetActiveView} />
        <main className="container mx-auto p-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>No tiene permisos para acceder a esta sección.</p>
                <p className="text-sm mt-2">Contacte al administrador para obtener los permisos necesarios.</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeView="experts" setActiveView={handleSetActiveView} />
      <main className="container mx-auto p-6">
        <Tabs defaultValue="experts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="experts">Gestión de Expertos</TabsTrigger>
            {isAdmin() && <TabsTrigger value="roles">Gestión de Roles</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="experts">
            <ExpertManagement />
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="roles">
              <RoleManager />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}