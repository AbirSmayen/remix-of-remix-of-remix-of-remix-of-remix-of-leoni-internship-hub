import { useState, useRef } from "react";
import { Upload, Send, CheckCircle, FileText, X, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { departments, leoniSites } from "@/data/mockData";
import { useSubmitApplication, uploadApplicationFile } from "@/hooks/usePFESubjects";
import { toast } from "sonner";

const NonPFEApplication = () => {
  const submitMutation = useSubmitApplication();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", dob: "", nationality: "Tunisian",
    university: "", level: "", fieldOfStudy: "",
    internshipType: "", preferredDepartment: "", preferredSite: "", preferredStartDate: "",
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [motivFile, setMotivFile] = useState<File | null>(null);
  const cvRef = useRef<HTMLInputElement>(null);
  const motivRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) { toast.error("Please upload your CV."); return; }

    setSubmitting(true);
    try {
      const cvUrl = await uploadApplicationFile(cvFile, "cv");
      let motivUrl: string | undefined;
      if (motivFile) motivUrl = await uploadApplicationFile(motivFile, "motivation-letters");

      await submitMutation.mutateAsync({
        full_name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        university: form.university,
        academic_level: form.level || null,
        field_of_study: form.fieldOfStudy || null,
        application_type: form.internshipType || "PFA",
        preferred_department: form.preferredDepartment || null,
        preferred_site: form.preferredSite || null,
        preferred_start_date: form.preferredStartDate || null,
        cv_url: cvUrl,
        motivation_letter_url: motivUrl || null,
        agreed_terms: true,
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

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
            <p className="text-muted-foreground mb-2">Your application has entered the review pipeline.</p>
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
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-3">Apply for Short-Term Internship</h1>
            <p className="text-muted-foreground">For PFA, Summer, and Perfectionnement internships (1–2 months).</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-xl border p-8 shadow-sm space-y-6">
            {/* Section 1: Personal */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">First Name *</label>
                  <input required value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="First name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Last Name *</label>
                  <input required value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Last name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="your.email@university.tn" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                  <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="+216 XX XXX XXX" />
                </div>
              </div>
            </div>

            {/* Section 2: Academic */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">2</span>
                Academic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">University *</label>
                  <input required value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="ENSI, INSAT, ENIT..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Level *</label>
                  <select required value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select level</option>
                    <option value="Licence">Licence</option>
                    <option value="Master">Master</option>
                    <option value="Cycle d'Ingénieur">Cycle d'Ingénieur</option>
                    <option value="Technicien Supérieur">Technicien Supérieur</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Field of Study *</label>
                  <input required value={form.fieldOfStudy} onChange={e => setForm(f => ({ ...f, fieldOfStudy: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Computer Science, Electrical Engineering..." />
                </div>
              </div>
            </div>

            {/* Section 3: Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">3</span>
                Internship Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Internship Type *</label>
                  <select required value={form.internshipType} onChange={e => setForm(f => ({ ...f, internshipType: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select type</option>
                    <option value="PFA">PFA (Projet de Fin d'Année)</option>
                    <option value="Summer">Summer Internship</option>
                    <option value="Perfectionnement">Perfectionnement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Department *</label>
                  <select required value={form.preferredDepartment} onChange={e => setForm(f => ({ ...f, preferredDepartment: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select department</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Site *</label>
                  <select required value={form.preferredSite} onChange={e => setForm(f => ({ ...f, preferredSite: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">Select site</option>
                    {leoniSites.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Preferred Start Date</label>
                  <input type="date" value={form.preferredStartDate} onChange={e => setForm(f => ({ ...f, preferredStartDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>

            {/* Section 4: Documents */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">4</span>
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">CV (PDF) *</label>
                  {cvFile ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-success/5 border-success/20">
                      <FileText className="h-5 w-5 text-success" />
                      <span className="text-sm text-foreground flex-1 truncate">{cvFile.name}</span>
                      <button type="button" onClick={() => setCvFile(null)} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div onClick={() => cvRef.current?.click()} className="border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer border-border hover:border-primary/40 hover:bg-primary/5">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Drop CV here or <span className="text-primary font-medium">browse</span></p>
                    </div>
                  )}
                  <input ref={cvRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && setCvFile(e.target.files[0])} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Motivation Letter (PDF)</label>
                  {motivFile ? (
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-success/5 border-success/20">
                      <FileText className="h-5 w-5 text-success" />
                      <span className="text-sm text-foreground flex-1 truncate">{motivFile.name}</span>
                      <button type="button" onClick={() => setMotivFile(null)} className="p-1 hover:bg-secondary rounded"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <div onClick={() => motivRef.current?.click()} className="border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer border-border hover:border-primary/40 hover:bg-primary/5">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">Drop letter here or <span className="text-primary font-medium">browse</span></p>
                    </div>
                  )}
                  <input ref={motivRef} type="file" accept=".pdf" className="hidden" onChange={e => e.target.files?.[0] && setMotivFile(e.target.files[0])} />
                </div>
              </div>
            </div>

            {/* Pipeline */}
            <div className="bg-secondary/50 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium mb-1">Submission Workflow</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="px-2 py-1 bg-primary/10 text-primary rounded font-medium">Candidate</span>
                <span>→</span>
                <span className="px-2 py-1 bg-warning/10 text-warning rounded font-medium">RH Review</span>
                <span>→</span>
                <span className="px-2 py-1 bg-accent/10 text-accent rounded font-medium">Interview</span>
                <span>→</span>
                <span className="px-2 py-1 bg-success/10 text-success rounded font-medium">Acceptance</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">
              {submitting ? "Submitting..." : <><Send className="h-4 w-4" /> Submit Application</>}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NonPFEApplication;
