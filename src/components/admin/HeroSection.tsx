import React from "react";
import AdminSection from "./AdminSection";
import { HeroData } from "@/lib/db";

interface HeroSectionProps {
    heroData: HeroData;
    updateField: (section: string, path: string[], value: unknown) => void;
    saveSection: (section: string) => Promise<void>;
    saving: string | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
    heroData,
    updateField,
    saveSection,
    saving,
}) => {
    return (
        <AdminSection
            title="Hero Section"
            description="Manage the main hero section content."
            onSave={() => saveSection("hero")}
            saving={saving === "hero"}
            accent="from-blue-600 to-purple-600"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
                    <input
                        type="text"
                        id="name"
                        className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={heroData.name}
                        onChange={(e) => updateField("hero", ["name"], e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="surname" className="block text-sm font-medium text-slate-300">Surname</label>
                    <input
                        type="text"
                        id="surname"
                        className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        value={heroData.surname}
                        onChange={(e) => updateField("hero", ["surname"], e.target.value)}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="tagline" className="block text-sm font-medium text-slate-300">Tagline</label>
                <textarea
                    id="tagline"
                    rows={3}
                    className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={heroData.tagline}
                    onChange={(e) => updateField("hero", ["tagline"], e.target.value)}
                ></textarea>
            </div>
            <div>
                <label htmlFor="availableText" className="block text-sm font-medium text-slate-300">Available Text</label>
                <input
                    type="text"
                    id="availableText"
                    className="mt-1 block w-full rounded-md bg-slate-800 border-slate-700 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    value={heroData.availableText}
                    onChange={(e) => updateField("hero", ["availableText"], e.target.value)}
                />
            </div>
            {/* Add more fields for HeroData as needed */}
        </AdminSection>
    );
};

export default HeroSection;
