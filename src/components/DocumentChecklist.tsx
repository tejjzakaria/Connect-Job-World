/**
 * DocumentChecklist.tsx
 *
 * Author: Zakaria TEJJANI
 * Email: contact@tejjzakaria.com
 * Date: 2025-11-03
 *
 * Description:
 * Interactive document requirements checklist helping clients prepare necessary paperwork
 * for their applications. Displays comprehensive list of required and optional documents
 * with checkboxes for tracking preparation progress. Includes download button for PDF
 * checklist export. Features collapsible sections organized by document category with
 * visual indicators for completion status. Helps clients stay organized throughout the
 * application process and ensures no documents are forgotten. Supports multi-language content.
 */

import { useState } from "react";
import { FileCheck, Download, CheckSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";

const DocumentChecklist = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const checklists = [
    {
      id: "dv-lottery",
      titleKey: "documentChecklist.dvLottery.title",
      icon: "🇺🇸",
      documentKeys: [
        "documentChecklist.dvLottery.doc1",
        "documentChecklist.dvLottery.doc2",
        "documentChecklist.dvLottery.doc3",
        "documentChecklist.dvLottery.doc4",
        "documentChecklist.dvLottery.doc5",
        "documentChecklist.dvLottery.doc6"
      ]
    },
    {
      id: "canada-express",
      titleKey: "documentChecklist.canadaExpress.title",
      icon: "🇨🇦",
      documentKeys: [
        "documentChecklist.canadaExpress.doc1",
        "documentChecklist.canadaExpress.doc2",
        "documentChecklist.canadaExpress.doc3",
        "documentChecklist.canadaExpress.doc4",
        "documentChecklist.canadaExpress.doc5",
        "documentChecklist.canadaExpress.doc6",
        "documentChecklist.canadaExpress.doc7",
        "documentChecklist.canadaExpress.doc8",
        "documentChecklist.canadaExpress.doc9"
      ]
    },
    {
      id: "work-visa",
      titleKey: "documentChecklist.workVisa.title",
      icon: "💼",
      documentKeys: [
        "documentChecklist.workVisa.doc1",
        "documentChecklist.workVisa.doc2",
        "documentChecklist.workVisa.doc3",
        "documentChecklist.workVisa.doc4",
        "documentChecklist.workVisa.doc5",
        "documentChecklist.workVisa.doc6",
        "documentChecklist.workVisa.doc7",
        "documentChecklist.workVisa.doc8",
        "documentChecklist.workVisa.doc9"
      ]
    },
    {
      id: "study",
      titleKey: "documentChecklist.study.title",
      icon: "🎓",
      documentKeys: [
        "documentChecklist.study.doc1",
        "documentChecklist.study.doc2",
        "documentChecklist.study.doc3",
        "documentChecklist.study.doc4",
        "documentChecklist.study.doc5",
        "documentChecklist.study.doc6",
        "documentChecklist.study.doc7",
        "documentChecklist.study.doc8",
        "documentChecklist.study.doc9",
        "documentChecklist.study.doc10"
      ]
    },
    {
      id: "family",
      titleKey: "documentChecklist.family.title",
      icon: "👨‍👩‍👧",
      documentKeys: [
        "documentChecklist.family.doc1",
        "documentChecklist.family.doc2",
        "documentChecklist.family.doc3",
        "documentChecklist.family.doc4",
        "documentChecklist.family.doc5",
        "documentChecklist.family.doc6",
        "documentChecklist.family.doc7",
        "documentChecklist.family.doc8",
        "documentChecklist.family.doc9"
      ]
    },
    {
      id: "sports",
      titleKey: "documentChecklist.sports.title",
      icon: "⚽",
      documentKeys: [
        "documentChecklist.sports.doc1",
        "documentChecklist.sports.doc2",
        "documentChecklist.sports.doc3",
        "documentChecklist.sports.doc4",
        "documentChecklist.sports.doc5",
        "documentChecklist.sports.doc6",
        "documentChecklist.sports.doc7",
        "documentChecklist.sports.doc8"
      ]
    }
  ];

  const [selectedChecklist, setSelectedChecklist] = useState(checklists[0].id);
  const activeChecklist = checklists.find(c => c.id === selectedChecklist) || checklists[0];

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const title = t(activeChecklist.titleKey);
    doc.text(title, pageWidth / 2, yPosition, { align: "center" });

    yPosition += 15;

    // Add subtitle
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const subtitle = t('documentChecklist.documentsRequired', { count: activeChecklist.documentKeys.length });
    doc.text(subtitle, pageWidth / 2, yPosition, { align: "center" });

    yPosition += 20;

    // Add checklist items
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    activeChecklist.documentKeys.forEach((docKey, index) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      const text = t(docKey);
      const checkbox = "☐";
      const itemNumber = `${index + 1}.`;

      // Add checkbox and text
      doc.text(checkbox, margin, yPosition);
      doc.text(itemNumber, margin + 7, yPosition);

      // Split long text into multiple lines if needed
      const maxWidth = pageWidth - margin * 2 - 15;
      const splitText = doc.splitTextToSize(text, maxWidth);

      doc.text(splitText, margin + 15, yPosition);

      // Calculate the height of the text block
      const textHeight = splitText.length * 6;
      yPosition += Math.max(textHeight, 8);
    });

    // Add footer note
    yPosition += 10;
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(t('documentChecklist.importantNote'), margin, yPosition);
    yPosition += 7;

    doc.setFont("helvetica", "normal");
    const noteText = t('documentChecklist.noteText');
    const splitNote = doc.splitTextToSize(noteText, pageWidth - margin * 2);
    doc.text(splitNote, margin, yPosition);

    // Save the PDF
    const fileName = `${title.replace(/\s+/g, '_')}_Checklist.pdf`;
    doc.save(fileName);
  };

  return (
    <section id="documents" dir={isRTL ? 'rtl' : 'ltr'} className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
            <FileCheck className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold">{t('documentChecklist.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('documentChecklist.heading')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('documentChecklist.subtitle')}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Service Selector */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {checklists.map((checklist, index) => (
              <button
                key={checklist.id}
                onClick={() => setSelectedChecklist(checklist.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 animate-fade-in-up ${
                  selectedChecklist === checklist.id
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border bg-card hover:border-primary/50"
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-3xl mb-2">{checklist.icon}</div>
                <div className={`text-sm font-semibold ${
                  selectedChecklist === checklist.id ? "text-primary" : "text-muted-foreground"
                }`}>
                  {t(checklist.titleKey).split(" ")[0]}
                </div>
              </button>
            ))}
          </div>

          {/* Checklist Display */}
          <Card className="p-8 border-2">
            <div className="flex items-center justify-between mb-8 pb-6 border-b">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{activeChecklist.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {t(activeChecklist.titleKey)}
                  </h3>
                  <p className="text-muted-foreground">
                    {t('documentChecklist.documentsRequired', { count: activeChecklist.documentKeys.length })}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={generatePDF}
              >
                <Download className="w-4 h-4" />
                {t('documentChecklist.downloadPdf')}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {activeChecklist.documentKeys.map((docKey, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CheckSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{t(docKey)}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-xl">
              <h4 className="font-bold text-foreground mb-2">{t('documentChecklist.importantNote')}</h4>
              <p className="text-muted-foreground leading-relaxed">
                {t('documentChecklist.noteText')}
              </p>
            </div>
          </Card>

          {/* CTA */}
          <div className="text-center mt-12">
            <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-accent/10">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {t('documentChecklist.helpTitle')}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl">
                {t('documentChecklist.helpDescription')}
              </p>
              <a
                href="#contact-form"
                className="inline-block px-8 py-4 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors"
              >
                {t('documentChecklist.contactButton')}
              </a>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentChecklist;
