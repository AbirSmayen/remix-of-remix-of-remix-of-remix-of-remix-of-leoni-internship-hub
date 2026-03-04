import { useMemo, useState } from "react";
import { FileText, Laptop, Mail, Package, Pencil, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMockInternshipStore } from "@/contexts/MockInternshipStore";
import type { EquipmentAuthorization, PCAuthorization } from "@/types/internship";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const EncadrantAuthorizations = () => {
  const { user } = useAuth();
  const { interns, updateIntern } = useMockInternshipStore();

  const supervisorName = user?.name || "";
  const supervisorDepartment = user?.department || "";

  const myInterns = useMemo(() => {
    return interns.filter((i) => {
      const deptOk = supervisorDepartment ? i.department === supervisorDepartment : true;
      const assignedOk =
        i.technicalSupervisor === supervisorName ||
        i.functionalSupervisor === supervisorName ||
        i.supervisor === supervisorName;
      return deptOk && (assignedOk || !supervisorName);
    });
  }, [interns, supervisorDepartment, supervisorName]);

  const [selectedInternId, setSelectedInternId] = useState<string | null>(null);
  const selectedIntern = myInterns.find((i) => i.id === selectedInternId) || null;

  const [pcDraft, setPcDraft] = useState<PCAuthorization>({ pcName: "", pcId: "" });
  const [eqDraft, setEqDraft] = useState<EquipmentAuthorization>({ equipmentName: "", equipmentId: "" });

  const totalPc = myInterns.reduce(
    (sum, i) => sum + ((i.pcAuthorizations || []).length),
    0
  );
  const totalEquipment = myInterns.reduce(
    (sum, i) => sum + ((i.equipmentAuthorizations || []).length),
    0
  );

  const upsertIntern = (updates: Partial<typeof selectedIntern>) => {
    if (!selectedIntern) return;
    updateIntern(selectedIntern.id, updates);
  };

  const addPcAuthorization = () => {
    if (!selectedIntern) return;
    if (!pcDraft.pcName.trim() || !pcDraft.pcId.trim()) {
      toast.error("Please provide PC Name and PC ID/Matricule.");
      return;
    }
    const list = selectedIntern.pcAuthorizations || [];
    upsertIntern({ pcAuthorizations: [...list, { pcName: pcDraft.pcName.trim(), pcId: pcDraft.pcId.trim() }] });
    setPcDraft({ pcName: "", pcId: "" });
    toast.success("PC added to authorization list.");
  };

  const addEquipmentAuthorization = () => {
    if (!selectedIntern) return;
    if (!eqDraft.equipmentName.trim()) {
      toast.error("Please provide equipment name.");
      return;
    }
    const list = selectedIntern.equipmentAuthorizations || [];
    upsertIntern({
      equipmentAuthorizations: [
        ...list,
        {
          equipmentName: eqDraft.equipmentName.trim(),
          equipmentId: eqDraft.equipmentId?.trim() || undefined,
        },
      ],
    });
    setEqDraft({ equipmentName: "", equipmentId: "" });
    toast.success("Equipment added to authorization list.");
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const generateAuthorizationDocument = () => {
    if (!selectedIntern) return;

    const pcList = selectedIntern.pcAuthorizations || [];
    const eqList = selectedIntern.equipmentAuthorizations || [];
    if (pcList.length === 0 && eqList.length === 0) {
      toast.error("Add at least one PC or equipment entry before generating the document.");
      return;
    }

    const primaryPc = pcList[0];
    const primaryEq = eqList[0];

    const nature =
      pcList.length && eqList.length
        ? "Matériel informatique & équipement"
        : pcList.length
          ? "Matériel informatique"
          : "Équipement";

    const objectLabel = primaryPc?.pcName || primaryEq?.equipmentName || "—";
    const immob = primaryPc?.pcId || primaryEq?.equipmentId || "—";
    const quantity = pcList.length + eqList.length || 1;

    const destination = selectedIntern.site ? `Domicile ↔ ${selectedIntern.site}` : "Domicile ↔ Site LEONI";
    const transporter = selectedIntern.name;
    const comment = selectedIntern.subject || "";

    const today = new Date();
    const creationDate = formatDate(today.toISOString().slice(0, 10));
    const startDate = formatDate(selectedIntern.startDate);
    const endDate = formatDate(selectedIntern.endDate);

    const win = window.open("", "_blank");
    if (!win) {
      toast.error("Please allow popups to generate the authorization document.");
      return;
    }

    const docId = `ID ${selectedIntern.matricule} (Entité Racine)`;

    win.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <title>Autorisation de matériel - ${selectedIntern.name}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: Tahoma, Arial, sans-serif;
            background: #ffffff;
            color: #000000;
            padding: 16px;
          }
          .page {
            width: 1000px;
            margin: 0 auto;
            border: 1px solid #c5d0e6;
            background-color: #f5f7ff;
          }
          .top-bar {
            height: 26px;
            background-color: #ffffff;
            border-bottom: 1px solid #c5d0e6;
            padding: 4px 8px;
            font-size: 11px;
            color: #3b4a6b;
          }
          .tabs {
            display: flex;
            background-color: #f5f7ff;
            border-bottom: 1px solid #c5d0e6;
          }
          .tab {
            padding: 6px 14px;
            font-size: 11px;
            border-right: 1px solid #c5d0e6;
            cursor: default;
          }
          .tab.active {
            background-color: #2c4ea3;
            color: #ffffff;
            font-weight: bold;
          }
          .header-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background-color: #dfe7ff;
            border-bottom: 1px solid #c5d0e6;
            font-size: 11px;
          }
          .header-main select {
            font-size: 11px;
          }
          .form-table {
            width: 100%;
            border-collapse: collapse;
            background-color: #f5f7ff;
            font-size: 11px;
          }
          .form-table td {
            border-bottom: 1px solid #e0e6f5;
            padding: 4px 8px;
          }
          .label-cell {
            width: 180px;
            color: #003366;
          }
          .input-cell {
            background-color: #ffffff;
          }
          .input-box {
            border: 1px solid #c5d0e6;
            padding: 2px 4px;
            width: 100%;
            font-size: 11px;
          }
          .bottom-bar {
            display: flex;
            justify-content: space-between;
            padding: 8px 10px;
            font-size: 11px;
            background-color: #f5f7ff;
          }
          .actions-row {
            display: flex;
            justify-content: center;
            gap: 2px;
            padding: 8px 0 12px;
          }
          .btn-primary {
            background-color: #2c4ea3;
            color: #ffffff;
            border: 1px solid #1e3a8a;
            padding: 4px 18px;
            font-size: 11px;
          }
          .btn-danger {
            background-color: #ffffff;
            color: #cc0000;
            border: 1px solid #cc0000;
            padding: 4px 12px;
            font-size: 11px;
          }
          @media print {
            body {
              padding: 0;
            }
            .page {
              border: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="top-bar">
            Liste : &nbsp; Principal
          </div>
          <div class="tabs">
            <div class="tab active">Principal</div>
            <div class="tab">Documents</div>
            <div class="tab">Validation</div>
            <div class="tab">Notes</div>
            <div class="tab">Historique</div>
            <div class="tab">Tous</div>
          </div>
          <div class="header-main">
            <div>${docId}</div>
            <div>
              Type d'autorisation :
              <select disabled>
                <option>Déplacement</option>
              </select>
            </div>
            <div>
              Sous-entités :
              <select disabled>
                <option>Non</option>
              </select>
            </div>
          </div>
          <table class="form-table">
            <tbody>
              <tr>
                <td class="label-cell">Nature du bien*:</td>
                <td class="input-cell"><div class="input-box">${nature}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Objets *:</td>
                <td class="input-cell"><div class="input-box">${objectLabel}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Quantité*:</td>
                <td class="input-cell"><div class="input-box">${String(quantity).padStart(2, "0")}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Immobilisation*:</td>
                <td class="input-cell"><div class="input-box">${immob}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Valeur résiduelle*:</td>
                <td class="input-cell"><div class="input-box">-</div></td>
              </tr>
              <tr>
                <td class="label-cell">Mise en rebut*:</td>
                <td class="input-cell"><div class="input-box">-</div></td>
              </tr>
              <tr>
                <td class="label-cell">Destination*:</td>
                <td class="input-cell"><div class="input-box">${destination}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Transporteur*:</td>
                <td class="input-cell"><div class="input-box">${transporter}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Matricule Camion*:</td>
                <td class="input-cell"><div class="input-box">0</div></td>
              </tr>
              <tr>
                <td class="label-cell">Date de sortie*:</td>
                <td class="input-cell"><div class="input-box">${startDate}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Date de retour*:</td>
                <td class="input-cell"><div class="input-box">${endDate}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Commentaire*:</td>
                <td class="input-cell"><div class="input-box">${comment || "-"}</div></td>
              </tr>
              <tr>
                <td class="label-cell">Service Compétent*:</td>
                <td class="input-cell"><div class="input-box">${supervisorName || "-"}</div></td>
              </tr>
              <tr>
                <td class="label-cell">CC*:</td>
                <td class="input-cell"><div class="input-box">${selectedIntern.department || ""}</div></td>
              </tr>
            </tbody>
          </table>
          <div class="actions-row">
            <button class="btn-primary">Actualiser</button>
            <button class="btn-primary">dupliquer</button>
            <button class="btn-danger">Annuler cette demande</button>
          </div>
          <div class="bottom-bar">
            <div>
              Status: En cours<br />
              Demandeur: ${selectedIntern.name}
            </div>
            <div>
              Société: LEONI Wiring Systems Tunisia<br />
              Date de création: ${creationDate}
            </div>
          </div>
        </div>
        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        </script>
      </body>
      </html>
    `);

    win.document.close();
  };

  const sendAuthorizationByEmail = () => {
    if (!selectedIntern) return;

    const subject = `Autorisation de matériel - ${selectedIntern.name}`;
    const bodyLines = [
      `Bonjour ${selectedIntern.name},`,
      "",
      "Veuillez trouver ci-joint l'autorisation officielle relative au matériel mis à votre disposition.",
      "",
      `Période : ${formatDate(selectedIntern.startDate)} → ${formatDate(selectedIntern.endDate)}`,
      "",
      "Ceci est un envoi automatique généré depuis la plateforme de gestion des stages LEONI (environnement de test).",
    ];

    console.info("Mock email send:", {
      to: selectedIntern.email,
      subject,
      body: bodyLines.join("\n"),
      attachment: "authorization-document.pdf",
    });

    toast.success("Authorization sent successfully (mock email).");
  };

  return (
    <DashboardLayout role="encadrant">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Authorizations</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Assign PC + equipment authorizations for interns in your department. RH has read-only visibility.
          </p>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">Interns (my department)</p>
            <p className="text-2xl font-bold text-foreground mt-1">{myInterns.length}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">PC authorizations</p>
            <p className="text-2xl font-bold text-primary mt-1">{totalPc}</p>
          </div>
          <div className="bg-card rounded-xl border p-5 shadow-sm">
            <p className="text-xs text-muted-foreground">Equipment entries</p>
            <p className="text-2xl font-bold text-primary mt-1">{totalEquipment}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-foreground">My interns</h2>
            <p className="text-sm text-muted-foreground">Open an intern to manage their authorizations.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-secondary/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Intern</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">PC</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Equipment</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {myInterns.map((intern) => (
                  <tr key={intern.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-foreground">{intern.name}</p>
                      <p className="text-xs text-muted-foreground">{intern.subject}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{intern.department}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(intern.pcAuthorizations || []).length || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(intern.equipmentAuthorizations || []).length || "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedInternId(intern.id)}>
                        Open
                      </Button>
                    </td>
                  </tr>
                ))}
                {myInterns.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">
                      No interns available for your department.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedInternId} onOpenChange={(v) => !v && setSelectedInternId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Authorizations — {selectedIntern?.name}</DialogTitle>
          </DialogHeader>

          {selectedIntern && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Laptop className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">PC Authorization</p>
                  </div>

                  <div className="space-y-2">
                    {(selectedIntern.pcAuthorizations || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No PC authorization assigned yet.</p>
                    ) : (
                      (selectedIntern.pcAuthorizations || []).map((a, idx) => (
                        <div key={`${a.pcId}-${idx}`} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-secondary/20">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{a.pcName}</p>
                            <p className="text-xs text-muted-foreground">ID: {a.pcId}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const name = window.prompt("PC Name", a.pcName) || a.pcName;
                                const id = window.prompt("PC ID / Matricule", a.pcId) || a.pcId;
                                const list = (selectedIntern.pcAuthorizations || []).map((x, i) =>
                                  i === idx ? { ...x, pcName: name.trim(), pcId: id.trim() } : x
                                );
                                upsertIntern({ pcAuthorizations: list });
                                toast.success("PC authorization updated.");
                              }}
                              className="p-2 rounded-lg hover:bg-secondary/60 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => {
                                const list = (selectedIntern.pcAuthorizations || []).filter((_, i) => i !== idx);
                                upsertIntern({ pcAuthorizations: list });
                                toast.success("PC authorization deleted.");
                              }}
                              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      value={pcDraft.pcName}
                      onChange={(e) => setPcDraft((p) => ({ ...p, pcName: e.target.value }))}
                      placeholder="PC Name"
                      className="px-3 py-2.5 rounded-lg border bg-background text-sm"
                    />
                    <input
                      value={pcDraft.pcId}
                      onChange={(e) => setPcDraft((p) => ({ ...p, pcId: e.target.value }))}
                      placeholder="PC ID / Matricule"
                      className="px-3 py-2.5 rounded-lg border bg-background text-sm"
                    />
                    <Button onClick={addPcAuthorization} className="gap-2">
                      <Plus className="h-4 w-4" /> Add PC
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-4 w-4 text-primary" />
                    <p className="font-semibold text-foreground">Equipment Authorization</p>
                  </div>

                  <div className="space-y-2">
                    {(selectedIntern.equipmentAuthorizations || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">No equipment assigned yet.</p>
                    ) : (
                      (selectedIntern.equipmentAuthorizations || []).map((a, idx) => (
                        <div key={`${a.equipmentName}-${idx}`} className="flex items-center justify-between gap-3 p-3 rounded-lg border bg-secondary/20">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{a.equipmentName}</p>
                            <p className="text-xs text-muted-foreground">ID: {a.equipmentId || "—"}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                const name = window.prompt("Equipment name", a.equipmentName) || a.equipmentName;
                                const id = window.prompt("Equipment ID", a.equipmentId || "") || a.equipmentId || "";
                                const list = (selectedIntern.equipmentAuthorizations || []).map((x, i) =>
                                  i === idx ? { ...x, equipmentName: name.trim(), equipmentId: id.trim() || undefined } : x
                                );
                                upsertIntern({ equipmentAuthorizations: list });
                                toast.success("Equipment authorization updated.");
                              }}
                              className="p-2 rounded-lg hover:bg-secondary/60 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => {
                                const list = (selectedIntern.equipmentAuthorizations || []).filter((_, i) => i !== idx);
                                upsertIntern({ equipmentAuthorizations: list });
                                toast.success("Equipment authorization deleted.");
                              }}
                              className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      value={eqDraft.equipmentName}
                      onChange={(e) => setEqDraft((p) => ({ ...p, equipmentName: e.target.value }))}
                      placeholder="Equipment name"
                      className="px-3 py-2.5 rounded-lg border bg-background text-sm"
                    />
                    <input
                      value={eqDraft.equipmentId || ""}
                      onChange={(e) => setEqDraft((p) => ({ ...p, equipmentId: e.target.value }))}
                      placeholder="ID (optional)"
                      className="px-3 py-2.5 rounded-lg border bg-background text-sm"
                    />
                    <Button onClick={addEquipmentAuthorization} variant="secondary" className="gap-2">
                      <Plus className="h-4 w-4" /> Add item
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-primary">
                  Add, edit, or delete equipment entries. They are all considered validated as soon as you add them.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button type="button" onClick={generateAuthorizationDocument} className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span>Generate authorization document</span>
                </Button>
                <Button type="button" onClick={sendAuthorizationByEmail} variant="outline" className="gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Send by Email</span>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EncadrantAuthorizations;

