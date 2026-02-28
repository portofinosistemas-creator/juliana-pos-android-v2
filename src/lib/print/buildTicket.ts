import type { CartItemInput } from "../../types/print";

interface ClientArgs {
  items: CartItemInput[];
  total: number;
  orderNumber: string;
  customerName: string;
  paymentMethod: string;
}

interface KitchenArgs {
  items: CartItemInput[];
  orderNumber: string;
  customerName: string;
}

export function buildClientTicketText(args: ClientArgs): string[] {
  const lines: string[] = [
    "JULIANA",
    "BARRA COTIDIANA",
    "------------------------------------------",
    `Pedido: #${args.orderNumber || "---"}`,
    `Cliente: ${args.customerName || "Barra"}`,
    `Pago: ${args.paymentMethod || "Efectivo"}`,
    new Date().toLocaleString("es-MX"),
    "------------------------------------------",
  ];

  args.items.forEach((item) => {
    lines.push(`${item.quantity}x ${item.name}`);
    lines.push(`  $${item.subtotal.toFixed(0)}`);
    if (item.note) lines.push(`  - ${item.note}`);
  });

  lines.push(
    "------------------------------------------",
    `TOTAL: $${args.total.toFixed(0)}`,
    "------------------------------------------",
    "Gracias por su compra"
  );
  return lines;
}

export function buildKitchenTicketText(args: KitchenArgs): string[] {
  const lines: string[] = [
    "COMANDA",
    `#${args.orderNumber || "---"}`,
    "================================",
    `Cliente: ${args.customerName || "Barra"}`,
    new Date().toLocaleString("es-MX"),
    "================================",
  ];

  args.items.forEach((item) => {
    lines.push(`${item.quantity}x ${item.name.toUpperCase()}`);
    if (item.note) lines.push(`  Nota: ${item.note}`);
  });

  lines.push("================================", "PREPARAR AHORA");
  return lines;
}
