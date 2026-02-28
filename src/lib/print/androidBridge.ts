import type { AndroidPrintJob, PrintResult } from "../../types/print";

const ANDROID_SCHEME = "my.bluetoothprint.scheme:data:application/json,";
const BRIDGE_OPEN_TIMEOUT_MS = 900;

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function printWithBrowserDialog(job: AndroidPrintJob): PrintResult {
  const ticket = job.lines.map(escapeHtml).join("\n");
  const width = job.paperSize === "58mm" ? "58mm" : "80mm";
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.setAttribute("aria-hidden", "true");
  document.body.appendChild(frame);

  const frameDoc = frame.contentDocument;
  if (!frameDoc) {
    frame.remove();
    return {
      ok: false,
      message: "No se pudo abrir el dialogo de impresion del navegador.",
    };
  }

  frameDoc.open();
  frameDoc.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ticket</title>
    <style>
      @page { size: ${width} auto; margin: 2mm; }
      body { margin: 0; padding: 2mm; font-family: monospace; font-size: 12px; white-space: pre-wrap; }
    </style>
  </head>
  <body>${ticket}</body>
</html>`);
  frameDoc.close();

  const frameWindow = frame.contentWindow;
  if (!frameWindow) {
    frame.remove();
    return {
      ok: false,
      message: "No se pudo abrir el dialogo de impresion del navegador.",
    };
  }

  setTimeout(() => {
    frameWindow.focus();
    frameWindow.print();
    setTimeout(() => frame.remove(), 800);
  }, 120);

  return {
    ok: true,
    message: "Impresion enviada por dialogo nativo de Android.",
  };
}

export async function sendToAndroidPrintApp(job: AndroidPrintJob): Promise<PrintResult> {
  if (typeof window === "undefined") {
    return { ok: false, message: "No disponible fuera del navegador." };
  }

  if (!isAndroid()) {
    return {
      ok: false,
      message: "No es Android. Este bridge está diseñado para tablets Android.",
    };
  }

  try {
    const payload = encodeURIComponent(JSON.stringify(job.lines));
    const schemeUrl = `${ANDROID_SCHEME}${payload}`;
    window.location.href = schemeUrl;
    await sleep(BRIDGE_OPEN_TIMEOUT_MS);

    if (document.visibilityState === "visible") {
      return printWithBrowserDialog(job);
    }

    return { ok: true, message: `Solicitud enviada a app Android (${job.type}).` };
  } catch (error) {
    const fallback = printWithBrowserDialog(job);
    if (fallback.ok) return fallback;

    return {
      ok: false,
      message: `No se pudo abrir la app de impresion: ${error instanceof Error ? error.message : "error"}`,
    };
  }
}
