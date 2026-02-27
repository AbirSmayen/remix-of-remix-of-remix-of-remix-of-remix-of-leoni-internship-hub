import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, Factory, Globe, Zap, Users, BarChart3, Shield, Award, Target, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-leoni.jpg";

const Home = () => {
  const [presentationOpen, setPresentationOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useTranslation();

  const companySlides = [
    { title: t("home.slides.aboutLeoni"), subtitle: t("home.slides.globalLeader"), content: t("home.slides.aboutContent"), stats: [{ label: t("home.slides.employees"), value: "95,000+" }, { label: t("home.slides.countries"), value: "26" }, { label: t("home.slides.revenue"), value: "€5.1B" }], icon: Globe },
    { title: t("home.slides.leoniTunisia"), subtitle: t("home.slides.innovationHub"), content: t("home.slides.tunisiaContent"), stats: [{ label: t("home.slides.sitesTunisia"), value: "8" }, { label: t("home.slides.employeesTN"), value: "18,000+" }, { label: t("home.slides.productionLines"), value: "200+" }], icon: Factory },
    { title: t("home.slides.ourVision"), subtitle: t("home.slides.drivingInnovation"), content: t("home.slides.visionContent"), stats: [{ label: t("home.slides.rdCenters"), value: "12" }, { label: t("home.slides.patents"), value: "1,200+" }, { label: t("home.slides.evProjects"), value: "50+" }], icon: Target },
    { title: t("home.slides.internshipProgram"), subtitle: t("home.slides.shapingLeaders"), content: t("home.slides.programContent"), stats: [{ label: t("home.slides.internsYear"), value: "200+" }, { label: t("home.slides.hiringRate"), value: "35%" }, { label: t("home.slides.departments"), value: "15+" }], icon: Award },
  ];

  const features = [
    { icon: Shield, title: t("home.features.qrAttendance"), description: t("home.features.qrAttendanceDesc") },
    { icon: Award, title: t("home.features.autoCertificates"), description: t("home.features.autoCertificatesDesc") },
    { icon: Zap, title: t("home.features.smartRecruitment"), description: t("home.features.smartRecruitmentDesc") },
    { icon: Users, title: t("home.features.progressTracking"), description: t("home.features.progressTrackingDesc") },
    { icon: BarChart3, title: t("home.features.analytics"), description: t("home.features.analyticsDesc") },
    { icon: Target, title: t("home.features.eventsManagement"), description: t("home.features.eventsManagementDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="LEONI Factory" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
        </div>
        <div className="relative container mx-auto px-6 py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card/50 backdrop-blur-sm text-sm text-muted-foreground mb-8">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              {t("home.badge")}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight max-w-4xl mx-auto">
              {t("home.title")}{" "}
              <span className="text-primary">{t("home.titleHighlight")}</span> {t("home.titleEnd")}
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">{t("home.subtitle")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth" className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                {t("home.getStarted")} <ArrowRight className="h-4 w-4" />
              </Link>
              <button onClick={() => setPresentationOpen(true)} className="px-8 py-3.5 bg-card border rounded-xl font-semibold text-foreground flex items-center gap-2 hover:bg-secondary transition-all">
                <Factory className="h-4 w-4" /> {t("home.discoverLeoni")}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 bg-background scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("nav.about")}</h2>
            <p className="text-muted-foreground leading-relaxed">
              LEONI is a global provider of products, solutions and services for energy and data management in the automotive industry.
              This platform streamlines internship lifecycle management—from applications to evaluation and best projects selection.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {[
              { label: "Internship tracking", value: "End-to-end" },
              { label: "Evaluation flow", value: "Structured" },
              { label: "Best projects", value: "Transparent" },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border shadow-sm p-6">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground mt-2">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-card" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">{t("home.featuresTitle")}</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("home.featuresSubtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-xl border bg-background hover-scale transition-all duration-300 group">
                <div className="p-3 rounded-lg bg-primary/5 w-fit mb-4 group-hover:bg-primary/10 transition-colors"><f.icon className="h-6 w-6 text-primary" /></div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{t("home.ctaTitle")}</h2>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">{t("home.ctaSubtitle")}</p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-3.5 bg-card text-foreground rounded-xl font-semibold hover:bg-secondary transition-all">
            {t("nav.signIn")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 bg-card scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{t("nav.contact")}</h2>
              <p className="text-muted-foreground">
                Get in touch with the HR team for internship inquiries and support.
              </p>
            </div>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
            >
              {t("nav.signIn")}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-xl border p-6">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold text-foreground mt-2">internships@leoni.com</p>
            </div>
            <div className="bg-background rounded-xl border p-6">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-semibold text-foreground mt-2">+216 70 000 000</p>
            </div>
            <div className="bg-background rounded-xl border p-6">
              <p className="text-xs text-muted-foreground">Office</p>
              <p className="text-sm font-semibold text-foreground mt-2">LEONI Tunisia</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Company Presentation Modal */}
      <AnimatePresence>
        {presentationOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setPresentationOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{t("home.companyPresentation")}</h3>
                  <p className="text-sm text-muted-foreground">{currentSlide + 1} / {companySlides.length}</p>
                </div>
                <button onClick={() => setPresentationOpen(false)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="p-8">
                  {(() => { const slide = companySlides[currentSlide]; const Icon = slide.icon; return (
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="h-7 w-7 text-primary" /></div>
                        <div><h4 className="text-2xl font-bold text-foreground">{slide.title}</h4><p className="text-sm text-primary font-medium">{slide.subtitle}</p></div>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-8">{slide.content}</p>
                      <div className="grid grid-cols-3 gap-4">
                        {slide.stats.map((stat, i) => (<div key={i} className="bg-secondary/50 rounded-xl p-4 text-center"><p className="text-2xl font-bold text-primary">{stat.value}</p><p className="text-xs text-muted-foreground mt-1">{stat.label}</p></div>))}
                      </div>
                    </div>
                  ); })()}
                </motion.div>
              </AnimatePresence>
              <div className="flex items-center justify-between p-6 border-t">
                <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} disabled={currentSlide === 0} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-30">
                  <ChevronLeft className="h-4 w-4" /> {t("home.previous")}
                </button>
                <div className="flex gap-1.5">
                  {companySlides.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-6 bg-primary" : "w-2 bg-muted-foreground/30"}`} />))}
                </div>
                <button onClick={() => setCurrentSlide(Math.min(companySlides.length - 1, currentSlide + 1))} disabled={currentSlide === companySlides.length - 1} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-30">
                  {t("home.next")} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
