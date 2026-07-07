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

## Dashboard personalizable

Selector de qué secciones mostrar en el dashboard. Hoy muestra: resumen de cuentas, ingresos/gastos del mes, resultado del mes, presupuestos, tarjetas, objetivos, movimientos recientes. Poder activar/desactivar cada widget según preferencia del usuario.

## Registro vía WhatsApp Bot

Bot de WhatsApp (o similar) donde el usuario manda un gasto y se registra automáticamente.

# Implemented

## Seed de datos iniciales ✔

Cuando un usuario nuevo se registra y accede por primera vez, se crean automáticamente:
- 12 categorías por defecto (Comida, Transporte, Servicios, Alquiler, Salud, Educación, Entretenimiento, Indumentaria, Viajes, Ahorro, Ingresos, Otros)
- 4 métodos de pago por defecto (Efectivo, Débito, Crédito, QR)
