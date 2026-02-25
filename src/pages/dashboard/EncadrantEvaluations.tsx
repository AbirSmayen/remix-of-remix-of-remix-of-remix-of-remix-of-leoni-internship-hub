import { useState } from "react";
import { Award, BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockInterns, evaluationCriteria } from "@/data/mockData";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const EncadrantEvaluations = () => {
  const [selectedInternId, setSelectedInternId] = useState(mockInterns[0].id);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(evaluationCriteria.map(c => [c.id, 3]))
  );
  const [comments, setComments] = useState("");

  const updateScore = (criteriaId: string, value: number) => {
    setScores(prev => ({ ...prev, [criteriaId]: value }));
  };

  const weightedAverage = evaluationCriteria.reduce((acc, c) => {
    return acc + (scores[c.id] / 5) * c.weight;
  }, 0);

  const overallScore = (weightedAverage / 100 * 5).toFixed(1);

  const handleSubmit = () => {
    toast.success(`Evaluation submitted for ${mockInterns.find(i => i.id === selectedInternId)?.name}! Score: ${overallScore}/5`);
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Evaluations</h1>
        <p className="text-muted-foreground text-sm mt-1">Evaluate intern performance with weighted criteria scoring.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Evaluation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Select Intern</label>
                <select
                  value={selectedInternId}
                  onChange={e => setSelectedInternId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {mockInterns.slice(0, 3).map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <div className="bg-primary/5 rounded-lg p-4 w-full text-center">
                  <p className="text-xs text-muted-foreground mb-1">Weighted Score</p>
                  <p className="text-3xl font-bold text-primary">{overallScore}<span className="text-sm text-muted-foreground">/5</span></p>
                </div>
              </div>
            </div>

            {/* Criteria-based scoring */}
            <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Evaluation Criteria</h3>
            <div className="space-y-4">
              {evaluationCriteria.map(criteria => (
                <div key={criteria.id} className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{criteria.label}</p>
                      <p className="text-xs text-muted-foreground">{criteria.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Weight: {criteria.weight}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button
                          key={n}
                          onClick={() => updateScore(criteria.id, n)}
                          className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
                            scores[criteria.id] >= n
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-foreground ml-2">{scores[criteria.id]}/5</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground mb-1.5">Final Comments</label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                placeholder="Provide your final evaluation comments..."
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all"
            >
              <Award className="h-4 w-4" /> Submit Evaluation
            </button>
          </div>
        </div>

        {/* Right: Score Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Score Breakdown
            </h3>
            <div className="space-y-3">
              {evaluationCriteria.map(criteria => {
                const score = scores[criteria.id];
                const pct = (score / 5) * 100;
                return (
                  <div key={criteria.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{criteria.label}</span>
                      <span className="font-medium text-foreground">{score}/5 ({criteria.weight}%)</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-foreground">Overall</span>
                <span className="text-sm font-bold text-primary">{overallScore}/5 ({Math.round(weightedAverage)}%)</span>
              </div>
              <Progress value={weightedAverage} className="h-2.5 mt-2" />
            </div>
          </div>

          {/* Performance tier */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Performance Tier</h3>
            {[
              { min: 4.5, label: "Excellent", color: "text-success", bg: "bg-success/10" },
              { min: 3.5, label: "Very Good", color: "text-primary", bg: "bg-primary/10" },
              { min: 2.5, label: "Good", color: "text-warning", bg: "bg-warning/10" },
              { min: 1.5, label: "Satisfactory", color: "text-muted-foreground", bg: "bg-secondary" },
              { min: 0, label: "Needs Improvement", color: "text-destructive", bg: "bg-destructive/10" },
            ].map(tier => {
              const isActive = parseFloat(overallScore) >= tier.min && (tier.min === 4.5 || parseFloat(overallScore) < tier.min + 1);
              return (
                <div
                  key={tier.label}
                  className={`px-3 py-2 rounded-lg mb-1.5 text-sm transition-all ${
                    isActive ? `${tier.bg} ${tier.color} font-semibold` : "text-muted-foreground"
                  }`}
                >
                  {tier.label} ({tier.min}+)
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EncadrantEvaluations;
