import { useState } from "react";
import { Upload, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { departments, leoniSites } from "@/data/mockData";

const NonPFEApplication = () => {
  const [submitted, setSubmitted] = useState(false);
  const [dragOverCV, setDragOverCV] = useState(false);
  const [dragOverMotiv, setDragOverMotiv] = useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-16 flex items-center justify-center">
          <div className="text-center animate-fade-in">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h2>
            <p className="text-muted-foreground mb-2">Thank you for applying. Your application has entered the review pipeline.</p>
            <p className="text-sm text-muted-foreground">Pipeline: <span className="font-semibold text-foreground">Candidate → RH Review → Interview → Acceptance</span></p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">Apply for Internship (Non-PFE)</h1>
            <p className="text-muted-foreground">For PFA, Summer, and Perfectionnement internships. Fill in all required fields.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-card rounded-xl border p-8 shadow-sm space-y-6"
          >
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                  <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Last Name *</label>
                  <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Last name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input required type="email" className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="your.email@university.tn" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <input required type="tel" className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="+216 XX XXX XXX" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Date of Birth</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nationality</label>
                  <input className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Tunisian" defaultValue="Tunisian" />
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">University *</label>
                  <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="ENSI, INSAT, ENIT..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Level *</label>
                  <select required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option value="">Select level</option>
                    <option value="licence">Licence</option>
                    <option value="master">Master</option>
                    <option value="ingenieur">Cycle d'Ingénieur</option>
                    <option value="technicien">Technicien Supérieur</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Field of Study *</label>
                  <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Computer Science, Electrical Engineering..." />
                </div>
              </div>
            </div>

            {/* Internship Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                Internship Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Internship Type *</label>
                  <select required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option value="">Select type</option>
                    <option value="PFA">PFA (Projet de Fin d'Année)</option>
                    <option value="Summer">Summer Internship</option>
                    <option value="Perfectionnement">Perfectionnement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Department *</label>
                  <select required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Site *</label>
                  <select required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option value="">Select site</option>
                    {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Start Date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">4</span>
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">CV (PDF) *</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOverCV(true); }}
                    onDragLeave={() => setDragOverCV(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOverCV(false); }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      dragOverCV ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drop CV here or <span className="text-primary font-medium">browse</span></p>
                    <input type="file" accept=".pdf" className="hidden" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Motivation Letter (PDF)</label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOverMotiv(true); }}
                    onDragLeave={() => setDragOverMotiv(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOverMotiv(false); }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                      dragOverMotiv ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    }`}
                  >
                    <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drop letter here or <span className="text-primary font-medium">browse</span></p>
                    <input type="file" accept=".pdf" className="hidden" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline info */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium mb-1">Submission Workflow</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">Candidate</span>
                <span>→</span>
                <span className="px-2 py-1 bg-warning/10 text-warning rounded font-medium">RH Review</span>
                <span>→</span>
                <span className="px-2 py-1 bg-leoni-purple/10 text-leoni-purple rounded font-medium">Interview</span>
                <span>→</span>
                <span className="px-2 py-1 bg-success/10 text-success rounded font-medium">Acceptance</span>
                <span>→</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">Status Update</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
            >
              <Send className="h-4 w-4" /> Submit Application
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NonPFEApplication;
