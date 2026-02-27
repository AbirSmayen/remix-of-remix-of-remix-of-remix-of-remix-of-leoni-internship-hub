import { motion } from "framer-motion";
import { MapPin, Mail, Phone, Clock3 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut", delay },
});

const Contact = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* SECTION 1 – Header */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp(0)} className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
              <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                Reach out for internship support, platform guidance, or HR inquiries. We’ll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 – 2-column layout */}
        <section className="pb-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* LEFT – Contact cards */}
              <motion.div {...fadeUp(0.05)} className="space-y-4">
                {[
                  { icon: MapPin, title: "Address", value: "LEONI Tunisia, Industrial Zone" },
                  { icon: Mail, title: "Email", value: "internships@leoni.com" },
                  { icon: Phone, title: "Phone", value: "+216 70 000 000" },
                  { icon: Clock3, title: "Working Hours", value: "Mon–Fri, 08:00–17:00" },
                ].map((c) => (
                  <div key={c.title} className="bg-card rounded-2xl border shadow-sm p-6 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_-28px_rgba(15,23,42,0.25)] transition-all">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <c.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{c.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{c.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* RIGHT – Contact form */}
              <motion.div {...fadeUp(0.1)} className="bg-card rounded-2xl border shadow-sm p-8">
                <h2 className="text-xl font-bold text-foreground">Send a message</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Fill in the form below and we’ll get back to you.
                </p>

                <form
                  className="mt-6 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    toast.success("Message sent (demo).");
                    setForm({ fullName: "", email: "", subject: "", message: "" });
                  }}
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                    <input
                      value={form.fullName}
                      onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                    <input
                      value={form.subject}
                      onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Message subject"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                      rows={5}
                      className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="Write your message..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Submit
                  </button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        {/* SECTION 3 – Map placeholder */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeUp(0.15)} className="bg-card rounded-2xl border shadow-sm p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Location</h2>
                <span className="text-xs text-muted-foreground">Map placeholder</span>
              </div>
              <div className="rounded-2xl border bg-background h-72 flex items-center justify-center text-muted-foreground">
                Map embed placeholder
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

