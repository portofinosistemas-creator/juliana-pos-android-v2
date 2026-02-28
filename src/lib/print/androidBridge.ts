import type { AndroidPrintJob, PrintResult } from "../../types/print";

const ANDROID_SCHEME = "my.bluetoothprint.scheme://data:application/json,";

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
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
    return { ok: true, message: `Solicitud enviada a app Android (${job.type}).` };
  } catch (error) {
    return {
      ok: false,
      message: `No se pudo abrir la app de impresión: ${error instanceof Error ? error.message : "error"}`,
    };
  }
}
