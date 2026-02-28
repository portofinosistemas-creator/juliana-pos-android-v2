export interface CartItemInput {
  quantity: number;
  name: string;
  subtotal: number;
  note?: string;
}

export type PrintType = "client" | "kitchen";

export interface AndroidPrintJob {
  type: PrintType;
  paperSize: "80mm" | "58mm";
  lines: string[];
}

export interface PrintResult {
  ok: boolean;
  message: string;
}
