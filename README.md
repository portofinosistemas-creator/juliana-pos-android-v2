# Juliana POS Android Print v2

Proyecto nuevo separado del sistema actual, enfocado en impresion Android sin servidor.

## Objetivo

- Flujo de impresion local para Android.
- Sin dependencia de `api/print` ni CUPS.
- Base limpia para evolucionar a app nativa (Capacitor) si se requiere cero clics.

## Stack

- Vite
- React + TypeScript

## Scripts

```bash
npm install
npm run dev
npm run build
npm test
```

## Estado actual

- Demo de ticket cliente/comanda.
- Generador de lineas de impresion ESC/POS-friendly.
- Bridge inicial por esquema Android (`my.bluetoothprint.scheme://`).

## Siguiente fase recomendada

1. Integrar formato JSON exacto de la app complementaria que usaran en tienda.
2. Guardar perfil por impresora (80mm/58mm, corte, cajon, encoding).
3. Cola de impresion con reintentos y diagnostico.
4. Empaquetar con Capacitor para reducir dialogs y clics.
