import { useMemo, useState } from "react";
import "./App.css";
import { buildClientTicketText, buildKitchenTicketText } from "./lib/print/buildTicket";
import { sendToAndroidPrintApp } from "./lib/print/androidBridge";
import type { CartItemInput } from "./types/print";

const DEMO_ITEMS: CartItemInput[] = [
  { quantity: 2, name: "Cappuccino", subtotal: 120 },
  { quantity: 1, name: "Croissant", subtotal: 45 },
];

function App() {
  const [orderNumber, setOrderNumber] = useState("101");
  const [customerName, setCustomerName] = useState("Barra");
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [message, setMessage] = useState("");

  const total = useMemo(
    () => DEMO_ITEMS.reduce((sum, item) => sum + item.subtotal, 0),
    []
  );

  const printClient = async () => {
    const lines = buildClientTicketText({
      items: DEMO_ITEMS,
      total,
      orderNumber,
      customerName,
      paymentMethod,
    });
    const result = await sendToAndroidPrintApp({
      type: "client",
      lines,
      paperSize: "80mm",
    });
    setMessage(result.message);
  };

  const printKitchen = async () => {
    const lines = buildKitchenTicketText({
      items: DEMO_ITEMS,
      orderNumber,
      customerName,
    });
    const result = await sendToAndroidPrintApp({
      type: "kitchen",
      lines,
      paperSize: "58mm",
    });
    setMessage(result.message);
  };

  const printBoth = async () => {
    const kitchen = await sendToAndroidPrintApp({
      type: "kitchen",
      lines: buildKitchenTicketText({
        items: DEMO_ITEMS,
        orderNumber,
        customerName,
      }),
      paperSize: "58mm",
    });
    if (!kitchen.ok) {
      setMessage(kitchen.message);
      return;
    }
    const client = await sendToAndroidPrintApp({
      type: "client",
      lines: buildClientTicketText({
        items: DEMO_ITEMS,
        total,
        orderNumber,
        customerName,
        paymentMethod,
      }),
      paperSize: "80mm",
    });
    setMessage(client.message);
  };

  return (
    <main className="app">
      <h1>Juliana POS Android Print v2</h1>
      <p className="subtitle">Base nueva sin servidor: Android intent + fallback local.</p>

      <section className="panel">
        <label>
          Orden
          <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} />
        </label>
        <label>
          Cliente
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </label>
        <label>
          Pago
          <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
        </label>
      </section>

      <section className="panel">
        <h2>Items demo</h2>
        {DEMO_ITEMS.map((item) => (
          <div key={item.name} className="row">
            <span>{item.quantity}x {item.name}</span>
            <strong>${item.subtotal.toFixed(0)}</strong>
          </div>
        ))}
        <div className="row total">
          <span>Total</span>
          <strong>${total.toFixed(0)}</strong>
        </div>
      </section>

      <section className="actions">
        <button onClick={printClient}>Imprimir Ticket</button>
        <button onClick={printKitchen}>Imprimir Comanda</button>
        <button onClick={printBoth}>Imprimir Ambos</button>
      </section>

      {message && <p className="message">{message}</p>}
    </main>
  );
}

export default App;
