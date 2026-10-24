import type { Metadata } from "next";
import Process from "@/components/sections/Process";
import ProcessDetails from "@/components/sections/ProcessDetails";

export const metadata: Metadata = {
  title: "Process — Akash Kumar Prajapati",
  description:
    "A transparent, milestone-based delivery process for mobile and web products — requirement, design approval, development, security, testing and release.",
};

export default function ProcessPage() {
  return (
    <>
      <Process fullPage />
      <ProcessDetails />
    </>
  );
}
