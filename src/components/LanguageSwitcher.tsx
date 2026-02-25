import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === i18n.language) || languages[0];

  const switchLang = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("leoni_lang", code);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-secondary transition-colors text-sm"
        title="Switch language"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline text-xs font-medium text-muted-foreground">{current.code.toUpperCase()}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-10 w-36 bg-popover border rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLang(lang.code)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors hover:bg-secondary ${
                    i18n.language === lang.code ? "bg-primary/5 font-medium text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
