# 📈 Cotizaciones Bursátiles

Aplicación web para consultar y monitorear cotizaciones de acciones bursátiles en tiempo real. Visualiza precios, gráficos históricos y estadísticas financieras de empresas cotizadas.

## ✨ Características

- **Búsqueda de acciones**: Busca cualquier acción por su símbolo (AAPL, TSLA, MSFT, etc.)
- **Gráficos interactivos**: Visualiza el historial de precios con intervalos configurables (1D, 5D, 1M, 3M, 6M, 1A)
- **Datos en tiempo real**: Precios actuales, cambio porcentual, apertura, máximo, mínimo
- **Estadísticas financieras**: Volumen de negociación, capitalización de mercado, rango de 52 semanas
- **Diseño responsivo**: Funciona en dispositivos móviles y escritorio
- **Interfaz moderna**: Diseño limpio con gradientes y animaciones suaves

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Gráficos**: Chart.js
- **API de datos**: Yahoo Finance (vía proxy)
- **Servidor**: Node.js

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/MarcS303/Cotizaciones.git
cd Cotizaciones

# Instalar dependencias
npm install

# Iniciar el servidor
node server.js

# Iniciar el proxy de la API
node api.js
```

## ⚡ Uso

1. Inicia el servidor: `node server.js`
2. Inicia el proxy API: `node api.js`
3. Abre tu navegador en `http://localhost:3000`
4. Busca una acción usando el símbolo bursátil o selecciona una de las opciones populares

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `node server.js` | Inicia el servidor web en puerto 3000 |
| `node api.js` | Inicia el proxy de API en puerto 3001 |

## 📊 Símbolos populares

La aplicación incluye botones de acceso rápido para las siguientes acciones:

- **BYD** - BYD Company Ltd.
- **AAPL** - Apple Inc.
- **TSLA** - Tesla Inc.
- **MSFT** - Microsoft Corporation
- **GOOGL** - Alphabet Inc.
- **AMZN** - Amazon.com Inc.

## 📁 Estructura del proyecto

```
Cotizaciones/
├── index.html          # Página principal
├── style.css           # Estilos de la aplicación
├── app.js              # Lógica del frontend
├── api.js              # Proxy para Yahoo Finance
├── server.js           # Servidor Node.js
├── docs/               # Documentación (GitHub Pages)
└── README.md           # Este archivo
```

## 🔧 Configuración

### Cambiar puerto del servidor

Edita `server.js`:
```javascript
server.listen(3000, () => { ... }); // Cambia 3000 al puerto deseado
```

### Cambiar puerto de la API

Edita `app.js`:
```javascript
const API_URL = 'http://localhost:3001/api'; // Cambia al puerto configurado
```

## 🌐 Despliegue

### GitHub Pages

El proyecto incluye documentación desplegable en GitHub Pages. Accede a: **[Cotizaciones Docs](https://marcs303.github.io/Cotizaciones/)**

### Producción

Para desplegar en producción, considera:
- Usar un servidor web como Nginx o Apache
- Configurar HTTPS con Let's Encrypt
- Usar un servicio de hosting como Vercel o Netlify

## 📱 Capturas de pantalla

La aplicación muestra:
- Precio actual con cambio porcentual
- Gráfico de tendencia interactivo
- Tarjetas de estadísticas (apertura, máximo, mínimo, volumen, etc.)

## ⚠️ Limitaciones

- Requiere conexión a internet para obtener datos
- La API de Yahoo Finance puede tener limitaciones de rate limiting
- Algunos símbolos pueden no estar disponibles

## 📄 Licencia

MIT License - feel free to use this project for learning and personal projects.

## 👤 Autor

**MarcS303**

---

⭐️ Si te gusta este proyecto, ¡considera darle una estrella en GitHub!
