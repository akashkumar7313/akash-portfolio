"use client";

import { useEffect, useState } from "react";
import { SiFlutter, SiReact } from "react-icons/si";
import { FiCheckCircle } from "react-icons/fi";

type Tab = "flutter" | "rn";

const snippets: Record<Tab, { file: string; language: string; code: string }> = {
  flutter: {
    file: "home_screen.dart",
    language: "Dart",
    code: `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final orders =
        context.watch<HomeCubit>().state.orders;

    return Scaffold(
      body: SafeArea(child: OrderList(orders: orders)),
      floatingActionButton: SyncButton(),
    );
  }
}`,
  },
  rn: {
    file: "HomeScreen.tsx",
    language: "TypeScript",
    code: `import { View, Text, Pressable } from "react-native";
import { useAppSelector } from "./store";

export function HomeScreen() {
  const orders = useAppSelector(selectOrders);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Orders</Text>
      <OrderList data={orders} />
      <Pressable onPress={syncOrders} style={styles.cta}>
        <Text>Sync now</Text>
      </Pressable>
    </View>
  );
}`,
  },
};

const keywords = new Set([
  "import", "from", "class", "extends", "const", "final", "return", "export",
  "function", "override", "if", "else", "new", "await", "async",
]);

const types = new Set([
  "Widget", "StatelessWidget", "Scaffold", "SafeArea", "OrderList", "SyncButton",
  "View", "Text", "Pressable", "HomeCubit", "HomeScreen", "String", "BuildContext",
]);

function Line({ text }: { text: string }) {
  const parts = text.split(/("[^"]*"|'[^']*'|\/\/.*$|\b[A-Za-z_$][\w$]*\b|\b\d+\b)/g);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        let color = "text-[#33423a] dark:text-[#dbe7df]";
        if (part.startsWith("//")) color = "text-[#6b7280] italic dark:text-[#5b6b61]";
        else if (part.startsWith('"') || part.startsWith("'")) color = "text-[#15803d] dark:text-[#a8d94a]";
        else if (keywords.has(part)) color = "text-[#3f6212] dark:text-[#c9f36c]";
        else if (types.has(part)) color = "text-[#111827] dark:text-[#e9ffc9]";
        else if (/^\d+$/.test(part)) color = "text-[#b45309] dark:text-[#fbbf24]";
        else if (/^[A-Z]/.test(part)) color = "text-[#4d7c0f] dark:text-[#d9ff8a]";
        return <span key={i} className={color}>{part}</span>;
      })}
    </>
  );
}

export default function CodeShowcase() {
  const [tab, setTab] = useState<Tab>("flutter");
  const [typedCode, setTypedCode] = useState("");
  const snippet = snippets[tab];
  const fullCode = snippet.code;
  const totalLines = fullCode.split("\n").length;
  const typedLines = typedCode.split("\n");
  const isComplete = typedCode.length === fullCode.length;

  useEffect(() => {
    let cancelled = false;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    setTypedCode("");

    const step = () => {
      if (cancelled) return;
      index = Math.min(index + 2, fullCode.length);
      setTypedCode(fullCode.slice(0, index));

      if (index < fullCode.length) {
        timer = setTimeout(step, fullCode[index - 1] === "\n" ? 110 : 10);
      } else {
        timer = setTimeout(() => {
          if (cancelled) return;
          index = 0;
          setTypedCode("");
          timer = setTimeout(step, 420);
        }, 6000);
      }
    };

    timer = setTimeout(step, 360);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [fullCode]);

  return (
    <div className="bento overflow-hidden">
      <div className="flex items-center gap-2 border-b border-[#101412]/8 px-3.5 py-3 dark:border-[#c9f36c]/10">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-1 hidden truncate font-mono text-[10px] text-[#6b7280] dark:text-[#91a096] sm:block">
          {snippet.file}
        </span>
        <div className="ml-auto flex items-center gap-0.5 rounded-lg border border-[#101412]/8 bg-[#101412]/[0.03] p-0.5 dark:border-[#c9f36c]/10 dark:bg-white/[0.04]">
          <button
            onClick={() => setTab("flutter")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold transition-colors ${
              tab === "flutter"
                ? "bg-[#c9f36c] text-[#101412]"
                : "text-[#6b7280] hover:text-[#101412] dark:text-[#91a096] dark:hover:text-white"
            }`}
          >
            <SiFlutter className="text-[10px]" /> Flutter
          </button>
          <button
            onClick={() => setTab("rn")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[9px] font-semibold transition-colors ${
              tab === "rn"
                ? "bg-[#c9f36c] text-[#101412]"
                : "text-[#6b7280] hover:text-[#101412] dark:text-[#91a096] dark:hover:text-white"
            }`}
          >
            <SiReact className="text-[10px]" /> React Native
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-[#101412]/6 bg-[#101412]/[0.02] px-3.5 py-1.5 dark:border-[#c9f36c]/8 dark:bg-white/[0.02]">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#16a34a] dark:text-[#c9f36c]">
          {snippet.language}
        </span>
        <span className="flex items-center gap-1 font-mono text-[8px] text-[#6b7280] dark:text-[#91a096]">
          <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" /> hot reload
        </span>
      </div>

      <div className="overflow-x-auto bg-[#f8fbf4]/60 px-2.5 py-3 font-mono text-[9px] leading-[1.7] dark:bg-white/[0.015] sm:text-[10.5px]">
        {Array.from({ length: totalLines }).map((_, i) => {
          const text = typedLines[i] ?? "";
          const isActive = !isComplete && i === typedLines.length - 1;
          return (
            <div
              key={`${tab}-${i}`}
              className={`flex gap-2 rounded px-1.5 transition-colors duration-300 ${
                isActive ? "bg-[#c9f36c]/[0.22] dark:bg-[#c9f36c]/[0.07]" : ""
              }`}
            >
              <span className="w-4 shrink-0 text-right text-[8.5px] leading-[1.9] text-[#6b7280] dark:text-[#4d5c53]">{i + 1}</span>
              <span className="whitespace-pre">
                {text ? <Line text={text} /> : " "}
                {isActive && (
                  <span className="ml-0.5 inline-block h-3 w-[5px] translate-y-[2px] animate-pulse rounded-sm bg-[#16a34a] dark:bg-[#c9f36c]" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#101412]/8 px-3.5 py-2 dark:border-[#c9f36c]/10">
        <span className={`flex items-center gap-1.5 text-[9px] font-medium ${isComplete ? "text-emerald-600 dark:text-emerald-400" : "text-[#6b7280] dark:text-[#91a096]"}`}>
          {isComplete ? <FiCheckCircle /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />}
          {isComplete ? "Build successful" : "Writing preview…"}
        </span>
        <span className="font-mono text-[9px] text-[#6b7280] dark:text-[#91a096]">Android · iOS · Web</span>
      </div>
    </div>
  );
}
