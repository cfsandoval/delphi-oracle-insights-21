import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'manager' | 'expert';

export const useRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserRoles();
    } else {
      setRoles([]);
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserRoles = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      setRoles(data?.map(r => r.role as UserRole) || []);
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isManager = (): boolean => hasRole('manager') || hasRole('admin');
  const isExpert = (): boolean => hasRole('expert');

  const assignRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) {
        console.error('Error assigning role:', error);
        return false;
      }

      // Refresh roles if assigning to current user
      if (userId === user?.id) {
        await fetchUserRoles();
      }

      return true;
    } catch (error) {
      console.error('Error in assignRole:', error);
      return false;
    }
  };

  const removeRole = async (userId: string, role: UserRole): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        console.error('Error removing role:', error);
        return false;
      }

      // Refresh roles if removing from current user
      if (userId === user?.id) {
        await fetchUserRoles();
      }

      return true;
    } catch (error) {
      console.error('Error in removeRole:', error);
      return false;
    }
  };

  return {
    roles,
    isLoading,
    hasRole,
    isAdmin,
    isManager,
    isExpert,
    assignRole,
    removeRole,
    refreshRoles: fetchUserRoles
  };
};