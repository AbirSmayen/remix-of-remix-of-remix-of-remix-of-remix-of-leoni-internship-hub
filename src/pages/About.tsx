import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Cpu, Award, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* SECTION 1 – Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
          <div className="relative container mx-auto px-6 py-20 text-center">
            <motion.div {...fadeUp(0)}>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                About Our Internship Platform
              </h1>
              <p className="mt-4 text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                A modern, corporate-ready system designed to streamline internship operations from applications to evaluation and reporting.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 – Who We Are */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              <motion.div {...fadeUp(0)} className="bg-card rounded-2xl border shadow-sm p-8">
                <h2 className="text-2xl font-bold text-foreground">Who We Are</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  This internship management platform provides HR teams, supervisors, directors, and interns with a single
                  interface to manage key workflows—application review, submissions tracking, evaluations, and best projects
                  visibility—with a clean, consistent UI.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Built for clarity and speed, it reduces manual coordination, improves transparency, and supports better
                  talent decisions with structured data and modern dashboards.
                </p>
              </motion.div>

              <motion.div
                {...fadeUp(0.05)}
                className="bg-card rounded-2xl border shadow-sm p-8 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-100">
                  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-2xl" />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[hsl(var(--leoni-purple))/0.10] blur-2xl" />
                </div>
                <div className="relative text-center max-w-sm">
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">Illustration Placeholder</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    A space for a product illustration, workflow diagram, or brand visual.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3 – Our Mission */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp(0)} className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Mission</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Provide a reliable, modern system that improves internship experience and operational excellence.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  icon: Sparkles,
                  title: "Innovation",
                  desc: "A modern experience designed around clarity, speed, and usability.",
                },
                {
                  icon: Cpu,
                  title: "Automation",
                  desc: "Reduce repetitive tasks with structured workflows and consistent screens.",
                },
                {
                  icon: Award,
                  title: "Excellence",
                  desc: "Support better outcomes through transparent evaluation and reporting.",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  {...fadeUp(0.05 + i * 0.05)}
                  className="bg-background rounded-2xl border shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.25)] transition-all"
                >
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <card.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4 – Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp(0)} className="bg-card rounded-2xl border shadow-sm p-8">
              <h2 className="text-2xl font-bold text-foreground">Why Choose Us</h2>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "Clean, corporate UI with consistent spacing and typography",
                  "Role-based experiences for RH, Supervisor, Director, and Intern",
                  "Fast access to key metrics and structured evaluation workflows",
                  "Modern, responsive layout for desktop and mobile",
                  "Simple export-ready tables for reporting and decision making",
                  "Designed to scale with additional modules over time",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-4 rounded-xl border bg-background">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

