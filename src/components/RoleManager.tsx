import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useRoles, UserRole } from '@/hooks/useRoles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Shield, Plus, Trash2 } from 'lucide-react';

interface UserProfile {
  user_id: string;
  email: string;
  display_name: string;
  roles: UserRole[];
}

export const RoleManager: React.FC = () => {
  const { isAdmin } = useRoles();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('expert');

  useEffect(() => {
    if (isAdmin()) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      // Get profiles with their roles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, email, display_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        return;
      }

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        return;
      }

      // Combine profiles with their roles
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        roles: userRoles?.filter(ur => ur.user_id === profile.user_id).map(ur => ur.role as UserRole) || []
      })) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        toast.error(`Error asignando rol: ${error.message}`);
        return;
      }

      toast.success(`Rol ${role} asignado exitosamente`);
      await fetchUsers();
    } catch (error) {
      toast.error('Error asignando rol');
    }
  };

  const handleRemoveRole = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        toast.error(`Error removiendo rol: ${error.message}`);
        return;
      }

      toast.success(`Rol ${role} removido exitosamente`);
      await fetchUsers();
    } catch (error) {
      toast.error('Error removiendo rol');
    }
  };

  const handleInviteUser = async () => {
    if (!newUserEmail.trim()) {
      toast.error('Por favor ingrese un email válido');
      return;
    }

    try {
      // First create/invite the user through Supabase Auth
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(newUserEmail, {
        data: { role: newUserRole }
      });

      if (error) {
        toast.error(`Error invitando usuario: ${error.message}`);
        return;
      }

      toast.success('Usuario invitado exitosamente');
      setNewUserEmail('');
      await fetchUsers();
    } catch (error) {
      toast.error('Error invitando usuario');
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'expert': return 'secondary';
      default: return 'outline';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor';
      case 'expert': return 'Experto';
      default: return role;
    }
  };

  if (!isAdmin()) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tiene permisos para acceder a la gestión de roles.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestión de Roles de Usuario
          </CardTitle>
          <CardDescription>
            Administre los roles y permisos de los usuarios del sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Email del usuario"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
            />
            <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expert">Experto</SelectItem>
                <SelectItem value="manager">Gestor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInviteUser} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Invitar Usuario
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuarios del Sistema
          </CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados y sus roles asignados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.display_name || 'Sin nombre'}</p>
                        <p className="text-sm text-muted-foreground">{user.user_id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge key={role} variant={getRoleBadgeVariant(role)}>
                              {getRoleLabel(role)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select onValueChange={(role) => handleAssignRole(user.user_id, role as UserRole)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Asignar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="expert">Experto</SelectItem>
                            <SelectItem value="manager">Gestor</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {user.roles.map((role) => (
                          <Button
                            key={role}
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveRole(user.user_id, role)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="h-3 w-3" />
                            {getRoleLabel(role)}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};