import { useState } from "react";
import { Upload, Send, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ApplicationForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

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
            <p className="text-muted-foreground mb-6">Thank you for applying. We will review your application and get back to you soon.</p>
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
            <h1 className="text-3xl font-bold text-foreground mb-3">Apply for Internship</h1>
            <p className="text-muted-foreground">Fill in your details to submit your application.</p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            className="bg-card rounded-xl border p-8 shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="Enter your full name" />
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
                <label className="block text-sm font-medium text-foreground mb-1.5">University *</label>
                <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="ENSI, INSAT, ENIT..." />
              </div>
            </div>

            {/* CV Upload */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">CV (PDF) *</label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                }`}
              >
                <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop your CV here, or <span className="text-primary font-medium">browse</span></p>
                <p className="text-xs text-muted-foreground/60 mt-1">PDF format, max 5MB</p>
                <input type="file" accept=".pdf" className="hidden" />
              </div>
            </div>

            {/* Motivation */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">Motivation Letter</label>
              <textarea
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                placeholder="Tell us why you're interested in this internship..."
              />
            </div>

            <button
              type="submit"
              className="mt-8 w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-sm"
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

export default ApplicationForm;
