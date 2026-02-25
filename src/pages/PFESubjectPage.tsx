import { useParams, Link } from "react-router-dom";
import { MapPin, Building2, GraduationCap, Clock, Users, ArrowLeft, Send } from "lucide-react";
import { usePFESubjectById } from "@/hooks/usePFESubjects";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StatusBadge from "@/components/ui/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";

const PFESubjectPage = () => {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { data: subject, isLoading } = usePFESubjectById(subjectId || "");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/pfe-book" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to PFE Book
          </Link>

          {isLoading && (
            <div className="bg-card rounded-xl border p-8 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          )}

          {!isLoading && !subject && (
            <div className="text-center py-20">
              <p className="text-lg font-medium text-foreground">Subject not found</p>
              <p className="text-sm text-muted-foreground mt-2">The PFE subject you're looking for doesn't exist.</p>
            </div>
          )}

          {subject && (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-primary-foreground">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono font-bold bg-primary-foreground/20 px-3 py-1 rounded-full">{subject.subject_id}</span>
                  <StatusBadge status={subject.status === "open" ? "open" : "closed"} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{subject.title}</h1>
                <p className="opacity-90 text-sm">{subject.type} Internship • {subject.duration}</p>
              </div>

              <div className="p-8">
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{subject.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Details</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{subject.site}</p>
                          {subject.address && <p className="text-xs">{subject.address}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary shrink-0" />
                        <span>{subject.department}</span>
                      </div>
                      {subject.supervisor && (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                          <span>Supervisor: {subject.supervisor}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <span>Duration: {subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <span>{subject.max_interns} intern{subject.max_interns > 1 ? "s" : ""} required</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-foreground mb-4">Required Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {(subject.skills || []).map((skill) => (
                        <span key={skill} className="text-sm bg-primary/5 text-primary px-3 py-1.5 rounded-lg font-medium">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {subject.status === "open" && (
                  <Link
                    to={`/apply/${subject.subject_id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-primary-foreground text-base font-bold hover:bg-primary/90 transition-all shadow-sm"
                  >
                    <Send className="h-5 w-5" /> Apply Now
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PFESubjectPage;
