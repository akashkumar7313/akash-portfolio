import React from "react";

interface AdminSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
    onSave: () => void;
    saving: boolean;
    accent: string;
}

const AdminSection: React.FC<AdminSectionProps> = ({
    title,
    description,
    children,
    onSave,
    saving,
    accent,
}) => {
    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800/50 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <p className="text-slate-400 text-sm">{description}</p>
                </div>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${saving
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : `bg-gradient-to-r ${accent} text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-400/30`}
          `}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

export default AdminSection;
