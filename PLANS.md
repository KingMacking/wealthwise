# Planned Features

## Gastos fijos del mes

Sistema de gastos fijos/subscripciones recurrentes con fecha de cobro.
Incluye:
- CRUD de gastos fijos (nombre, monto, fecha de cobro, categoría, etc.)
- Notificaciones/alerts próximos a vencer
- Vista de "lo que se viene este mes"
- Posibilidad de asociar a método de pago

## Selección de país de residencia

Selector de país (ARG / USA) que afecta:
- Visualización de montos en moneda local
- Cálculo de impuestos (PAIS, ganancias, etc. para ARG)
- Suscripciones en USD mostradas en ARS con impuestos

## Dashboard personalizable ✔

Cada widget de "Tarjetas de resumen" (8 opciones) e "Indicadores" (9 opciones) se puede prender/apagar y reordenar por drag & drop. Además se pueden ocultar las secciones de "Gráficos" y "Movimientos recientes".

## Registro vía WhatsApp Bot

Bot de WhatsApp (o similar) donde el usuario manda un gasto y se registra automáticamente.

# Implemented

## Seed de datos iniciales ✔

Cuando un usuario nuevo se registra y accede por primera vez, se crean automáticamente:
- 12 categorías por defecto (Comida, Transporte, Servicios, Alquiler, Salud, Educación, Entretenimiento, Indumentaria, Viajes, Ahorro, Ingresos, Otros)
- 4 métodos de pago por defecto (Efectivo, Débito, Crédito, QR)
