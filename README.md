# 💰 Historial Financiero

Una aplicación web desarrollada con Next.js, TypeScript, Tailwind CSS y Firebase para gestionar y hacer seguimiento de tus finanzas personales.

## 🚀 Características Principales

- ✅ **CRUD Completo** - Crear, leer, actualizar y eliminar transacciones
- 📊 **Dashboard Avanzado** - Estadísticas y gráficos en tiempo real
- 🏷️ **Categorización Inteligente** - Organiza por tipos de ingresos/gastos
- 📱 **Diseño Responsive** - Interfaz moderna que funciona en todos los dispositivos
- 🔍 **Filtros Avanzados** - Buscar por fecha, categoría, tipo y texto
- 📈 **Métricas Financieras** - Balance, tendencias y análisis visual
- � **Exportación de Datos** - Descarga en CSV y JSON
- 🌙 **Modo Oscuro/Claro** - Cambia entre temas según tu preferencia
- 🔔 **Notificaciones Toast** - Feedback visual de todas las acciones
- ⚡ **Tiempo Real** - Sincronización automática con Firebase

## 🛠️ Stack Tecnológico

- **Frontend:** Next.js 16, React 19, TypeScript
- **Estilos:** Tailwind CSS con animaciones personalizadas
- **Base de datos:** Firebase Firestore (NoSQL)
- **Hosting:** Firebase Hosting con CDN global
- **API:** Next.js API Routes + Firebase Admin SDK

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

#### A. Crear proyecto Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto con el ID de tu preferencia
3. Habilita Firestore Database en modo test
4. Obtén las credenciales de configuración

#### B. Configurar Firestore
1. En Firebase Console → Firestore Database
2. Crear database en modo "test"
3. Aplicar las reglas de seguridad desde `firestore.rules`

### 3. Variables de entorno

Crea/edita el archivo `.env.local`:

```env
# Firebase Configuration - Reemplaza con tus credenciales de Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=tu-firebase-api-key-aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://tu-proyecto-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Database Provider (firebase o mongodb para compatibilidad)
DATABASE_PROVIDER=firebase

# Secreto para Next.js - Genera uno aleatorio de 256+ caracteres
NEXTAUTH_SECRET=genera-un-secreto-super-seguro-y-aleatorio-aqui
```

### 4. Configurar reglas de Firestore

En Firebase Console → Firestore → Rules, aplica:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transactions/{transactionId} {
      allow read, write: if true; // Modo desarrollo
      allow create: if isValidTransaction(request.resource.data);
      allow update: if isValidTransaction(request.resource.data);
    }
    
    function isValidTransaction(data) {
      return data.keys().hasAll(['amount', 'description', 'category', 'type', 'date']) &&
             data.amount is number && data.amount > 0 &&
             data.description is string && data.description.size() > 0 &&
             data.category is string && data.type in ['ingreso', 'gasto'] &&
             data.date is timestamp;
    }
  }
}
```

### 5. Ejecutar la aplicación

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📋 Estructura del proyecto

```
nextjs_demo/
├── app/
│   ├── api/
│   │   ├── transactions/         # API MongoDB (compatibilidad)
│   │   └── firebase/
│   │       └── transactions/     # API Firebase principal
│   │           ├── route.ts      # GET y POST transacciones
│   │           ├── [id]/
│   │           │   └── route.ts  # PUT y DELETE por ID
│   │           └── stats/
│   │               └── route.ts  # Estadísticas y métricas
│   ├── globals.css               # Estilos globales + modo oscuro
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Aplicación principal
├── components/
│   ├── TransactionForm.tsx       # Formulario crear/editar
│   ├── TransactionList.tsx       # Lista con filtros
│   ├── FilterBar.tsx             # Filtros avanzados
│   ├── ExportButton.tsx          # Exportación CSV/JSON
│   ├── SimpleCharts.tsx          # Gráficos y visualizaciones
│   ├── ThemeToggle.tsx           # Cambio de tema
│   └── Toast.tsx                 # Notificaciones
├── lib/
│   ├── firebase.ts               # Configuración Firebase
│   ├── firestore.ts              # Servicios Firestore
│   └── database-config.ts        # Abstracción dual DB
├── types/
│   └── transaction.ts            # Tipos TypeScript
├── firebase.json                 # Config Firebase Hosting
├── firestore.rules               # Reglas de seguridad
└── .env.local                    # Variables de entorno
```

## 🎯 Características y Uso

### 💰 Gestión de Transacciones
- **Crear:** Botón "Nueva Transacción" → Completa formulario → Guardar
- **Editar:** Click en ✏️ junto a cualquier transacción
- **Eliminar:** Click en 🗑️ y confirmar acción
- **Visualizar:** Lista completa con paginación automática

### 🔍 Filtros Avanzados
- **Por tipo:** Ingresos, gastos o ambos
- **Por categoría:** Filtro dropdown dinámico
- **Por fecha:** Rango de fechas personalizable
- **Búsqueda:** Texto libre en descripción
- **Combinados:** Todos los filtros funcionan juntos

### 📊 Dashboard de Estadísticas
- **Balance total:** Diferencia entre ingresos y gastos
- **Totales por tipo:** Montos separados de ingresos/gastos
- **Gráfico de barras:** Comparación visual por categorías
- **Tendencias:** Análisis temporal de tus finanzas

### 📤 Exportación de Datos
- **CSV:** Para Excel o Google Sheets
- **JSON:** Para desarrolladores o backups
- **Filtros aplicados:** Exporta solo datos filtrados

### 🌙 Personalización
- **Modo oscuro/claro:** Toggle en la esquina superior
- **Responsive:** Funciona en móvil, tablet y desktop
- **Notificaciones:** Feedback visual de todas las acciones

### 🏷️ Categorías Disponibles

**Ingresos:**
- Salario, Freelance, Inversiones, Ventas, Otros ingresos

**Gastos:**
- Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Educación, Ropa, Servicios, Otros gastos

## 🔧 API Endpoints

### Firebase API (Principal)
```
GET    /api/firebase/transactions       # Listar transacciones con filtros
POST   /api/firebase/transactions       # Crear nueva transacción
GET    /api/firebase/transactions/[id]  # Obtener transacción específica
PUT    /api/firebase/transactions/[id]  # Actualizar transacción
DELETE /api/firebase/transactions/[id]  # Eliminar transacción
GET    /api/firebase/transactions/stats # Estadísticas y métricas
```

### Parámetros de consulta disponibles
```
?type=ingreso|gasto           # Filtrar por tipo
?category=categoria           # Filtrar por categoría específica
?startDate=YYYY-MM-DD         # Fecha inicio (ISO)
?endDate=YYYY-MM-DD           # Fecha fin (ISO)
?search=texto                 # Buscar en descripción
?limit=50                     # Límite de resultados
```

### Estructura de datos (Firebase)
```typescript
interface Transaction {
  id?: string;                 // Auto-generado por Firestore
  amount: number;              # Monto (siempre positivo)
  description: string;         # Descripción de la transacción
  category: string;            # Categoría predefinida
  type: 'ingreso' | 'gasto';   # Tipo de transacción
  date: Date;                  # Fecha de la transacción
  createdAt?: Date;            # Timestamp de creación
  updatedAt?: Date;            # Timestamp de actualización
}
```

## 🚀 Despliegue

### Vercel (Recomendado para Apps con API Routes)
```bash
# Conectar repositorio con Vercel
vercel

# O usar GitHub integration:
# 1. Conecta tu repositorio en vercel.com
# 2. Configura variables de entorno Firebase
# 3. Deploy automático en cada push
```

**Ventajas de Vercel:**
- ✅ Soporte completo para API Routes
- ✅ Deploy automático desde GitHub
- ✅ Edge Functions globales
- ✅ Perfect para Next.js

### Netlify (Alternativa)
```bash
# Build para Netlify
npm run build

# Usar Netlify CLI
netlify deploy --prod --dir=out
```

### Variables de entorno para producción
Configura en tu plataforma de hosting:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
# ... resto de variables Firebase
DATABASE_PROVIDER=firebase
NEXTAUTH_SECRET=tu-secreto-produccion
```

### ⚠️ Nota sobre Firebase Hosting
Firebase Hosting está configurado solo para Firestore rules. Para una app completa con API Routes, se recomienda **Vercel** o **Netlify**.

## 🆘 Solución de problemas

### Errores de Firebase
```bash
# Error: Firebase project not found
firebase use tu-proyecto-id

# Error: Permission denied
# Verifica reglas de Firestore en Firebase Console

# Error: Firebase not initialized
# Verifica variables NEXT_PUBLIC_FIREBASE_* en .env.local
```

### Errores de compilación
```bash
# TypeScript errors
npm run build                    # Ver errores específicos
npm run type-check               # Solo verificar tipos

# Dependencias faltantes
npm install                      # Reinstalar dependencias
rm -rf node_modules package-lock.json && npm install  # Limpiar y reinstalar
```

### Problemas de desarrollo
```bash
# Puerto ocupado
npm run dev -- -p 3001          # Usar puerto diferente

# Cache problems
rm -rf .next                     # Limpiar cache de Next.js

# Environment variables not loading
# Asegúrate que .env.local esté en la raíz del proyecto
```

### Depuración
- **Console del navegador:** Revisa errores JavaScript
- **Firebase Console:** Verifica datos en Firestore
- **Network tab:** Inspecciona llamadas a API
- **Firestore rules:** Simula consultas en Rules Playground

## 📚 Recursos adicionales

- [Documentación Firebase](https://firebase.google.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
