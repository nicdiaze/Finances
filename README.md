# 💰 Control Financiero - Chile 🇨🇱

Gestión de finanzas personales con Next.js y PostgreSQL.

## ⚡ Inicio Rápido

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## ⚙️ Configuración

Crear `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/db"
DATABASE_PROVIDER=postgresql
NEXTAUTH_SECRET=tu-secreto-aqui
```

## 🚀 Características

- 💰 Moneda chilena (CLP)
- 📊 Dashboard con estadísticas  
- 🌙 Modo oscuro/claro
- 📤 Exportar CSV/JSON
- 🏷️ Categorías locales (Isapre, Locomoción, etc.)

## 🛠️ Stack

Next.js 16 • PostgreSQL • Prisma • TypeScript • Tailwind CSS • Firebase/Hosting

## 🔧 Comandos

```bash
npx prisma studio     # Ver BD
npm run build        # Compilar
firebase deploy      # Desplegar
```
