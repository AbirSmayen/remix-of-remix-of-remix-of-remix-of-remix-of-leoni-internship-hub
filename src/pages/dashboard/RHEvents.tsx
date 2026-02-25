import { useState, useMemo } from "react";
import { Calendar as CalIcon, Plus, ChevronLeft, ChevronRight, Search, Edit2, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { mockEvents } from "@/data/mockData";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ViewMode = "Daily" | "Weekly" | "Monthly" | "Yearly";

const eventTypeColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  visit: { bg: "bg-primary/5", border: "border-l-primary", text: "text-primary", dot: "bg-primary" },
  training: { bg: "bg-warning/5", border: "border-l-warning", text: "text-warning", dot: "bg-warning" },
  presentation: { bg: "bg-leoni-purple/5", border: "border-l-leoni-purple", text: "text-leoni-purple", dot: "bg-leoni-purple" },
  workshop: { bg: "bg-success/5", border: "border-l-success", text: "text-success", dot: "bg-success" },
};

const eventTypeLabels: Record<string, string> = {
  visit: "Visit",
  training: "Training",
  presentation: "Presentation",
  workshop: "Workshop",
};

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

const RHEvents = () => {
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("Monthly");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1));
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<typeof mockEvents[0] | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const eventsByDay = useMemo(() => {
    const map: Record<number, typeof mockEvents> = {};
    mockEvents.forEach((event) => {
      const d = new Date(event.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push(event);
      }
    });
    return map;
  }, [year, month]);

  const calendarCells: (number | null)[] = [];
  const prevMonthDays = getDaysInMonth(year, month - 1);
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push(-(prevMonthDays - i));
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      calendarCells.push(-i * 100);
    }
  }

  const today = new Date();
  const isToday = (day: number) => day > 0 && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const upcomingEvents = mockEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const handleDeleteEvent = () => {
    toast.success("Event deleted successfully.");
    setDeleteModal(null);
  };

  return (
    <DashboardLayout role="rh">
      {/* Header */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage intern events and activities.</p>
        </div>
        <button
          onClick={() => { setEditingEvent(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm self-start lg:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Schedule
        </button>
      </div>

      {/* Create/Edit Event Form */}
      {showForm && (
        <div className="bg-card rounded-xl border shadow-sm p-6 mb-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {editingEvent ? "Edit Event" : "Create Event"}
          </h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            toast.success(editingEvent ? "Event updated!" : "Event created!");
            setShowForm(false);
            setEditingEvent(null);
          }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input defaultValue={editingEvent?.title || ""} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Event title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
              <select defaultValue={editingEvent?.type || "visit"} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="visit">Visit</option>
                <option value="training">Training</option>
                <option value="presentation">Presentation</option>
                <option value="workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
              <input type="date" defaultValue={editingEvent?.date || ""} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
              <input type="time" defaultValue={editingEvent?.time || ""} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input defaultValue={editingEvent?.location || ""} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" placeholder="Location" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Assign to</label>
              <select className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>All Interns</option>
                <option>PFE Only</option>
                <option>PFA Only</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea rows={2} defaultValue={editingEvent?.description || ""} className="w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Event description..." />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all">
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="px-6 py-2.5 bg-secondary text-foreground rounded-lg font-semibold text-sm hover:bg-secondary/80 transition-all">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar - 3 cols */}
        <div className="xl:col-span-3 bg-card rounded-xl border shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a meeting name"
                  className="pl-9 pr-3 py-2 rounded-lg border bg-background text-sm w-56 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center gap-1">
                <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                  <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                </button>
                <span className="text-sm font-bold text-foreground min-w-[160px] text-center uppercase tracking-wide">
                  {MONTHS[month]} {year}
                </span>
                <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-secondary transition-colors">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-0.5">
              {(["Daily", "Weekly", "Monthly", "Yearly"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    viewMode === v
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b">
            {DAYS.map((day) => (
              <div key={day} className="px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center bg-secondary/30">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarCells.map((cell, idx) => {
              const isCurrentMonth = cell !== null && cell > 0;
              const dayNum = isCurrentMonth ? cell : Math.abs(cell! < -50 ? cell! / 100 : cell!);
              const dayEvents = isCurrentMonth ? (eventsByDay[cell!] || []) : [];
              const todayHighlight = isCurrentMonth && isToday(cell!);

              return (
                <div
                  key={idx}
                  className={`min-h-[100px] border-b border-r p-2 transition-colors relative ${
                    isCurrentMonth ? "bg-card" : "bg-secondary/20"
                  } ${todayHighlight ? "ring-2 ring-inset ring-primary/30" : ""}`}
                  onMouseEnter={() => isCurrentMonth && setHoveredDay(cell)}
                  onMouseLeave={() => setHoveredDay(null)}
                >
                  <span className={`text-sm font-semibold ${
                    isCurrentMonth
                      ? todayHighlight
                        ? "text-primary"
                        : "text-foreground"
                      : "text-muted-foreground/40"
                  }`}>
                    {dayNum}
                  </span>

                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => {
                      const colors = eventTypeColors[event.type] || eventTypeColors.visit;
                      return (
                        <div
                          key={event.id}
                          className={`${colors.bg} border-l-2 ${colors.border} rounded-r px-1.5 py-1 cursor-pointer group transition-all hover:shadow-sm`}
                          title={`${event.title}\n${event.time} • ${event.location}`}
                        >
                          <p className={`text-[10px] font-medium ${colors.text} leading-tight line-clamp-2`}>
                            {event.title}
                          </p>
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted-foreground font-medium">+{dayEvents.length - 2} more</span>
                    )}
                  </div>

                  {hoveredDay === cell && dayEvents.length > 0 && (
                    <div className="absolute z-50 top-full left-0 mt-1 bg-popover border rounded-lg shadow-xl p-3 min-w-[220px] animate-fade-in">
                      {dayEvents.map((event) => (
                        <div key={event.id} className="mb-2 last:mb-0">
                          <p className="text-sm font-semibold text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.time} • {event.location}</p>
                          <p className="text-xs text-muted-foreground">{event.confirmed.length}/{event.assignedInterns.length} confirmed</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="p-4 border-t bg-secondary/20 flex flex-wrap items-center gap-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legend:</span>
            {Object.entries(eventTypeLabels).map(([key, label]) => {
              const colors = eventTypeColors[key];
              return (
                <div key={key} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side – Event Details Panel */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-sm font-semibold text-foreground">Upcoming Events</h3>
            </div>
            <div className="divide-y">
              {upcomingEvents.map((event) => {
                const colors = eventTypeColors[event.type] || eventTypeColors.visit;
                return (
                  <div key={event.id} className="p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{event.date.split("-")[2]}</span>
                        <span className="text-[8px] text-primary/70">{MONTHS[parseInt(event.date.split("-")[1]) - 1]?.slice(0, 3).toUpperCase()}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.time} • {event.location}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>{event.type}</span>
                          <span className="text-[10px] text-muted-foreground">{event.confirmed.length}/{event.assignedInterns.length} confirmed</span>
                        </div>
                      </div>
                    </div>
                    {/* RH Actions: Edit / Delete */}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => { setEditingEvent(event); setShowForm(true); }}
                        className="flex-1 py-1.5 bg-secondary text-foreground rounded-lg text-xs font-semibold hover:bg-secondary/80 transition-all flex items-center justify-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteModal(event.id)}
                        className="flex-1 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/20 transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              {upcomingEvents.length === 0 && (
                <div className="p-6 text-center">
                  <CalIcon className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No upcoming events.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteModal} onOpenChange={() => setDeleteModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default RHEvents;
