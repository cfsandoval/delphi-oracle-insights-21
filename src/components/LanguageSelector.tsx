
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-white" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-20 bg-white/20 border-white/30 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">ES</SelectItem>
          <SelectItem value="en">EN</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
