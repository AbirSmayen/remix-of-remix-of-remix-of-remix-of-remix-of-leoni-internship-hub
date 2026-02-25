import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-leoni-navy text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-2">LEONI</h3>
            <p className="text-sm text-white/50 mb-1">{t("footer.slogan")}</p>
            <p className="text-sm text-white/70 mt-4 max-w-sm leading-relaxed">{t("footer.description")}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t("footer.platform")}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li className="hover:text-white/90 cursor-pointer transition-colors">{t("footer.pfeBook")}</li>
              <li className="hover:text-white/90 cursor-pointer transition-colors">{t("footer.apply")}</li>
              <li className="hover:text-white/90 cursor-pointer transition-colors">{t("footer.dashboard")}</li>
              <li className="hover:text-white/90 cursor-pointer transition-colors">{t("footer.badgeSystem")}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white/90">{t("footer.contact")}</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>rh@leoni-tunisia.com</li>
              <li>+216 73 000 000</li>
              <li>Zone Industrielle, Sousse</li>
              <li>Tunisie</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-sm text-white/40">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
