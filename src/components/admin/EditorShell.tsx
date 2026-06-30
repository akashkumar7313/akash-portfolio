"use client";

import { useState, useCallback } from "react";
import {
  FiCode, FiAward, FiStar, FiBriefcase, FiBook, FiUser,
  FiTool, FiFolder, FiMessageSquare, FiBarChart2, FiMail, FiLink,
  FiSettings, FiLock, FiArrowUpRight,
} from "react-icons/fi";
import {
  SectionGroup, ItemCard, AddButton, Modal, ActionButtons,
} from "./ModalComponents";
import {
  FormField, FormFieldArray, InputB, TextareaB, FieldArrayInline, CodeEditorB, PasswordChangeForm,
} from "./FormComponents";
import ResumeUploader from "./ResumeUploader";

type SiteData = Record<string, unknown>;

export default function EditorShell({
  data, setData, section, updateField, showToast, refetch,
}: {
  data: SiteData; setData: React.Dispatch<React.SetStateAction<SiteData | null>>; section: string;
  updateField: (s: string, p: string[], v: unknown) => void;
  showToast: (msg: string, type: "success" | "error") => void; refetch: () => Promise<void>;
}) {
  const content = data[section] as Record<string, unknown>;
  const [modal, setModal] = useState<{ type: "add" | "edit"; path: string[]; index?: number; data?: Record<string, unknown> } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ path: string[]; index: number; title?: string } | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const getArrayName = (path: string[]): string => path.length === 0 ? section : path[path.length - 1];
  const getArrayData = (path: string[]): any[] => {
    if (path.length === 0) return Array.isArray(content) ? content : [];
    const arr = (content as any)?.[path[path.length - 1]];
    return Array.isArray(arr) ? arr : [];
  };

  const reqMap: Record<string, string[]> = {
    techStack: ["text"], badges: ["icon", "text", "color"], reviews: ["name", "text"],
    highlights: ["title", "desc"], "about-achievements": ["icon", "text"], categories: ["title"],
    experiences: ["role", "company", "period"], education: ["degree", "school"],
    "education-achievements": ["icon", "text"], projects: ["title", "description"],
    testimonials: ["name", "quote"], stats: ["label", "value"], socialLinks: ["platform"],
  };

  const getReq = (path: string[]): string[] => {
    if (section === "socialLinks") {
      const plat = (formData.platform as string || "").toLowerCase();
      return plat.includes("whats") ? ["platform", "phone"] : ["platform", "url"];
    }
    return reqMap[path.length > 0 ? path[path.length - 1] : "root"] || [];
  };

  const validate = (): boolean => {
    const req = getReq(modal?.path || []);
    const errs: Record<string, string> = {};
    req.forEach(f => { const v = formData[f]; if (v === undefined || v === null || v === "") errs[f] = "Required"; });
    setValidationErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAddModal = (path: string[], template: Record<string, unknown>) => {
    setFormData(JSON.parse(JSON.stringify(template)));
    setModal({ type: "add", path, data: template });
  };
  const openEditModal = (path: string[], index: number, itemData: Record<string, unknown>) => {
    setFormData(JSON.parse(JSON.stringify(itemData)));
    setModal({ type: "edit", path, index, data: itemData });
  };

  const setFd = (fk: string, v: unknown) => setFormData((p: Record<string, unknown>) => ({ ...p, [fk]: v }));
  const clearErr = (fk: string) => setValidationErrors((p: Record<string, string>) => { const n = { ...p }; delete n[fk]; return n; });

  const saveModal = async () => {
    if (!modal) return;
    if (!validate()) return;
    setValidationErrors({});
    let dataToSave = { ...formData };
    const arrayName = getArrayName(modal.path);
    if (section === "socialLinks" && (formData.platform as string || "").toLowerCase().includes("whats")) {
      const phone = (formData.phone as string || "").replace(/[^0-9]/g, "");
      const msg = formData.message as string || "";
      dataToSave.url = `https://wa.me/${phone}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
      delete dataToSave.phone; delete dataToSave.message;
    }
    try {
      let res;
      if (modal.type === "add") {
        res = await fetch(`/api/admin/${section}/item`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arrayName, item: dataToSave }),
        });
      } else {
        const itemId = modal.data?.id ?? modal.index;
        res = await fetch(`/api/admin/${section}/item`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ arrayName, itemId, updatedItem: dataToSave }),
        });
      }
      if (res.ok) {
        showToast(`Item ${modal.type === 'add' ? 'added' : 'updated'} successfully`, "success");
        await refetch(); setModal(null);
      } else {
        const err = await res.json(); showToast(err.error || "Failed to save item", "error");
      }
    } catch { showToast("Network error while saving item", "error"); }
  };

  const confirmDelete = (path: string[], index: number, title?: string) => setDeleteConfirm({ path, index, title });
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { path, index } = deleteConfirm;
    const arrayName = getArrayName(path);
    const items = getArrayData(path);
    const itemToDelete = items[index];
    if (!itemToDelete) { showToast("Cannot delete item", "error"); setDeleteConfirm(null); return; }
    try {
      const res = await fetch(`/api/admin/${section}/item`, {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ arrayName, itemId: itemToDelete.id ?? index }),
      });
      if (res.ok) { showToast("Item deleted successfully", "success"); await refetch(); }
      else { const err = await res.json(); showToast(err.error || "Failed to delete item", "error"); }
    } catch { showToast("Network error while deleting item", "error"); }
    finally { setDeleteConfirm(null); }
  };

  const renderField = (label: string, name: string, opts?: { type?: string; hint?: string; required?: boolean }) => (
    <FormField key={name} label={label} name={name} type={opts?.type || "text"} hint={opts?.hint}
      required={opts?.required} value={formData[name]} error={validationErrors[name]}
      onChange={(v) => { setFd(name, v); if (validationErrors[name]) clearErr(name); }} />
  );

  const renderFieldArray = (label: string, name: string) => (
    <FormFieldArray key={name} label={label} name={name} items={(formData[name] as string[]) || []}
      onChange={(v) => setFormData((p: Record<string, unknown>) => ({ ...p, [name]: v }))} />
  );

  const closeModal = () => setModal(null);

  if (!content) return <div className="text-slate-600 text-center py-12 text-sm">No data for this section.</div>;

  // ─── HERO ──────────────────────────────────────────────────────────
  if (section === "hero") {
    const h = content as any;
    const sk = "hero";
    return (<>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InputB label="Name" value={h.name || ""} onChange={v => updateField(sk, ["name"], v)} />
          <InputB label="Surname" value={h.surname || ""} onChange={v => updateField(sk, ["surname"], v)} />
          <InputB label="Available Text" value={h.availableText || ""} onChange={v => updateField(sk, ["availableText"], v)} />
          <InputB label="Play Store URL" value={h.playStoreUrl || ""} onChange={v => updateField(sk, ["playStoreUrl"], v)} />
          <InputB label="App Store URL" value={h.appStoreUrl || ""} onChange={v => updateField(sk, ["appStoreUrl"], v)} />
          <div className="md:col-span-2 lg:col-span-3">
            <ResumeUploader resumeUrl={h.resumeUrl || ""} onResumeUrlChange={(url) => updateField(sk, ["resumeUrl"], url)} />
          </div>
          <InputB label="Phone App Name" value={h.phoneAppName || ""} onChange={v => updateField(sk, ["phoneAppName"], v)} />
          <InputB label="Phone Developer" value={h.phoneDeveloper || ""} onChange={v => updateField(sk, ["phoneDeveloper"], v)} />
          <InputB label="Phone Size" value={h.phoneSize || ""} onChange={v => updateField(sk, ["phoneSize"], v)} />
          <InputB label="Phone Rating" type="number" value={String(h.phoneRating ?? "")} onChange={v => updateField(sk, ["phoneRating"], parseFloat(v) || 0)} />
          <InputB label="Reviews" type="number" value={String(h.phoneReviewCount ?? "")} onChange={v => updateField(sk, ["phoneReviewCount"], parseInt(v) || 0)} />
        </div>
        <FieldArrayInline label="Roles" items={h.roles || []} onChange={v => updateField(sk, ["roles"], v)} />
        <TextareaB label="Tagline" value={h.tagline || ""} onChange={v => updateField(sk, ["tagline"], v)} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeEditorB label="Flutter Code" value={h.flutterCode || ""} onChange={v => updateField(sk, ["flutterCode"], v)} />
          <CodeEditorB label="React Native Code" value={h.rnCode || ""} onChange={v => updateField(sk, ["rnCode"], v)} />
        </div>
        <SectionGroup title="Tech Badges" icon={<FiCode />} desc="Floating tech badges" onAdd={() => openAddModal(["techStack"], { text: "New Tech" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {(h.techStack || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.text || "Tech"} onEdit={() => openEditModal(["techStack"], i, item)} onDelete={() => confirmDelete(["techStack"], i, item.text)} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="Badges" icon={<FiAward />} desc="Achievement badges" onAdd={() => openAddModal(["badges"], { icon: "🏆", text: "New Badge", color: "blue" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(h.badges || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.icon || ""} ${item.text || "Badge"}`} icon={item.icon} onEdit={() => openEditModal(["badges"], i, item)} onDelete={() => confirmDelete(["badges"], i, item.text)} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="Reviews" icon={<FiStar />} desc="User reviews" onAdd={() => openAddModal(["reviews"], { name: "New User", date: "Today", text: "Great work!", rating: 5, likes: 0 })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(h.reviews || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.name || "User"} — ${item.rating || 0}★`} onEdit={() => openEditModal(["reviews"], i, item)} onDelete={() => confirmDelete(["reviews"], i, item.name)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("techStack") && (<>{renderField("Tech Name", "text", { required: true })}{renderField("Icon Emoji", "emoji")}</>)}
        {modal?.path.includes("badges") && (<>{renderField("Icon", "icon", { required: true })}{renderField("Text", "text", { required: true })}{renderField("Color", "color", { required: true })}</>)}
        {modal?.path.includes("reviews") && (<>{renderField("Name", "name", { required: true })}{renderField("Date", "date")}{renderField("Rating", "rating", { type: "number" })}{renderField("Likes", "likes", { type: "number" })}{renderField("Review Text", "text", { type: "textarea", required: true })}</>)}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── ABOUT ─────────────────────────────────────────────────────────
  if (section === "about") {
    const a = content as any;
    const sk = "about";
    return (<>
      <div className="space-y-6">
        <FieldArrayInline label="Paragraphs" items={a.paragraphs || []} onChange={v => updateField(sk, ["paragraphs"], v)} />
        <SectionGroup title="Highlights" icon={<FiStar />} desc="Key highlights" onAdd={() => openAddModal(["highlights"], { icon: "FiCode", title: "New Highlight", desc: "Description", iconColor: "text-accent-blue" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(a.highlights || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.title || "Highlight"} onEdit={() => openEditModal(["highlights"], i, item)} onDelete={() => confirmDelete(["highlights"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="Achievements" icon={<FiAward />} desc="Notable accomplishments" onAdd={() => openAddModal(["achievements"], { icon: "🏆", text: "New achievement" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(a.achievements || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.icon || ""} ${item.text || ""}`} icon={item.icon} onEdit={() => openEditModal(["achievements"], i, item)} onDelete={() => confirmDelete(["achievements"], i, item.text)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("highlights") && (<>{renderField("Icon Name", "icon")}{renderField("Title", "title", { required: true })}{renderField("Icon Color", "iconColor")}{renderField("Description", "desc", { type: "textarea", required: true })}</>)}
        {modal?.path.includes("achievements") && (<>{renderField("Icon", "icon", { required: true })}{renderField("Text", "text", { required: true })}</>)}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── SKILLS ─────────────────────────────────────────────────────────
  if (section === "skills") {
    const s = content as any;
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal(["categories"], { title: "New Category", icon: "⚙️", skills: ["Skill 1"] })} label="Add Category" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(s.categories || []).map((cat: any, ci: number) => (
            <ItemCard key={ci} title={`${cat.icon || ""} ${cat.title || ""}`} icon={cat.icon} onEdit={() => openEditModal(["categories"], ci, cat)} onDelete={() => confirmDelete(["categories"], ci, cat.title)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Category" : "Edit Category"}>
        {renderField("Title", "title", { required: true })}{renderField("Icon", "icon")}{renderFieldArray("Skills", "skills")}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── EXPERIENCE ─────────────────────────────────────────────────────
  if (section === "experience") {
    const ex = content as any;
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal(["experiences"], { role: "New Role", company: "Company", period: "Jan 2024 – Present", type: "Full-time", location: "Location", color: "#6366f1", skills: ["Skill 1"], description: ["Description line 1"] })} label="Add Experience" />
        <div className="space-y-2">
          {(ex.experiences || []).map((exp: any, ei: number) => (
            <ItemCard key={ei} title={`${exp.role || ""} @ ${exp.company || ""}`} onEdit={() => openEditModal(["experiences"], ei, exp)} onDelete={() => confirmDelete(["experiences"], ei, exp.role)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Experience" : "Edit Experience"}>
        <div className="grid grid-cols-2 gap-3">{renderField("Role", "role", { required: true })}{renderField("Company", "company", { required: true })}{renderField("Period", "period", { required: true })}{renderField("Type", "type")}{renderField("Location", "location")}{renderField("Color", "color", { type: "color" })}</div>
        {renderFieldArray("Skills", "skills")}{renderFieldArray("Description", "description")}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── EDUCATION ──────────────────────────────────────────────────────
  if (section === "education") {
    const ed = content as any;
    return (<>
      <div className="space-y-6">
        <SectionGroup title="Education" icon={<FiBook />} desc="Academic qualifications" onAdd={() => openAddModal(["education"], { degree: "New Degree", school: "School", period: "Graduated", icon: "🎓" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(ed.education || []).map((item: any, ei: number) => (
              <ItemCard key={ei} title={`${item.icon || ""} ${item.degree || ""}`} icon={item.icon} onEdit={() => openEditModal(["education"], ei, item)} onDelete={() => confirmDelete(["education"], ei, item.degree)} />
            ))}
          </div>
        </SectionGroup>
        <SectionGroup title="Achievements" icon={<FiAward />} desc="Notable accomplishments" onAdd={() => openAddModal(["achievements"], { icon: "🏆", text: "New Achievement", gradient: "from-yellow-500/20", accent: "text-yellow-400" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {(ed.achievements || []).map((item: any, ai: number) => (
              <ItemCard key={ai} title={`${item.icon || ""} ${item.text || ""}`} icon={item.icon} onEdit={() => openEditModal(["achievements"], ai, item)} onDelete={() => confirmDelete(["achievements"], ai, item.text)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("education") && (<>{renderField("Degree", "degree", { required: true })}{renderField("School", "school", { required: true })}{renderField("Period", "period")}{renderField("Icon", "icon")}</>)}
        {modal?.path.includes("achievements") && (<>{renderField("Icon", "icon", { required: true })}{renderField("Text", "text", { required: true })}{renderField("Gradient", "gradient")}{renderField("Accent", "accent")}</>)}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── PROJECTS ───────────────────────────────────────────────────────
  if (section === "projects") {
    const p = content as any;
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal(["projects"], { id: Date.now(), title: "New Project", description: "Description", techStack: ["Flutter"], androidLink: "", iosLink: "", githubLink: "", features: ["Feature 1"], role: "Role", category: "mobile", appIcon: "" })} label="Add Project" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {(p.projects || []).map((proj: any, pi: number) => (
            <ItemCard key={pi} title={`#${proj.id || ""} ${proj.title || ""}`} onEdit={() => openEditModal(["projects"], pi, proj)} onDelete={() => confirmDelete(["projects"], pi, proj.title)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Project" : "Edit Project"}>
        <div className="grid grid-cols-2 gap-3">
          {renderField("Title", "title", { required: true })}{renderField("Category", "category")}
          {renderField("Android Link", "androidLink")}{renderField("iOS Link", "iosLink")}
          {renderField("GitHub Link", "githubLink")}{renderField("ID", "id", { type: "number" })}
        </div>
        <div>
          <label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">App Icon URL</label>
          <div className="flex gap-2">
            <input value={formData.appIcon as string || ""} onChange={(e) => setFd("appIcon", e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20" placeholder="Auto-filled" />
            {(formData.androidLink as string || formData.iosLink as string) && (
              <button onClick={async () => {
                const link = (formData.androidLink as string) || (formData.iosLink as string);
                if (!link) return;
                try {
                  const res = await fetch("/api/fetch-app-icon", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: link }) });
                  const d = await res.json();
                  if (d.iconUrl) setFd("appIcon", d.iconUrl); else alert("Could not fetch icon");
                } catch { alert("Network error"); }
              }} className="px-3 py-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-all flex items-center gap-1 flex-shrink-0">
                <FiArrowUpRight className="w-3 h-3" /> Fetch
              </button>
            )}
          </div>
        </div>
        {renderField("Description", "description", { type: "textarea", required: true })}
        {renderField("Role", "role", { type: "textarea" })}
        {renderFieldArray("Tech Stack", "techStack")}{renderFieldArray("Features", "features")}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── TESTIMONIALS ────────────────────────────────────────────────────
  if (section === "testimonials") {
    const t = content as any;
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal(["testimonials"], { name: "New Person", role: "Role", avatar: "NP", quote: "Great work!", rating: 5 })} label="Add Testimonial" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {(t.testimonials || []).map((test: any, ti: number) => (
            <ItemCard key={ti} title={`${test.name || ""} — ${test.role || ""}`} onEdit={() => openEditModal(["testimonials"], ti, test)} onDelete={() => confirmDelete(["testimonials"], ti, test.name)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Testimonial" : "Edit Testimonial"}>
        <div className="grid grid-cols-2 gap-3">{renderField("Name", "name", { required: true })}{renderField("Role", "role")}{renderField("Avatar", "avatar")}{renderField("Rating", "rating", { type: "number" })}</div>
        {renderField("Quote", "quote", { type: "textarea", required: true })}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── STATS ───────────────────────────────────────────────────────────
  if (section === "stats") {
    const st = content as any;
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal(["stats"], { value: 10, suffix: "+", label: "New Stat", desc: "Description" })} label="Add Stat" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {(st.stats || []).map((stat: any, si: number) => (
            <ItemCard key={si} title={`${stat.label || ""} — ${stat.value || 0}${stat.suffix || ""}`} onEdit={() => openEditModal(["stats"], si, stat)} onDelete={() => confirmDelete(["stats"], si, stat.label)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Stat" : "Edit Stat"}>
        <div className="grid grid-cols-2 gap-3">{renderField("Value", "value", { type: "number", required: true })}{renderField("Suffix", "suffix")}{renderField("Label", "label", { required: true })}{renderField("Description", "desc")}</div>
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── CONTACT ─────────────────────────────────────────────────────────
  if (section === "contact") {
    const c = content as any;
    const sk = "contact";
    return (<div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputB label="Email" value={c.email || ""} onChange={v => updateField(sk, ["email"], v)} />
        <InputB label="Phone" value={c.phone || ""} onChange={v => updateField(sk, ["phone"], v)} />
        <InputB label="Location" value={c.location || ""} onChange={v => updateField(sk, ["location"], v)} />
        <InputB label="LinkedIn URL" value={c.linkedin || ""} onChange={v => updateField(sk, ["linkedin"], v)} />
      </div>
    </div>);
  }

  // ─── SOCIAL LINKS ───────────────────────────────────────────────────
  if (section === "socialLinks") {
    const items = content as unknown as any[];
    const iconOpts = ["FiGithub","FiLinkedin","FaWhatsapp","FiMail","FiTwitter","FiYoutube","FiLink","FiGlobe","FiInstagram","FiFacebook"];
    return (<>
      <div className="space-y-4">
        <AddButton onClick={() => openAddModal([], { platform: "GitHub", url: "https://", icon: "FiGithub" })} label="Add Link" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {(items || []).map((link: any, i: number) => (
            <ItemCard key={i} title={link.platform || "Link"} onEdit={() => openEditModal([], i, link)} onDelete={() => confirmDelete([], i, link.platform)} />
          ))}
        </div>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Link" : "Edit Link"}>
        {renderField("Platform", "platform", { required: true })}
        {(formData.platform as string || "").toLowerCase().includes("whats") ? (
          <div className="space-y-3">
            {renderField("Phone Number", "phone", { required: true, hint: "e.g. 9198XXXXXXXX" })}
            {renderField("Message (optional)", "message")}
          </div>
        ) : renderField("URL", "url", { required: true })}
        <div><label className="block text-slate-500 text-xs font-medium mb-1.5 tracking-wide">Icon</label>
          <select value={formData.icon as string || "FiGlobe"} onChange={(e) => setFd("icon", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm">
            {iconOpts.map(opt => (<option key={opt} value={opt}>{opt.replace(/^(Fi|Fa)/, "")}</option>))}
          </select>
        </div>
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── SETTINGS ───────────────────────────────────────────────────────
  if (section === "settings") {
    const set = content as any;
    return (<div className="space-y-6">
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-base"><FiSettings className="w-4 h-4 text-slate-400" /></div>
          <div><h3 className="text-white font-semibold text-sm">Site Settings</h3><p className="text-slate-600 text-[10px]">Basic site configuration</p></div>
        </div>
        <InputB label="Site Title" value={set.title || ""} onChange={v => updateField("settings", ["title"], v)} />
        <TextareaB label="Site Description" value={set.description || ""} onChange={v => updateField("settings", ["description"], v)} />
        <FieldArrayInline label="Keywords" items={set.keywords || []} onChange={v => updateField("settings", ["keywords"], v)} />
        <div className="flex items-center justify-between p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center text-sm">✨</div>
            <div><p className="text-slate-300 text-sm font-medium">Particle Background</p><p className="text-slate-600 text-[11px]">Animated particles on hero</p></div>
          </div>
          <button onClick={() => updateField("settings", ["particles"], !set.particles)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${set.particles ? "bg-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-white/[0.08]"}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${set.particles ? "left-6" : "left-1"}`} />
          </button>
        </div>
      </div>
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-base"><FiLock className="w-4 h-4 text-red-400" /></div>
          <div><h3 className="text-white font-semibold text-sm">Change Password</h3><p className="text-slate-600 text-[10px]">Update admin login password</p></div>
        </div>
        <PasswordChangeForm />
      </div>
    </div>);
  }

  return <p className="text-slate-600 text-center py-12 text-sm">Select a section from the sidebar.</p>;
}

function ConfirmDlgCustom({ deleteConfirm, setDeleteConfirm, executeDelete }: {
  deleteConfirm: { path: string[]; index: number; title?: string } | null;
  setDeleteConfirm: (v: any) => void;
  executeDelete: () => Promise<void>;
}) {
  if (!deleteConfirm) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
      <div className="relative w-full max-w-sm bg-[#151520] border border-white/[0.06] rounded-xl p-6 shadow-2xl shadow-black/40">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
          <FiStar className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-white font-semibold text-base mb-2 text-center">Delete Item</h3>
        <p className="text-slate-500 text-sm mb-6 text-center">
          Are you sure you want to delete <strong className="text-slate-300">{deleteConfirm.title || "this item"}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => setDeleteConfirm(null)}
            className="px-5 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 text-sm font-medium hover:bg-white/[0.08] transition-all">
            Cancel
          </button>
          <button onClick={executeDelete}
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold hover:from-red-500 hover:to-rose-500 transition-all shadow-lg shadow-red-500/15">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
