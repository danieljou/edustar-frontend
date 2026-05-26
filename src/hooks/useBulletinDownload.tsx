"use client";
import { useState, useCallback, useRef } from "react";
import React from "react";
import type { Bulletin, Student } from "@/types";

export type DownloadStatus = "idle" | "generating" | "zipping" | "done" | "error";

export interface DownloadProgress {
  status: DownloadStatus;
  current: number;
  total: number;
  currentName?: string;
  errorMsg?: string;
}

type Item = { bulletin: Bulletin; student: Student };

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function renderBlob(
  bulletin: Bulletin,
  student: Student,
): Promise<Blob> {
  const [pdfLib, docLib] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/components/pdf/BulletinDocument"),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const el = React.createElement(docLib.BulletinDocument, { bulletin, student }) as any;
  return pdfLib.pdf(el).toBlob();
}

export function useBulletinDownload() {
  const [progress, setProgress] = useState<DownloadProgress>({
    status: "idle",
    current: 0,
    total: 0,
  });
  const cancelledRef = useRef(false);

  const reset = useCallback(() => {
    cancelledRef.current = false;
    setProgress({ status: "idle", current: 0, total: 0 });
  }, []);

  const cancel = useCallback(() => {
    cancelledRef.current = true;
  }, []);

  const downloadSingle = useCallback(async (bulletin: Bulletin, student: Student) => {
    cancelledRef.current = false;
    setProgress({
      status: "generating",
      current: 0,
      total: 1,
      currentName: `${student.prenom} ${student.nom}`,
    });
    try {
      const blob = await renderBlob(bulletin, student);
      triggerDownload(
        blob,
        `Bulletin_${student.code}_${bulletin.semestre}_${bulletin.session}.pdf`,
      );
      setProgress({ status: "done", current: 1, total: 1 });
    } catch (err) {
      setProgress(p => ({
        ...p,
        status: "error",
        errorMsg: String(err),
      }));
    }
  }, []);

  const downloadBatch = useCallback(
    async (items: Item[], zipName = "bulletins") => {
      if (items.length === 0) return;
      if (items.length === 1) {
        return downloadSingle(items[0].bulletin, items[0].student);
      }

      cancelledRef.current = false;
      setProgress({ status: "generating", current: 0, total: items.length });

      try {
        const JSZip = (await import("jszip")).default;
        const zip = new JSZip();

        for (let i = 0; i < items.length; i++) {
          if (cancelledRef.current) break;
          const { bulletin, student } = items[i];
          setProgress({
            status: "generating",
            current: i,
            total: items.length,
            currentName: `${student.prenom} ${student.nom}`,
          });
          const blob = await renderBlob(bulletin, student);
          zip.file(
            `Bulletin_${student.code}_${bulletin.semestre}.pdf`,
            blob,
          );
        }

        if (cancelledRef.current) {
          setProgress({ status: "idle", current: 0, total: 0 });
          return;
        }

        setProgress(p => ({
          ...p,
          status: "zipping",
          currentName: "Compression en cours…",
        }));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        triggerDownload(zipBlob, `${zipName}.zip`);
        setProgress({ status: "done", current: items.length, total: items.length });
      } catch (err) {
        setProgress(p => ({
          ...p,
          status: "error",
          errorMsg: String(err),
        }));
      }
    },
    [downloadSingle],
  );

  return { progress, downloadSingle, downloadBatch, reset, cancel };
}
