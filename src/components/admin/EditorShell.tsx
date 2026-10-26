"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiCode, FiAward, FiStar, FiBriefcase, FiBook, FiUser,
  FiTool, FiFolder, FiMessageSquare, FiBarChart2, FiMail, FiLink,
  FiSettings, FiLock, FiArrowUpRight,
  FiCompass, FiMenu, FiGitBranch, FiLayers,
} from "react-icons/fi";
import {
  SectionGroup, ItemCard, AddButton, Modal, ActionButtons,
} from "./ModalComponents";
import {
  FormField, FormFieldArray, InputB, TextareaB, FieldArrayInline, CodeEditorB, PasswordChangeForm,
} from "./FormComponents";
import ResumeUploader from "./ResumeUploader";
import PhotoUploader from "./PhotoUploader";

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
    badges: ["text"],
    highlights: ["title", "desc"], "about-achievements": ["icon", "text"], categories: ["title"],
    experiences: ["role", "company", "period"], education: ["degree", "school"],
    "education-achievements": ["icon", "text"], projects: ["title", "description"],
    testimonials: ["name", "quote"], stats: ["label", "value"], socialLinks: ["platform"],
    pages: ["title", "href"], links: ["label", "href"], quickLinks: ["label", "href"],
    steps: ["n", "title", "phase", "deliverable"], phases: ["n", "title"],
    deliverables: ["title", "desc"], models: ["title", "desc"], faqs: ["q", "a"],
    pipelineSteps: ["label", "desc"], platforms: ["label"],
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
        <Panel title="Identity & status" icon={<FiUser />} desc="Avatar header: availability, mode, location, portfolio tag">
          <div className="mb-4">
            <PhotoUploader value={h.photoUrl || ""} onChange={(url) => updateField(sk, ["photoUrl"], url)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputB label="Prefix" value={h.prefix || ""} onChange={v => updateField(sk, ["prefix"], v)} hint="e.g. Er." />
            <InputB label="Name" value={h.name || ""} onChange={v => updateField(sk, ["name"], v)} />
            <InputB label="Surname" value={h.surname || ""} onChange={v => updateField(sk, ["surname"], v)} />
            <InputB label="Available Text" value={h.availableText || ""} onChange={v => updateField(sk, ["availableText"], v)} />
            <InputB label="Work Mode" value={h.workMode || ""} onChange={v => updateField(sk, ["workMode"], v)} hint="e.g. Remote / On-site" />
            <InputB label="Location" value={h.location || ""} onChange={v => updateField(sk, ["location"], v)} />
            <InputB label="Portfolio Tag" value={h.portfolioTag || ""} onChange={v => updateField(sk, ["portfolioTag"], v)} />
            <InputB label="Kicker (divider line)" value={h.kicker || ""} onChange={v => updateField(sk, ["kicker"], v)} />
          </div>
        </Panel>

        <Panel title="Headline" icon={<FiCode />} desc="Typed roles, experience line and bio">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Experience Line" value={h.experienceLine || ""} onChange={v => updateField(sk, ["experienceLine"], v)} hint="Shown under the typed role" />
          </div>
          <div className="mt-4"><FieldArrayInline label="Roles (typing animation)" items={h.roles || []} onChange={v => updateField(sk, ["roles"], v)} /></div>
          <div className="mt-4"><TextareaB label="Bio / Tagline" value={h.tagline || ""} onChange={v => updateField(sk, ["tagline"], v)} /></div>
        </Panel>

        <div className="md:col-span-2 lg:col-span-3">
          <ResumeUploader resumeUrl={h.resumeUrl || ""} onResumeUrlChange={(url) => updateField(sk, ["resumeUrl"], url)} />
        </div>

        <Panel title="Buttons & status row" icon={<FiArrowUpRight />} desc="CTA labels and the bottom status line">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputB label="Primary CTA" value={h.ctaProjects || ""} onChange={v => updateField(sk, ["ctaProjects"], v)} />
            <InputB label="Resume CTA" value={h.ctaResume || ""} onChange={v => updateField(sk, ["ctaResume"], v)} />
            <InputB label="Status Line" value={h.statusLine || ""} onChange={v => updateField(sk, ["statusLine"], v)} hint="e.g. Open to select projects" />
            <InputB label="Platforms" value={h.platforms || ""} onChange={v => updateField(sk, ["platforms"], v)} hint="e.g. Android · iOS · Web" />
          </div>
        </Panel>

        <Panel title="Side cards" icon={<FiBarChart2 />} desc="The two small cards next to the code showcase">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Card 1 Title" value={h.card1Title || ""} onChange={v => updateField(sk, ["card1Title"], v)} />
            <InputB label="Card 1 Desc" value={h.card1Desc || ""} onChange={v => updateField(sk, ["card1Desc"], v)} />
            <InputB label="Card 2 Value" value={h.card2Value || ""} onChange={v => updateField(sk, ["card2Value"], v)} hint="e.g. 4.9" />
            <InputB label="Card 2 Suffix" value={h.card2Suffix || ""} onChange={v => updateField(sk, ["card2Suffix"], v)} hint="e.g. / 5" />
            <InputB label="Card 2 Title" value={h.card2Title || ""} onChange={v => updateField(sk, ["card2Title"], v)} />
            <InputB label="Card 2 Desc" value={h.card2Desc || ""} onChange={v => updateField(sk, ["card2Desc"], v)} />
          </div>
        </Panel>

        <Panel title="Code showcase" icon={<FiCode />} desc="The typing code card in the hero">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputB label="Flutter File" value={h.flutterFile || ""} onChange={v => updateField(sk, ["flutterFile"], v)} />
            <InputB label="React Native File" value={h.rnFile || ""} onChange={v => updateField(sk, ["rnFile"], v)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeEditorB label="Flutter Code" value={h.flutterCode || ""} onChange={v => updateField(sk, ["flutterCode"], v)} />
            <CodeEditorB label="React Native Code" value={h.rnCode || ""} onChange={v => updateField(sk, ["rnCode"], v)} />
          </div>
        </Panel>

        <SectionGroup title="Achievement badges" icon={<FiAward />} desc="Chips under the bio" onAdd={() => openAddModal(["badges"], { icon: "🏆", text: "New Badge" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(h.badges || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.icon || ""} ${item.text || "Badge"}`} icon={item.icon} onEdit={() => openEditModal(["badges"], i, item)} onDelete={() => confirmDelete(["badges"], i, item.text)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("badges") && (<>{renderField("Icon / emoji", "icon")}{renderField("Text", "text", { required: true })}</>)}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── FEATURED (home) ───────────────────────────────────────────────
  if (section === "featured") {
    const ft = content as any;
    const sk = "featured";
    return (<div className="space-y-4">
      <Panel title="Selected work header" icon={<FiFolder />} desc="Headings and stat card on the home page">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputB label="Kicker" value={ft.kicker || ""} onChange={v => updateField(sk, ["kicker"], v)} />
          <InputB label="Title" value={ft.title || ""} onChange={v => updateField(sk, ["title"], v)} />
          <InputB label="Link Text" value={ft.linkText || ""} onChange={v => updateField(sk, ["linkText"], v)} />
          <InputB label="Link Href" value={ft.linkHref || ""} onChange={v => updateField(sk, ["linkHref"], v)} />
          <InputB label="Stat Title" value={ft.statTitle || ""} onChange={v => updateField(sk, ["statTitle"], v)} />
          <InputB label="Stat Desc" value={ft.statDesc || ""} onChange={v => updateField(sk, ["statDesc"], v)} />
          <InputB label="Stat Tag" value={ft.statTag || ""} onChange={v => updateField(sk, ["statTag"], v)} />
        </div>
      </Panel>
    </div>);
  }

  // ─── MARQUEE ───────────────────────────────────────────────────────
  if (section === "marquee") {
    const m = content as any;
    return (<div className="space-y-4">
      <FieldArrayInline label="Ticker items" items={m.tools || []} onChange={v => updateField("marquee", ["tools"], v)} />
    </div>);
  }

  // ─── EXPLORE ───────────────────────────────────────────────────────
  if (section === "explore") {
    const ex = content as any;
    const sk = "explore";
    return (<>
      <div className="space-y-6">
        <Panel title="Section header" icon={<FiCompass />} desc="Keep exploring heading and link">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={ex.label || ""} onChange={v => updateField(sk, ["label"], v)} />
            <InputB label="Title" value={ex.title || ""} onChange={v => updateField(sk, ["title"], v)} />
            <InputB label="Link Text" value={ex.linkText || ""} onChange={v => updateField(sk, ["linkText"], v)} />
            <InputB label="Link Href" value={ex.linkHref || ""} onChange={v => updateField(sk, ["linkHref"], v)} />
          </div>
        </Panel>
        <SectionGroup title="Explore cards" icon={<FiCompass />} desc="Page cards with icon names (e.g. FiUser, FiCpu)" onAdd={() => openAddModal(["pages"], { title: "New Page", desc: "Description", href: "/about", icon: "FiUser", n: "01" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(ex.pages || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.n || ""} · ${item.title || "Page"}`} onEdit={() => openEditModal(["pages"], i, item)} onDelete={() => confirmDelete(["pages"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Card" : "Edit Card"}>
        <div className="grid grid-cols-2 gap-3">
          {renderField("Title", "title", { required: true })}
          {renderField("Number", "n", { hint: "01" })}
          {renderField("Href", "href", { required: true })}
          {renderField("Icon", "icon", { hint: "FiUser, FiCpu…" })}
        </div>
        {renderField("Description", "desc", { type: "textarea", required: true })}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── NAVBAR ────────────────────────────────────────────────────────
  if (section === "navbar") {
    const nb = content as any;
    const sk = "navbar";
    return (<>
      <div className="space-y-6">
        <Panel title="CTA buttons" icon={<FiArrowUpRight />} desc="Header and mobile menu buttons">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InputB label="Desktop CTA" value={nb.ctaLabel || ""} onChange={v => updateField(sk, ["ctaLabel"], v)} />
            <InputB label="CTA Href" value={nb.ctaHref || ""} onChange={v => updateField(sk, ["ctaHref"], v)} />
            <InputB label="Mobile CTA" value={nb.mobileCtaLabel || ""} onChange={v => updateField(sk, ["mobileCtaLabel"], v)} />
          </div>
        </Panel>
        <SectionGroup title="Menu links" icon={<FiMenu />} desc="Navigation items in order" onAdd={() => openAddModal(["links"], { label: "New Link", href: "/" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(nb.links || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.label || "Link"} onEdit={() => openEditModal(["links"], i, item)} onDelete={() => confirmDelete(["links"], i, item.label)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Link" : "Edit Link"}>
        {renderField("Label", "label", { required: true })}
        {renderField("Href", "href", { required: true })}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── FOOTER ────────────────────────────────────────────────────────
  if (section === "footer") {
    const ft = content as any;
    const sk = "footer";
    return (<>
      <div className="space-y-6">
        <Panel title="Brand & bio" icon={<FiUser />} desc="Logo text, bio and contact chips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Brand" value={ft.brand || ""} onChange={v => updateField(sk, ["brand"], v)} />
            <InputB label="Location" value={ft.location || ""} onChange={v => updateField(sk, ["location"], v)} />
            <InputB label="Phone" value={ft.phone || ""} onChange={v => updateField(sk, ["phone"], v)} />
            <InputB label="Years" type="number" value={String(ft.years ?? "")} onChange={v => updateField(sk, ["years"], parseInt(v) || 0)} />
            <InputB label="Years Label" value={ft.yearsLabel || ""} onChange={v => updateField(sk, ["yearsLabel"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Bio" value={ft.bio || ""} onChange={v => updateField(sk, ["bio"], v)} /></div>
        </Panel>

        <Panel title="CTA banner" icon={<FiArrowUpRight />} desc="The big 'Let's build' banner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={ft.ctaKicker || ""} onChange={v => updateField(sk, ["ctaKicker"], v)} />
            <InputB label="Before accent" value={ft.ctaBefore || ""} onChange={v => updateField(sk, ["ctaBefore"], v)} />
            <InputB label="Accent word" value={ft.ctaAccent || ""} onChange={v => updateField(sk, ["ctaAccent"], v)} />
            <InputB label="After accent" value={ft.ctaAfter || ""} onChange={v => updateField(sk, ["ctaAfter"], v)} />
            <InputB label="Button" value={ft.ctaButton || ""} onChange={v => updateField(sk, ["ctaButton"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Description" value={ft.ctaDesc || ""} onChange={v => updateField(sk, ["ctaDesc"], v)} /></div>
        </Panel>

        <Panel title="Labels & availability" icon={<FiLink />} desc="Column headings and availability card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Navigate Label" value={ft.navigateLabel || ""} onChange={v => updateField(sk, ["navigateLabel"], v)} />
            <InputB label="Connect Label" value={ft.connectLabel || ""} onChange={v => updateField(sk, ["connectLabel"], v)} />
            <InputB label="Availability Title" value={ft.availabilityTitle || ""} onChange={v => updateField(sk, ["availabilityTitle"], v)} />
            <InputB label="Availability Desc" value={ft.availabilityDesc || ""} onChange={v => updateField(sk, ["availabilityDesc"], v)} />
            <InputB label="Copyright" value={ft.bottomLeft || ""} onChange={v => updateField(sk, ["bottomLeft"], v)} hint="After © year" />
            <InputB label="Right note" value={ft.bottomRight || ""} onChange={v => updateField(sk, ["bottomRight"], v)} />
          </div>
        </Panel>

        <SectionGroup title="Quick links" icon={<FiLink />} desc="Footer navigation" onAdd={() => openAddModal(["quickLinks"], { label: "Home", href: "/" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(ft.quickLinks || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.label || "Link"} onEdit={() => openEditModal(["quickLinks"], i, item)} onDelete={() => confirmDelete(["quickLinks"], i, item.label)} />
            ))}
          </div>
        </SectionGroup>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Link" : "Edit Link"}>
        {renderField("Label", "label", { required: true })}
        {renderField("Href", "href", { required: true })}
        <ActionButtons isAdd={modal?.type === "add"} onSave={saveModal} onCancel={closeModal} />
      </Modal>
      <ConfirmDlgCustom {...{ deleteConfirm, setDeleteConfirm, executeDelete }} />
    </>);
  }

  // ─── PROCESS ───────────────────────────────────────────────────────
  if (section === "process") {
    const pr = content as any;
    const sk = "process";
    return (<>
      <div className="space-y-6">
        <Panel title="Headings" icon={<FiGitBranch />} desc="Process page titles (home + full page)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Title (full page)" value={pr.titleFull || ""} onChange={v => updateField(sk, ["titleFull"], v)} />
            <InputB label="Title (home)" value={pr.titleHome || ""} onChange={v => updateField(sk, ["titleHome"], v)} />
            <InputB label="Flow label" value={pr.flowLabel || ""} onChange={v => updateField(sk, ["flowLabel"], v)} />
            <InputB label="Flow meta" value={pr.flowMeta || ""} onChange={v => updateField(sk, ["flowMeta"], v)} />
            <InputB label="Flow link text" value={pr.flowLink || ""} onChange={v => updateField(sk, ["flowLink"], v)} />
            <InputB label="Flow link href" value={pr.flowLinkHref || ""} onChange={v => updateField(sk, ["flowLinkHref"], v)} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <TextareaB label="Subtitle (full page)" value={pr.subtitleFull || ""} onChange={v => updateField(sk, ["subtitleFull"], v)} />
            <TextareaB label="Subtitle (home)" value={pr.subtitleHome || ""} onChange={v => updateField(sk, ["subtitleHome"], v)} />
          </div>
        </Panel>

        <SectionGroup title="Delivery flow steps" icon={<FiGitBranch />} desc="The 9-stage flow (icon = FiName)" onAdd={() => openAddModal(["steps"], { n: "10", title: "New Step", phase: "Discover", deliverable: "Deliverable", desc: "Description", icon: "FiZap" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(pr.steps || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.n || ""} · ${item.title || "Step"}`} onEdit={() => openEditModal(["steps"], i, item)} onDelete={() => confirmDelete(["steps"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>

        <SectionGroup title="Quick stats" icon={<FiBarChart2 />} desc="Four stat tiles under the flow" onAdd={() => openAddModal(["stats"], { value: "1", label: "label" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(pr.stats || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.value || ""} — ${item.label || ""}`} onEdit={() => openEditModal(["stats"], i, item)} onDelete={() => confirmDelete(["stats"], i, item.label)} />
            ))}
          </div>
        </SectionGroup>

        <Panel title="Surfaces card" icon={<FiLayers />} desc="Delivery surfaces side card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Label" value={pr.surfacesLabel || ""} onChange={v => updateField(sk, ["surfacesLabel"], v)} />
            <InputB label="Headline" value={pr.surfacesHeadline || ""} onChange={v => updateField(sk, ["surfacesHeadline"], v)} />
            <InputB label="Sub" value={pr.surfacesSub || ""} onChange={v => updateField(sk, ["surfacesSub"], v)} />
            <InputB label="Backend note" value={pr.surfacesNote || ""} onChange={v => updateField(sk, ["surfacesNote"], v)} />
            <InputB label="Footer text" value={pr.surfacesFooter || ""} onChange={v => updateField(sk, ["surfacesFooter"], v)} />
          </div>
          <div className="mt-4">
            <SectionGroup title="Platforms" icon={<FiLayers />} desc="Android / iOS / Web tiles" onAdd={() => openAddModal(["platforms"], { label: "Web", icon: "FiGlobe" })}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(pr.platforms || []).map((item: any, i: number) => (
                  <ItemCard key={i} title={item.label || "Platform"} onEdit={() => openEditModal(["platforms"], i, item)} onDelete={() => confirmDelete(["platforms"], i, item.label)} />
                ))}
              </div>
            </SectionGroup>
          </div>
        </Panel>

        <Panel title="Freelance card" icon={<FiMail />} desc="Open for freelance side card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={pr.freelanceKicker || ""} onChange={v => updateField(sk, ["freelanceKicker"], v)} />
            <InputB label="Title" value={pr.freelanceTitle || ""} onChange={v => updateField(sk, ["freelanceTitle"], v)} />
            <InputB label="CTA" value={pr.freelanceCta || ""} onChange={v => updateField(sk, ["freelanceCta"], v)} />
            <InputB label="Note" value={pr.freelanceNote || ""} onChange={v => updateField(sk, ["freelanceNote"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Description" value={pr.freelanceDesc || ""} onChange={v => updateField(sk, ["freelanceDesc"], v)} /></div>
          <div className="mt-4"><FieldArrayInline label="Bullets" items={pr.freelanceBullets || []} onChange={v => updateField(sk, ["freelanceBullets"], v)} /></div>
        </Panel>

        <Panel title="Pipeline section" icon={<FiLayers />} desc="Live pipeline intro, steps and rules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={pr.pipeKicker || ""} onChange={v => updateField(sk, ["pipeKicker"], v)} />
            <InputB label="Title" value={pr.pipeTitle || ""} onChange={v => updateField(sk, ["pipeTitle"], v)} />
            <InputB label="Rules title" value={pr.rulesTitle || ""} onChange={v => updateField(sk, ["rulesTitle"], v)} />
            <InputB label="Foot title" value={pr.pipelineFootTitle || ""} onChange={v => updateField(sk, ["pipelineFootTitle"], v)} />
            <InputB label="Foot desc" value={pr.pipelineFootDesc || ""} onChange={v => updateField(sk, ["pipelineFootDesc"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Description" value={pr.pipeDesc || ""} onChange={v => updateField(sk, ["pipeDesc"], v)} /></div>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <FieldArrayInline label="Rules" items={pr.rules || []} onChange={v => updateField(sk, ["rules"], v)} />
            <FieldArrayInline label="Rule tags" items={pr.ruleTags || []} onChange={v => updateField(sk, ["ruleTags"], v)} />
          </div>
          <div className="mt-4">
            <SectionGroup title="Pipeline steps" icon={<FiLayers />} desc="Animated pipeline list" onAdd={() => openAddModal(["pipelineSteps"], { label: "Step", desc: "Description", icon: "FiZap" })}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(pr.pipelineSteps || []).map((item: any, i: number) => (
                  <ItemCard key={i} title={item.label || "Step"} onEdit={() => openEditModal(["pipelineSteps"], i, item)} onDelete={() => confirmDelete(["pipelineSteps"], i, item.label)} />
                ))}
              </div>
            </SectionGroup>
          </div>
        </Panel>

        <SectionGroup title="Delivery phases" icon={<FiGitBranch />} desc="Phase table with output and sign-off" onAdd={() => openAddModal(["phases"], { n: "06", title: "New phase", output: "Output", gate: "Gate" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(pr.phases || []).map((item: any, i: number) => (
              <ItemCard key={i} title={`${item.n || ""} · ${item.title || "Phase"}`} onEdit={() => openEditModal(["phases"], i, item)} onDelete={() => confirmDelete(["phases"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>

        <SectionGroup title="Deliverables" icon={<FiFolder />} desc="Everything you ship (icon = FiName)" onAdd={() => openAddModal(["deliverables"], { icon: "FiFileText", title: "New deliverable", desc: "Description" })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(pr.deliverables || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.title || "Deliverable"} onEdit={() => openEditModal(["deliverables"], i, item)} onDelete={() => confirmDelete(["deliverables"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>

        <SectionGroup title="Engagement models" icon={<FiBriefcase />} desc="Fixed-scope / retainer / contract" onAdd={() => openAddModal(["models"], { title: "New model", tag: "Best for …", desc: "Description", points: ["Point 1"], accent: false })}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(pr.models || []).map((item: any, i: number) => (
              <ItemCard key={i} title={item.title || "Model"} onEdit={() => openEditModal(["models"], i, item)} onDelete={() => confirmDelete(["models"], i, item.title)} />
            ))}
          </div>
        </SectionGroup>

        <Panel title="Quality gates" icon={<FiLock />} desc="Definition of done checklist">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Title" value={pr.qualityTitle || ""} onChange={v => updateField(sk, ["qualityTitle"], v)} />
            <InputB label="Subtitle" value={pr.qualitySub || ""} onChange={v => updateField(sk, ["qualitySub"], v)} />
          </div>
          <div className="mt-4"><FieldArrayInline label="Gates" items={pr.qualityGates || []} onChange={v => updateField(sk, ["qualityGates"], v)} /></div>
        </Panel>

        <Panel title="Discovery call card" icon={<FiMail />} desc="How we start card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={pr.startKicker || ""} onChange={v => updateField(sk, ["startKicker"], v)} />
            <InputB label="Title" value={pr.startTitle || ""} onChange={v => updateField(sk, ["startTitle"], v)} />
            <InputB label="CTA" value={pr.startCta || ""} onChange={v => updateField(sk, ["startCta"], v)} />
            <InputB label="Note" value={pr.startNote || ""} onChange={v => updateField(sk, ["startNote"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Description" value={pr.startDesc || ""} onChange={v => updateField(sk, ["startDesc"], v)} /></div>
          <div className="mt-4"><FieldArrayInline label="Points" items={pr.startPoints || []} onChange={v => updateField(sk, ["startPoints"], v)} /></div>
        </Panel>

        <Panel title="FAQ" icon={<FiMessageSquare />} desc="Frequently asked questions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Kicker" value={pr.faqKicker || ""} onChange={v => updateField(sk, ["faqKicker"], v)} />
            <InputB label="Title" value={pr.faqTitle || ""} onChange={v => updateField(sk, ["faqTitle"], v)} />
            <InputB label="Still question title" value={pr.faqStillTitle || ""} onChange={v => updateField(sk, ["faqStillTitle"], v)} />
            <InputB label="Still question CTA" value={pr.faqStillCta || ""} onChange={v => updateField(sk, ["faqStillCta"], v)} />
            <InputB label="Still question desc" value={pr.faqStillDesc || ""} onChange={v => updateField(sk, ["faqStillDesc"], v)} />
          </div>
          <div className="mt-4"><TextareaB label="Description" value={pr.faqDesc || ""} onChange={v => updateField(sk, ["faqDesc"], v)} /></div>
          <div className="mt-4"><FieldArrayInline label="FAQ tags" items={pr.faqTags || []} onChange={v => updateField(sk, ["faqTags"], v)} /></div>
          <div className="mt-4">
            <SectionGroup title="Questions" icon={<FiMessageSquare />} desc="Q and A list" onAdd={() => openAddModal(["faqs"], { q: "New question?", a: "Answer" })}>
              <div className="grid grid-cols-1 gap-2">
                {(pr.faqs || []).map((item: any, i: number) => (
                  <ItemCard key={i} title={item.q || "Question"} onEdit={() => openEditModal(["faqs"], i, item)} onDelete={() => confirmDelete(["faqs"], i, item.q)} />
                ))}
              </div>
            </SectionGroup>
          </div>
        </Panel>
      </div>
      <Modal open={!!modal} onClose={closeModal} title={modal?.type === "add" ? "Add Item" : "Edit Item"}>
        {modal?.path.includes("steps") && (<><div className="grid grid-cols-2 gap-3">{renderField("Number", "n")}{renderField("Title", "title", { required: true })}{renderField("Phase", "phase", { required: true })}{renderField("Icon", "icon", { hint: "FiSearch, FiCode…" })}</div>{renderField("Deliverable", "deliverable", { required: true })}{renderField("Description", "desc", { type: "textarea" })}</>)}
        {modal?.path.includes("stats") && (<div className="grid grid-cols-2 gap-3">{renderField("Value", "value", { required: true })}{renderField("Label", "label", { required: true })}</div>)}
        {modal?.path.includes("platforms") && (<div className="grid grid-cols-2 gap-3">{renderField("Label", "label", { required: true })}{renderField("Icon", "icon", { hint: "FaAndroid, FiGlobe…" })}</div>)}
        {modal?.path.includes("pipelineSteps") && (<>{renderField("Label", "label", { required: true })}{renderField("Icon", "icon", { hint: "FiSearch…" })}{renderField("Description", "desc", { type: "textarea", required: true })}</>)}
        {modal?.path.includes("phases") && (<><div className="grid grid-cols-2 gap-3">{renderField("Number", "n")}{renderField("Title", "title", { required: true })}</div>{renderField("Output", "output", { type: "textarea" })}{renderField("Sign-off gate", "gate")}</>)}
        {modal?.path.includes("deliverables") && (<>{renderField("Icon", "icon", { hint: "FiFileText…" })}{renderField("Title", "title", { required: true })}{renderField("Description", "desc", { type: "textarea", required: true })}</>)}
        {modal?.path.includes("models") && (<>{renderField("Title", "title", { required: true })}{renderField("Tag", "tag")}{renderField("Description", "desc", { type: "textarea", required: true })}{renderFieldArray("Points", "points")}{renderField("Featured (true/false)", "accent", { hint: "true shows highlighted border" })}</>)}
        {modal?.path.includes("faqs") && (<>{renderField("Question", "q", { required: true })}{renderField("Answer", "a", { type: "textarea", required: true })}</>)}
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
        <Panel title="Currently card" icon={<FiUser />} desc="The 'Currently' card in the About section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputB label="Label" value={a.currentlyLabel || ""} onChange={v => updateField(sk, ["currentlyLabel"], v)} hint="e.g. Currently" />
            <InputB label="Title" value={a.currently || ""} onChange={v => updateField(sk, ["currently"], v)} hint="e.g. Building mobile apps..." />
            <InputB label="Focus" value={a.focus || ""} onChange={v => updateField(sk, ["focus"], v)} />
            <InputB label="Frameworks & Libraries" value={a.frameworks || ""} onChange={v => updateField(sk, ["frameworks"], v)} />
            <InputB label="Backend & APIs" value={a.backend || ""} onChange={v => updateField(sk, ["backend"], v)} />
            <InputB label="Database" value={a.database || ""} onChange={v => updateField(sk, ["database"], v)} />
            <InputB label="Cloud & Services" value={a.cloud || ""} onChange={v => updateField(sk, ["cloud"], v)} />
            <InputB label="Experience" value={a.experience || ""} onChange={v => updateField(sk, ["experience"], v)} />
            <InputB label="Dev badge" value={a.devBadge || ""} onChange={v => updateField(sk, ["devBadge"], v)} hint="e.g. dev" />
          </div>
        </Panel>
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
          {renderField("Domain", "domain", { hint: "e.g. Healthcare · Singapore" })}{renderField("ID", "id", { type: "number" })}
          {renderField("Android Link", "androidLink")}{renderField("iOS Link", "iosLink")}
          {renderField("GitHub Link", "githubLink")}{renderField("Industry", "industry")}
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

function Panel({ title, icon, desc, children }: {
  title: string; icon: React.ReactNode; desc: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center text-base text-slate-400">{icon}</div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-slate-600 text-[10px]">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ConfirmDlgCustom({ deleteConfirm, setDeleteConfirm, executeDelete }: {
  deleteConfirm: { path: string[]; index: number; title?: string } | null;
  setDeleteConfirm: (v: any) => void;
  executeDelete: () => Promise<void>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!deleteConfirm || !mounted) return null;
  return createPortal(
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
    </div>,
    document.body
  );
}
