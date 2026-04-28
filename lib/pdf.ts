/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InterviewData {
  id: string;
  candidateName: string;
  overallScore: number;
  clarity: number;
  patience: number;
  fluency: number;
  warmth: number;
  simplicity: number;
  summary: string;
  evidence?: string[];
  strengths?: string[];
  improvements?: string[];
  duration: number;
  questionCount: number;
  createdAt: string;
}

function getGrade(score: number): string {
  if (score >= 9) return "A+";
  if (score >= 8) return "A";
  if (score >= 7) return "B+";
  if (score >= 6) return "B";
  if (score >= 5) return "C";
  return "D";
}

export function generateInterviewPDF(interview: InterviewData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ─── Header ───
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, pageWidth, 45, "F");

  doc.setTextColor(188, 255, 95); // accent green
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("NOVAAI", 15, 25);

  doc.setFontSize(9);
  doc.setTextColor(117, 117, 117);
  doc.text("INTERVIEW EVALUATION REPORT", 15, 33);

  doc.setFontSize(9);
  doc.setTextColor(188, 255, 95);
  doc.text(`ID: ${interview.id.slice(0, 8).toUpperCase()}`, pageWidth - 15, 25, { align: "right" });
  doc.setTextColor(117, 117, 117);
  doc.text(
    new Date(interview.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    }),
    pageWidth - 15, 33,
    { align: "right" }
  );

  y = 55;

  // ─── Candidate Info ───
  doc.setFillColor(25, 25, 25);
  doc.rect(15, y, pageWidth - 30, 30, "F");
  doc.setDrawColor(188, 255, 95);
  doc.setLineWidth(0.5);
  doc.rect(15, y, pageWidth - 30, 30, "S");

  doc.setTextColor(117, 117, 117);
  doc.setFontSize(8);
  doc.text("CANDIDATE", 22, y + 10);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(interview.candidateName || "ANONYMOUS", 22, y + 22);

  // Duration & questions on right
  doc.setFontSize(8);
  doc.setTextColor(117, 117, 117);
  const durationStr = interview.duration > 0
    ? `${Math.floor(interview.duration / 60)}m ${interview.duration % 60}s`
    : "N/A";
  doc.text(`DURATION: ${durationStr}`, pageWidth - 22, y + 12, { align: "right" });
  doc.text(`QUESTIONS: ${interview.questionCount || 0}`, pageWidth - 22, y + 22, { align: "right" });

  y += 40;

  // ─── Overall Score ───
  doc.setFillColor(14, 14, 14);
  doc.rect(15, y, pageWidth - 30, 40, "F");
  doc.setDrawColor(188, 255, 95);
  doc.rect(15, y, pageWidth - 30, 40, "S");

  doc.setTextColor(117, 117, 117);
  doc.setFontSize(8);
  doc.text("OVERALL SCORE", 22, y + 12);

  doc.setTextColor(188, 255, 95);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(`${interview.overallScore || 0}`, 22, y + 33);

  doc.setFontSize(14);
  doc.text(`/ 10`, 48, y + 33);

  doc.setFontSize(20);
  doc.text(`GRADE: ${getGrade(interview.overallScore || 0)}`, pageWidth - 22, y + 30, { align: "right" });

  y += 50;

  // ─── Dimension Scores Table ───
  doc.setTextColor(188, 255, 95);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DIMENSION SCORES", 15, y);
  y += 5;

  const dimensions = [
    ["Clarity", `${interview.clarity || 0}/10`, getGrade(interview.clarity || 0)],
    ["Patience", `${interview.patience || 0}/10`, getGrade(interview.patience || 0)],
    ["Fluency", `${interview.fluency || 0}/10`, getGrade(interview.fluency || 0)],
    ["Warmth", `${interview.warmth || 0}/10`, getGrade(interview.warmth || 0)],
    ["Simplicity", `${interview.simplicity || 0}/10`, getGrade(interview.simplicity || 0)],
  ];

  autoTable(doc, {
    startY: y,
    head: [["DIMENSION", "SCORE", "GRADE"]],
    body: dimensions,
    theme: "plain",
    styles: {
      fillColor: [25, 25, 25],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
      cellPadding: 6,
      lineColor: [72, 72, 72],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [188, 255, 95],
      fontSize: 8,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 40, halign: "center" as const },
      2: { cellWidth: 30, halign: "center" as const },
    },
    margin: { left: 15, right: 15 },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15;

  // ─── Summary ───
  if (interview.summary) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(188, 255, 95);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", 15, y);
    y += 7;
    doc.setTextColor(171, 171, 171);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(interview.summary, pageWidth - 30);
    doc.text(summaryLines, 15, y);
    y += summaryLines.length * 5 + 10;
  }

  // ─── Strengths ───
  if (interview.strengths && interview.strengths.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(0, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("STRENGTHS", 15, y);
    y += 7;
    doc.setTextColor(171, 171, 171);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    interview.strengths.forEach((s) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`✓  ${s}`, pageWidth - 35);
      doc.text(lines, 18, y);
      y += lines.length * 5 + 3;
    });
    y += 5;
  }

  // ─── Improvements ───
  if (interview.improvements && interview.improvements.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setTextColor(255, 81, 250);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("AREAS FOR IMPROVEMENT", 15, y);
    y += 7;
    doc.setTextColor(171, 171, 171);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    interview.improvements.forEach((imp) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`→  ${imp}`, pageWidth - 35);
      doc.text(lines, 18, y);
      y += lines.length * 5 + 3;
    });
    y += 5;
  }

  // ─── Evidence ───
  if (interview.evidence && interview.evidence.length > 0) {
    if (y > 230) { doc.addPage(); y = 20; }
    doc.setTextColor(188, 255, 95);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("KEY EVIDENCE", 15, y);
    y += 7;
    doc.setTextColor(117, 117, 117);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    interview.evidence.forEach((ev) => {
      if (y > 270) { doc.addPage(); y = 20; }
      const lines = doc.splitTextToSize(`"${ev}"`, pageWidth - 35);
      doc.text(lines, 18, y);
      y += lines.length * 4 + 4;
    });
  }

  // ─── Footer ───
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(0, 0, 0);
    doc.rect(0, doc.internal.pageSize.getHeight() - 15, pageWidth, 15, "F");
    doc.setTextColor(72, 72, 72);
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.text(
      `NOVAAI // Generated ${new Date().toISOString()} // Page ${i} of ${pageCount}`,
      pageWidth / 2, doc.internal.pageSize.getHeight() - 6,
      { align: "center" }
    );
  }

  // Save
  const filename = `NovaAI_Report_${(interview.candidateName || "Anonymous").replace(/\s+/g, "_")}_${interview.id.slice(0, 8)}.pdf`;
  doc.save(filename);
}
