# Tarjetas de Presentación Digitales - Documentación de Desarrollo

Este documento sirve como la guía técnica oficial y documentación para el proyecto **Tarjetas de Presentación Digitales**, alojado de forma estática en GitHub Pages. Recoge la estructura lógica, las especificaciones del diseño funcional, el rastreo de métricas (KPIs), y la arquitectura de directorios.

---

## 1. Visión y Fases del Proyecto

El proyecto está diseñado bajo una estructura de embudo de ventas o "Funnel de Marketing", compuesto por las siguientes etapas:
1. **Presencia:** Visibilidad inicial para prospectos.
2. **Consideración:** Interés e información del servicio.
3. **Conversión:** La acción de contacto y adquisición.
4. **Fidelización:** Estrategia apuntando a la recompra continua.
*(Su meta principal radica en medir el % de retención en cada uno de los canales asignados a este embudo).*

### Fases de Ejecución:
1. **Objetivo:** Analizar el negocio local desde su núcleo.
2. **Construcción:** Fabricar el esqueleto y maquetación inicial del site.
3. **Lógica de Embudo:** Integrar la semántica orientada a la conversión de clientes.
4. **Diseño:** Asegurar un diseño intuitivo, responsivo y visualmente atractivo (Botones tipo píldora, acentos naranjas sobre fondo blanco).
5. **Métricas (KPIs):** Configurar Google Looker Studio y conectar las bases de analítica de KPIs.

---

## 2. Stack de Herramientas (Tecnologías)

*   **HTML y CSS:** Arquitectura base y estilos (Migración desde de WordPress a sistema enteramente Estático y libre de Backend).
*   **Git y GitHub Pages:** Control de versiones e infraestructura de alojamiento serverless.
*   **Flow / Canva:** Prototipado, fluidez de experiencia de usuario (UX) y diseño rápido de assets gráficos.
*   **Gemini 1.5:** Asistencia IA para la automatización, refactorización, scripting masivo de depuración de links, y creación UI/UX de alta fidelidad.
*   **Google Looker Studio / CounterAPI:** Tracking asíncrono para bases de datos de métricas.

---

## 3. Rama de Carpetas (Estructura del Repositorio)

El proyecto fue refactorizado exitosamente de un modelo estructurado en WordPress a un CMS estático, encapsulado para máxima escalabilidad:

```text
/
├── index.html                   # Página principal (Landing de aterrizaje y embudo central).
├── dashboard.html               # Panel privado de control que integra Looker Studio.
├── DOCUMENTACION_DESARROLLADOR.md # Este archivo (Directrices de código y métricas)
├── paginas/                     # Sub-directorios estáticos de contenido.
│   ├── blog/                    # Contenía sub-páginas como "journal".
│   │   └── index.html           
│   └── nosotros/                # Contenía sub-páginas como "philosophy".
│       └── index.html           
└── sistema_web/                 # Núcleo del sistema (Reemplazo del clásico wp-admin/includes)
    ├── assets/                  # CSS Global, Javascript local, Plugins, Temas y Assets Gráficos
    │   ├── css/custom-styles.css # ARCHIVO CRÍTICO: Hoja de ruta para utilidades CSS del proyecto
    │   └── uploads/             # Todas las imágenes y archivos visuales del proyecto.
    └── core/                    # Scripts esenciales (Librería extraída de WordPress).
```

*Nota:* Todas las rutas relativas apuntan directamente a `sistema_web/` desde cualquier archivo en la raíz para facilitar la lectura de dependencias sin recurrir a un servidor dinámico.

---

## 4. Uso de Fragmentos de Código Relevantes

### A. Estilos CSS Personalizados (`sistema_web/assets/css/custom-styles.css`)
Todo el estilo modernizado, alineación y limpieza visual han sido concentrados en este archivo para evitar el uso excesivo de variables estáticas. 
*   **Ejemplo Clave (`btn-orange-hover` y `form-submit-btn`):** Las hojas dictan que todos los botones usen formas redondeadas de pastilla (pill-shape) en color blanco, acentuando un borde o un relleno naranja y animaciones hover fluidas para alentar a la "Conversión".
*   **Ejemplo Clave (`.responsive-horizontal-img` y grids):** Resuelven la visualización móvil para que la página sea completamente compatible con pantallas de celular agregando padding o flex-wrap nativo con Vanilla CSS puro.

### B. El Dashboard (`dashboard.html`)
Es un entorno en blanco puro minimalista, usando fuentes de alto contraste naranja y negras. Sirve puramente de "Host" o anfitrión para un fragmento `<iframe>` de Google Looker Studio diseñado exclusivamente para ver el flujo.

### C. Sistema de Envío del Formulario (Formulario de Email en `index.html`)
El formulario HTML ubicado al final de `index.html` es el call-to-action del embudo de conversión y permite al usuario proveer sus datos (Nombre, Email, Teléfono, Paquete e Intereses) hacia el sistema de la agencia. 

---

## 5. La Función de Leer Métricas (Analytics & Looker Studio)

Una de las prioridades absolutas fue implementar una solución de rastreo que lograra identificar clics, retención, y el avance del embudo sin requerir bases de datos remotas de paga:

1. **Rastreo Nativo por Eventos HTTP con Javascript (`index.html`)**
   Al final del index.html, se instaló un escuchador en Javascript capaz de interceptar todos los "clics" de manera pasiva a través de una API gratuita (`CounterAPI`). 
   *   **Global Clicks:** Cada que un usuario haga clic literal en la página web, se suma una llamada `Fetch` a `global_clicks/up`.
   *   **Individual Tracker:** Todos aquellos botones estratégicos poseen un atributo HTML extra `data-tracker="[ID-DE-BOTON]"`. Al darles clic, la lógica suma una conversión de clic individual en CounterAPI sin redirigir malintencionadamente al usuario.

2. **Google Looker Studio (El `iframe`)**
   Toda esta información en bruto es visualizada en tiempo real mediante un tablero (Dashboard) conectado. 
   El siguiente iframe incrustado de Looker:
   `<iframe src="https://datastudio.google.com/embed/reporting/75058d68-ec1c-47a9-aa61-dfbcc75face9/page/dSUvF"></iframe>`
   Actúa como nuestro **panel de retención**. Este evalúa mediante gráficas la etapa de **"Consideración a Conversión"**, dándonos el % del flujo de usuarios reales en Looker Studio y determinando la efectividad general del diseño web.
