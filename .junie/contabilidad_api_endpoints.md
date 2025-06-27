# Especificaciones de API para el Módulo de Contabilidad

Este documento detalla los endpoints necesarios para implementar el módulo de contabilidad en el backend. Cada endpoint incluye su ruta, método HTTP, parámetros, formato de respuesta y posibles códigos de error.

## Índice
1. [Catálogo de Cuentas](#1-catálogo-de-cuentas)
2. [Asientos Contables](#2-asientos-contables)
3. [Períodos Contables](#3-períodos-contables)
4. [Reportes](#4-reportes)

---

## 1. Catálogo de Cuentas

### 1.1 Obtener todas las cuentas

**Endpoint:** `/api/contabilidad/cuentas`  
**Método:** GET  
**Descripción:** Obtiene la lista completa de cuentas contables.

**Respuesta exitosa (200 OK):**
```json
[
  {
    "codigo": "1000",
    "nombre": "Caja",
    "tipo": "ACTIVO",
    "saldoNormal": "DEBITO",
    "cuentaControl": false
  },
  {
    "codigo": "1010",
    "nombre": "Banco",
    "tipo": "ACTIVO",
    "saldoNormal": "DEBITO",
    "cuentaControl": false
  }
]
```

### 1.2 Obtener una cuenta específica

**Endpoint:** `/api/contabilidad/cuentas/{codigo}`  
**Método:** GET  
**Parámetros de ruta:**
- `codigo` (string): Código de la cuenta contable

**Respuesta exitosa (200 OK):**
```json
{
  "codigo": "1000",
  "nombre": "Caja",
  "tipo": "ACTIVO",
  "saldoNormal": "DEBITO",
  "cuentaControl": false
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Cuenta no encontrada",
  "mensaje": "No se encontró una cuenta con el código 1000"
}
```

### 1.3 Crear una nueva cuenta

**Endpoint:** `/api/contabilidad/cuentas`  
**Método:** POST  
**Cuerpo de la solicitud:**
```json
{
  "codigo": "1030",
  "nombre": "Caja Chica",
  "tipo": "ACTIVO",
  "saldoNormal": "DEBITO",
  "cuentaControl": false
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "codigo": "1030",
  "nombre": "Caja Chica",
  "tipo": "ACTIVO",
  "saldoNormal": "DEBITO",
  "cuentaControl": false
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Datos inválidos",
  "mensaje": "El código de cuenta ya existe"
}
```

### 1.4 Actualizar una cuenta existente

**Endpoint:** `/api/contabilidad/cuentas/{codigo}`  
**Método:** PUT  
**Parámetros de ruta:**
- `codigo` (string): Código de la cuenta contable

**Cuerpo de la solicitud:**
```json
{
  "nombre": "Caja General",
  "tipo": "ACTIVO",
  "saldoNormal": "DEBITO",
  "cuentaControl": false
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "codigo": "1000",
  "nombre": "Caja General",
  "tipo": "ACTIVO",
  "saldoNormal": "DEBITO",
  "cuentaControl": false
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Cuenta no encontrada",
  "mensaje": "No se encontró una cuenta con el código 1000"
}
```

---

## 2. Asientos Contables

### 2.1 Obtener todos los asientos

**Endpoint:** `/api/contabilidad/asientos`  
**Método:** GET  
**Parámetros de consulta (opcionales):**
- `periodoId` (number): ID del período contable
- `estado` (string): Estado del asiento (BORRADOR, PUBLICADO, REVERSADO)

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "fecha": "2023-03-05T10:30:00",
    "descripcion": "Compra de materias primas",
    "modulo": "COMPRAS",
    "documentoOrigen": "OC-2023-001",
    "estado": "PUBLICADO",
    "periodoContable": {
      "id": 3,
      "nombre": "Marzo 2023",
      "fechaInicio": "2023-03-01",
      "fechaFin": "2023-03-31",
      "estado": "ABIERTO"
    },
    "lineas": [
      {
        "id": 1,
        "cuentaCodigo": "1200",
        "debito": 5000.00,
        "credito": 0.00,
        "descripcion": "Compra de materias primas"
      },
      {
        "id": 2,
        "cuentaCodigo": "2000",
        "debito": 0.00,
        "credito": 5000.00,
        "descripcion": "Compra de materias primas"
      }
    ]
  }
]
```

### 2.2 Obtener un asiento específico

**Endpoint:** `/api/contabilidad/asientos/{id}`  
**Método:** GET  
**Parámetros de ruta:**
- `id` (number): ID del asiento contable

**Respuesta exitosa (200 OK):**
```json
{
  "id": 1,
  "fecha": "2023-03-05T10:30:00",
  "descripcion": "Compra de materias primas",
  "modulo": "COMPRAS",
  "documentoOrigen": "OC-2023-001",
  "estado": "PUBLICADO",
  "periodoContable": {
    "id": 3,
    "nombre": "Marzo 2023",
    "fechaInicio": "2023-03-01",
    "fechaFin": "2023-03-31",
    "estado": "ABIERTO"
  },
  "lineas": [
    {
      "id": 1,
      "cuentaCodigo": "1200",
      "debito": 5000.00,
      "credito": 0.00,
      "descripcion": "Compra de materias primas"
    },
    {
      "id": 2,
      "cuentaCodigo": "2000",
      "debito": 0.00,
      "credito": 5000.00,
      "descripcion": "Compra de materias primas"
    }
  ]
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Asiento no encontrado",
  "mensaje": "No se encontró un asiento con el ID 1"
}
```

### 2.3 Crear un nuevo asiento

**Endpoint:** `/api/contabilidad/asientos`  
**Método:** POST  
**Cuerpo de la solicitud:**
```json
{
  "fecha": "2023-03-10T14:15:00",
  "descripcion": "Registro de producción",
  "modulo": "PRODUCCION",
  "documentoOrigen": "OP-2023-005",
  "estado": "BORRADOR",
  "periodoContable": {
    "id": 3
  },
  "lineas": [
    {
      "cuentaCodigo": "1210",
      "debito": 3000.00,
      "credito": 0.00,
      "descripcion": "Registro de producción"
    },
    {
      "cuentaCodigo": "1200",
      "debito": 0.00,
      "credito": 3000.00,
      "descripcion": "Registro de producción"
    }
  ]
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": 2,
  "fecha": "2023-03-10T14:15:00",
  "descripcion": "Registro de producción",
  "modulo": "PRODUCCION",
  "documentoOrigen": "OP-2023-005",
  "estado": "BORRADOR",
  "periodoContable": {
    "id": 3,
    "nombre": "Marzo 2023",
    "fechaInicio": "2023-03-01",
    "fechaFin": "2023-03-31",
    "estado": "ABIERTO"
  },
  "lineas": [
    {
      "id": 3,
      "cuentaCodigo": "1210",
      "debito": 3000.00,
      "credito": 0.00,
      "descripcion": "Registro de producción"
    },
    {
      "id": 4,
      "cuentaCodigo": "1200",
      "debito": 0.00,
      "credito": 3000.00,
      "descripcion": "Registro de producción"
    }
  ]
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Datos inválidos",
  "mensaje": "El asiento no está balanceado. Los débitos deben ser iguales a los créditos."
}
```

### 2.4 Actualizar un asiento existente

**Endpoint:** `/api/contabilidad/asientos/{id}`  
**Método:** PUT  
**Parámetros de ruta:**
- `id` (number): ID del asiento contable

**Cuerpo de la solicitud:**
```json
{
  "fecha": "2023-03-10T14:15:00",
  "descripcion": "Registro de producción actualizado",
  "modulo": "PRODUCCION",
  "documentoOrigen": "OP-2023-005",
  "estado": "BORRADOR",
  "periodoContable": {
    "id": 3
  },
  "lineas": [
    {
      "id": 3,
      "cuentaCodigo": "1210",
      "debito": 3500.00,
      "credito": 0.00,
      "descripcion": "Registro de producción actualizado"
    },
    {
      "id": 4,
      "cuentaCodigo": "1200",
      "debito": 0.00,
      "credito": 3500.00,
      "descripcion": "Registro de producción actualizado"
    }
  ]
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": 2,
  "fecha": "2023-03-10T14:15:00",
  "descripcion": "Registro de producción actualizado",
  "modulo": "PRODUCCION",
  "documentoOrigen": "OP-2023-005",
  "estado": "BORRADOR",
  "periodoContable": {
    "id": 3,
    "nombre": "Marzo 2023",
    "fechaInicio": "2023-03-01",
    "fechaFin": "2023-03-31",
    "estado": "ABIERTO"
  },
  "lineas": [
    {
      "id": 3,
      "cuentaCodigo": "1210",
      "debito": 3500.00,
      "credito": 0.00,
      "descripcion": "Registro de producción actualizado"
    },
    {
      "id": 4,
      "cuentaCodigo": "1200",
      "debito": 0.00,
      "credito": 3500.00,
      "descripcion": "Registro de producción actualizado"
    }
  ]
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Asiento no encontrado",
  "mensaje": "No se encontró un asiento con el ID 2"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Operación no permitida",
  "mensaje": "No se puede modificar un asiento en estado PUBLICADO"
}
```

### 2.5 Cambiar el estado de un asiento

**Endpoint:** `/api/contabilidad/asientos/{id}/estado`  
**Método:** PUT  
**Parámetros de ruta:**
- `id` (number): ID del asiento contable

**Cuerpo de la solicitud:**
```json
{
  "estado": "PUBLICADO"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": 2,
  "estado": "PUBLICADO",
  "mensaje": "El estado del asiento ha sido actualizado correctamente"
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Asiento no encontrado",
  "mensaje": "No se encontró un asiento con el ID 2"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Operación no permitida",
  "mensaje": "No se puede publicar un asiento que no está balanceado"
}
```

---

## 3. Períodos Contables

### 3.1 Obtener todos los períodos

**Endpoint:** `/api/contabilidad/periodos`  
**Método:** GET  
**Parámetros de consulta (opcionales):**
- `estado` (string): Estado del período (ABIERTO, CERRADO)

**Respuesta exitosa (200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Enero 2023",
    "fechaInicio": "2023-01-01",
    "fechaFin": "2023-01-31",
    "estado": "CERRADO"
  },
  {
    "id": 2,
    "nombre": "Febrero 2023",
    "fechaInicio": "2023-02-01",
    "fechaFin": "2023-02-28",
    "estado": "CERRADO"
  },
  {
    "id": 3,
    "nombre": "Marzo 2023",
    "fechaInicio": "2023-03-01",
    "fechaFin": "2023-03-31",
    "estado": "ABIERTO"
  }
]
```

### 3.2 Obtener un período específico

**Endpoint:** `/api/contabilidad/periodos/{id}`  
**Método:** GET  
**Parámetros de ruta:**
- `id` (number): ID del período contable

**Respuesta exitosa (200 OK):**
```json
{
  "id": 3,
  "nombre": "Marzo 2023",
  "fechaInicio": "2023-03-01",
  "fechaFin": "2023-03-31",
  "estado": "ABIERTO"
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Período no encontrado",
  "mensaje": "No se encontró un período con el ID 3"
}
```

### 3.3 Crear un nuevo período

**Endpoint:** `/api/contabilidad/periodos`  
**Método:** POST  
**Cuerpo de la solicitud:**
```json
{
  "nombre": "Abril 2023",
  "fechaInicio": "2023-04-01",
  "fechaFin": "2023-04-30",
  "estado": "ABIERTO"
}
```

**Respuesta exitosa (201 Created):**
```json
{
  "id": 4,
  "nombre": "Abril 2023",
  "fechaInicio": "2023-04-01",
  "fechaFin": "2023-04-30",
  "estado": "ABIERTO"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Datos inválidos",
  "mensaje": "Las fechas del período se solapan con un período existente"
}
```

### 3.4 Actualizar un período existente

**Endpoint:** `/api/contabilidad/periodos/{id}`  
**Método:** PUT  
**Parámetros de ruta:**
- `id` (number): ID del período contable

**Cuerpo de la solicitud:**
```json
{
  "nombre": "Abril 2023 - Actualizado",
  "fechaInicio": "2023-04-01",
  "fechaFin": "2023-04-30"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": 4,
  "nombre": "Abril 2023 - Actualizado",
  "fechaInicio": "2023-04-01",
  "fechaFin": "2023-04-30",
  "estado": "ABIERTO"
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Período no encontrado",
  "mensaje": "No se encontró un período con el ID 4"
}
```

### 3.5 Cambiar el estado de un período

**Endpoint:** `/api/contabilidad/periodos/{id}/estado`  
**Método:** PUT  
**Parámetros de ruta:**
- `id` (number): ID del período contable

**Cuerpo de la solicitud:**
```json
{
  "estado": "CERRADO"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "id": 3,
  "estado": "CERRADO",
  "mensaje": "El estado del período ha sido actualizado correctamente"
}
```

**Respuesta de error (404 Not Found):**
```json
{
  "error": "Período no encontrado",
  "mensaje": "No se encontró un período con el ID 3"
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Operación no permitida",
  "mensaje": "No se puede cerrar un período con asientos en estado BORRADOR"
}
```

---

## 4. Reportes

### 4.1 Libro Mayor

**Endpoint:** `/api/contabilidad/libro-mayor`  
**Método:** GET  
**Parámetros de consulta:**
- `cuentaCodigo` (string): Código de la cuenta contable
- `periodoId` (number): ID del período contable

**Respuesta exitosa (200 OK):**
```json
[
  {
    "fecha": "2023-03-01",
    "numeroAsiento": 1,
    "descripcion": "Saldo inicial",
    "debito": 10000.00,
    "credito": 0.00,
    "saldoAcumulado": 10000.00
  },
  {
    "fecha": "2023-03-05",
    "numeroAsiento": 2,
    "descripcion": "Pago a proveedor",
    "debito": 0.00,
    "credito": 2500.00,
    "saldoAcumulado": 7500.00
  },
  {
    "fecha": "2023-03-15",
    "numeroAsiento": 3,
    "descripcion": "Cobro a cliente",
    "debito": 3000.00,
    "credito": 0.00,
    "saldoAcumulado": 10500.00
  }
]
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Parámetros inválidos",
  "mensaje": "Debe especificar el código de cuenta y el ID del período"
}
```

### 4.2 Balance de Comprobación

**Endpoint:** `/api/contabilidad/balance-comprobacion`  
**Método:** GET  
**Parámetros de consulta:**
- `periodoId` (number): ID del período contable

**Respuesta exitosa (200 OK):**
```json
[
  {
    "cuenta": {
      "codigo": "1000",
      "nombre": "Caja",
      "tipo": "ACTIVO",
      "saldoNormal": "DEBITO",
      "cuentaControl": false
    },
    "saldoDebito": 5000.00,
    "saldoCredito": 0.00,
    "saldoNeto": 5000.00
  },
  {
    "cuenta": {
      "codigo": "1010",
      "nombre": "Banco",
      "tipo": "ACTIVO",
      "saldoNormal": "DEBITO",
      "cuentaControl": false
    },
    "saldoDebito": 11700.00,
    "saldoCredito": 0.00,
    "saldoNeto": 11700.00
  },
  {
    "cuenta": {
      "codigo": "2000",
      "nombre": "Cuentas por Pagar - Proveedores",
      "tipo": "PASIVO",
      "saldoNormal": "CREDITO",
      "cuentaControl": false
    },
    "saldoDebito": 0.00,
    "saldoCredito": 15000.00,
    "saldoNeto": -15000.00
  }
]
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Parámetros inválidos",
  "mensaje": "Debe especificar el ID del período"
}
```

### 4.3 Balance General

**Endpoint:** `/api/contabilidad/balance-general`  
**Método:** GET  
**Parámetros de consulta:**
- `periodoId` (number): ID del período contable

**Respuesta exitosa (200 OK):**
```json
{
  "grupos": [
    {
      "nombre": "ACTIVOS",
      "cuentas": [
        {
          "codigo": "1000",
          "nombre": "Caja",
          "saldo": 5000.00
        },
        {
          "codigo": "1010",
          "nombre": "Banco",
          "saldo": 11700.00
        },
        {
          "codigo": "1200",
          "nombre": "Inventario Materias Primas",
          "saldo": 18500.00
        }
      ],
      "total": 35200.00
    },
    {
      "nombre": "PASIVOS",
      "cuentas": [
        {
          "codigo": "2000",
          "nombre": "Cuentas por Pagar - Proveedores",
          "saldo": 15000.00
        }
      ],
      "total": 15000.00
    },
    {
      "nombre": "PATRIMONIO",
      "cuentas": [
        {
          "codigo": "3000",
          "nombre": "Capital Social",
          "saldo": 20000.00
        },
        {
          "codigo": "3100",
          "nombre": "Utilidad del Ejercicio",
          "saldo": 200.00
        }
      ],
      "total": 20200.00
    }
  ],
  "total": 35200.00
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Parámetros inválidos",
  "mensaje": "Debe especificar el ID del período"
}
```

### 4.4 Estado de Resultados

**Endpoint:** `/api/contabilidad/estado-resultados`  
**Método:** GET  
**Parámetros de consulta:**
- `periodoId` (number): ID del período contable

**Respuesta exitosa (200 OK):**
```json
{
  "grupos": [
    {
      "nombre": "INGRESOS",
      "cuentas": [
        {
          "codigo": "4000",
          "nombre": "Ingresos por Ventas",
          "saldo": 30000.00
        }
      ],
      "total": 30000.00
    },
    {
      "nombre": "GASTOS",
      "cuentas": [
        {
          "codigo": "5000",
          "nombre": "Costo de Ventas",
          "saldo": 8000.00
        },
        {
          "codigo": "5200",
          "nombre": "Gasto por Scrap",
          "saldo": 1800.00
        }
      ],
      "total": 9800.00
    }
  ],
  "total": 20200.00
}
```

**Respuesta de error (400 Bad Request):**
```json
{
  "error": "Parámetros inválidos",
  "mensaje": "Debe especificar el ID del período"
}
```