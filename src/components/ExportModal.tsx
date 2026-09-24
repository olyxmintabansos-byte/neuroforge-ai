"use client";

import React, { useState } from "react";
import { X, Copy, Check, Download, FileText, CheckCircle2 } from "lucide-react";
import { useNeuroForge } from "@/context/NeuroForgeContext";

export function ExportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { generateMarkdownReport, currentMission } = useNeuroForge();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const markdownContent = generateMarkdownReport();

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neuroforge-spec-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090f1f] border border-cyan-500/40 rounded-3xl max-w-3xl w-full h-[620px] flex flex-col justify-between shadow-2xl neon-glow-cyan overflow-hidden font-mono">
        
        {/* Header */}
        <div className="p-4 bg-[#0d162b] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-white text-sm">Enterprise Specification Export</h3>
              <p className="text-[10px] text-slate-400">Formal Architectural Document with Mermaid Diagrams</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#050914] text-xs text-slate-300">
          <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed">
            {markdownContent}
          </pre>
        </div>

        {/* Actions Footer */}
        <div className="p-3 bg-[#0d162b] border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-[10px] text-slate-400">
            {currentMission ? `${currentMission.totalTokensBurned.toLocaleString()} tokens synthesized` : ""}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-[#131d36] hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Tersalin!" : "Salin Markdown"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Unduh .md File</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
