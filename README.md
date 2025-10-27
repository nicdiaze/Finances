# 💰 Historial Financiero

Una aplicación web desarrollada con Next.js, TypeScript, Tailwind CSS y MongoDB para gestionar y hacer seguimiento de tus finanzas personales.

## 🚀 Características

- ✅ Registro de ingresos y gastos
- 📊 Dashboard con estadísticas en tiempo real
- 🏷️ Categorización de transacciones
- 📱 Interfaz responsive y moderna
- 🔍 Filtrado y búsqueda de transacciones
- 📈 Balance y métricas financieras

## 🛠️ Tecnologías

- **Frontend:** Next.js 16, React 19, TypeScript
- **Estilos:** Tailwind CSS
- **Base de datos:** MongoDB con Mongoose
- **API:** Next.js API Routes

## ⚙️ Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar MongoDB

Tienes dos opciones:

#### Opción A: MongoDB Local
1. Instala MongoDB localmente
2. Inicia el servicio de MongoDB
3. La URI por defecto será: `mongodb://localhost:27017/finance-tracker`

#### Opción B: MongoDB Atlas (Recomendado)
1. Crea una cuenta en [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crea un nuevo cluster
3. Obtén la cadena de conexión
4. Reemplaza `<username>`, `<password>` y `<cluster-name>` con tus datos

### 3. Variables de entorno

Edita el archivo `.env.local` y configura:

```env
# Para MongoDB local:
MONGODB_URI=mongodb://localhost:27017/finance-tracker

# Para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority

# Secreto para Next.js (genera uno aleatorio)
NEXTAUTH_SECRET=tu-secreto-super-seguro-aqui
```

### 4. Ejecutar la aplicación

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📋 Estructura del proyecto

```
nextjs_demo/
├── app/
│   ├── api/
│   │   └── transactions/
│   │       ├── route.ts          # GET y POST transacciones
│   │       ├── [id]/
│   │       │   └── route.ts      # PUT y DELETE por ID
│   │       └── stats/
│   │           └── route.ts      # Estadísticas
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Página principal
├── components/
│   ├── TransactionForm.tsx       # Formulario de transacciones
│   ├── TransactionList.tsx       # Lista de transacciones
│   └── FinanceStats.tsx          # Componente de estadísticas
├── lib/
│   └── dbConnect.ts              # Conexión a MongoDB
├── models/
│   └── Transaction.ts            # Modelo de datos
└── .env.local                    # Variables de entorno
```

## 🎯 Uso

### Agregar transacciones
1. Haz clic en "Nueva Transacción"
2. Completa el formulario:
   - **Tipo:** Ingreso o Gasto
   - **Monto:** Cantidad en dólares
   - **Descripción:** Detalle de la transacción
   - **Categoría:** Selecciona según el tipo
   - **Fecha:** Por defecto es hoy
3. Guarda la transacción

### Categorías disponibles

**Ingresos:**
- Salario, Freelance, Inversiones, Ventas, Otros ingresos

**Gastos:**
- Alimentación, Transporte, Vivienda, Salud, Entretenimiento, Educación, Ropa, Servicios, Otros gastos

### Gestionar transacciones
- **Editar:** Haz clic en "Editar" junto a cualquier transacción
- **Eliminar:** Haz clic en "Eliminar" y confirma la acción

## 🔧 API Endpoints

### Transacciones
- `GET /api/transactions` - Listar transacciones
- `POST /api/transactions` - Crear transacción
- `GET /api/transactions/[id]` - Obtener transacción específica
- `PUT /api/transactions/[id]` - Actualizar transacción
- `DELETE /api/transactions/[id]` - Eliminar transacción

### Estadísticas
- `GET /api/transactions/stats` - Obtener estadísticas

### Parámetros de consulta
- `type`: Filtrar por 'ingreso' o 'gasto'
- `category`: Filtrar por categoría específica
- `limit`: Número máximo de resultados (por defecto 50)
- `page`: Página para paginación (por defecto 1)

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Otras plataformas
Asegúrate de configurar las variables de entorno en tu plataforma de despliegue.

## 🆘 Solución de problemas

### Error de conexión a MongoDB
- Verifica que la URI en `.env.local` sea correcta
- Si usas MongoDB Atlas, asegúrate de que tu IP esté en la whitelist
- Verifica que el usuario tenga los permisos necesarios

### Errores de compilación de TypeScript
- Ejecuta `npm run build` para ver errores específicos
- Verifica que todas las dependencias estén instaladas
