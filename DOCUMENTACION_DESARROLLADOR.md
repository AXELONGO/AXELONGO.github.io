# Tarjetas de Presentación Digitales - Documentación de Desarrollo

Este documento sirve como la guía técnica oficial y visual para el proyecto **Tarjetas de Presentación Digitales**, alojado de forma estática en GitHub Pages. A continuación, se detallan los ecosistemas comerciales, la ruta de datos y la arquitectura construida mediante diagramas técnicos modernos.

---

## 1. El Embudo de Conversión (Funnel de Marketing)

El núcleo del negocio está estructurado para capturar prospectos y filtrarlos estratégicamente. Nuestra meta principal es medir el `% de retención` en cada etapa del túnel.

```mermaid
graph TD
    %% Estilos avanzados
    classDef top fill:#ff9800,stroke:#e65100,stroke-width:2px,color:#fff;
    classDef mid fill:#ffb74d,stroke:#f57c00,stroke-width:2px,color:#000;
    classDef bot fill:#ffe0b2,stroke:#ff9800,stroke-width:2px,color:#000;
    classDef end_funnel fill:#4caf50,stroke:#388e3c,stroke-width:2px,color:#fff;

    A[Presencia: Visibilidad de Marca y Anuncios]:::top --> B
    B[Consideración: Valor e Información del Servicio]:::mid --> C
    C[Conversión: Clic en Contacto y Generación de Leads]:::bot --> D
    D[Fidelización: Retención, KPI de Recompra y Promotores]:::end_funnel
```

*   **Presencia**: Captura inicial del usuario hacia `index.html`.
*   **Consideración**: Usuario lee métricas y consume contenido.
*   **Conversión**: Acciona nuestros "Botones tipo Píldora Naranjas".
*   **Fidelización**: Seguimiento y aumento del Lifetime Value (Tiempo de Vida del Cliente).

---

## 2. Diagrama de Rastreo Analítico (Looker Studio + CounterAPI)

Además de CounterAPI para conteos numéricos, el sistema utiliza un **Webhook de n8n** para capturar eventos enriquecidos (clics en botones con texto y URL).

Para no saturar el código con bases de datos ni ralentizar la web (lo cual rompería la retención), desarrollamos un modelo "Event-Driven" de clics pasivos:

```mermaid
sequenceDiagram
    participant Usuario as Visitante Web
    participant UI as Botones e Interfaz (HTML)
    participant CounterAPI as Counter API (Base Externa)
    participant Webhook as Webhook n8n (Integración Externa)
    participant Looker as Google Looker Studio Dashboard

    Usuario->>UI: Da clic en "Enviar" o "Contratar"
    UI->>CounterAPI: Fetch pasivo a /global_clicks/up (sin trabar la página)
    UI->>Webhook: Post JSON (Texto, URL, Timestamp, ID)
    CounterAPI-->>CounterAPI: Suma la interacción
    Looker->>CounterAPI: Lee la base de datos de clics
    Looker-->>Administrador: Visualiza el Performance de Conversión
```

---

## 3. Topología Tecnológica (Stack de Herramientas)

Todo el proceso de desarrollo está orquestado por un ecosistema engranado, donde cada pieza cumple una función singular para reducir costos operativos:

```mermaid
pie title Distribución del Ecosistema del Proyecto
    "HTML Estático & CSS (Velocidad y Jamstack)" : 40
    "GitHub Pages (Alojamiento CI/CD Gratuito)" : 20
    "Gemini 1.5 (UX, Code, Analítica IA)" : 20
    "Looker Studio + CounterAPI (Análisis KPI)" : 15
    "Flow / Canva (Wireframes & Assets Visuales)" : 5
```

---

## 4. Arquitectura de Directorios (Mapeo de Carpetas)

Aislar correctamente los "Assets" (CSS, JS, Imágenes) de la estructura del "Frontend" (Páginas) previene cuellos de botella al momento de actualizar o diseñar componentes en el futuro.

```mermaid
graph LR
    Root((Raíz GitHub Pages)) --> HTML_Index((index.html))
    Root --> HTML_Dash((dashboard.html))
    
    Root --> CarpetaPaginas(paginas/)
    CarpetaPaginas --> CarpetaBlog(blog/)
    CarpetaPaginas --> CarpetaNosotros(nosotros/)
    
    Root --> CarpetaSistema(sistema_web/)
    CarpetaSistema --> C_Assets(assets/)
    CarpetaSistema --> C_Core(core/ - Extraído de WordPress)
    
    C_Assets --> css_styles[css/custom-styles.css]
    C_Assets --> imgs_uploads[uploads/ Imágenes y Banners]
    
    style Root fill:#333,stroke:#fff,color:#fff
    style CarpetaSistema fill:#2196F3,color:#fff
    style css_styles fill:#f44336,color:#fff
```

### Refinamientos Recientes (UX/Performance)
*   **Service Showcase Sequence**: Secuencia automatizada que activa los bloques de servicios (Marketing → Publicidad → Web) para mostrar dinamismo sin forzar el desplazamiento del usuario.
*   **Limpieza de Residuos de WordPress**: Eliminación automatizada de shortcodes residuales (`[sc_cart_menu_icon]`) y elementos de carrito en todas las páginas (`index.html`, `nosotros`, `blog`) para un acabado 100% Jamstack.
*   **Optimización de Carga**: Eliminación del banner de video final pesado para priorizar la velocidad de carga en dispositivos móviles y la retención del usuario.

### Funciones Técnicas Críticas
*   **Sistema de Estilos Forzados (`force-orange-titles`)**: Bloque CSS inyectado en el `<head>` que asegura la identidad visual: títulos en Naranja (#f9a825), textos generales en Negro absoluto (#000000) y botones con texto legible en negro, anulando cualquier herencia de temas base de Astra/WordPress.
*   **Global Click Tracking**: Integración híbrida con **CounterAPI** (conteo persistente) y **Webhooks de n8n** (captura de contexto enriquecido: texto del botón, ID de componente y URL de origen).
*   **Sincronización GitHub CI/CD**: Arquitectura limpia donde `index.html` actúa como controlador principal y las subpáginas heredan la limpieza estructural del proyecto.

