
import { Button } from "@/components/ui/button";
import { Lightbulb, Plus, LogOut, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import LanguageSelector from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Header = ({ activeView, setActiveView }: HeaderProps) => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="gradient-primary text-white shadow-lg">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Lightbulb className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t('header.title')}</h1>
              <p className="text-blue-100">{t('header.subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-2">
              <Button 
                variant={activeView === "dashboard" ? "secondary" : "ghost"}
                onClick={() => setActiveView("dashboard")}
                className="text-white hover:bg-white/20"
              >
                {t('header.dashboard')}
              </Button>
              <Button 
                variant={activeView === "studies" ? "secondary" : "ghost"}
                onClick={() => setActiveView("studies")}
                className="text-white hover:bg-white/20"
              >
                {t('header.studies')}
              </Button>
              <Button 
                variant={activeView === "library" ? "secondary" : "ghost"}
                onClick={() => setActiveView("library")}
                className="text-white hover:bg-white/20"
              >
                {t('header.library')}
              </Button>
              <Button 
                variant={activeView === "create" ? "secondary" : "ghost"}
                onClick={() => setActiveView("create")}
                className="text-white hover:bg-white/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('header.newStudy')}
              </Button>
            </nav>
            <div className="flex items-center space-x-4">
              <LanguageSelector />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <User className="h-4 w-4 mr-2" />
                      {user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('auth.signOut')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="secondary" size="sm">
                    {t('auth.signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
