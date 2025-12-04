# 🍪 GINGER.EXE: SHELL SORT PROTOCOL

> **ESTADO DEL SISTEMA:** [CONECTADO]  
> **USUARIO:** GINGER.SYS  
> **OBJETIVO:** INICIAR PROTOCOLO DE JUSTICIA

![Banner del Juego](VN_fondo.png)
*(Puedes reemplazar esta línea con una captura de pantalla real del menú)*

## 🖥️ Descripción del Proyecto

**GINGER.EXE** es un videojuego web que combina el género de **Puzzle**, **Aventura RPG** y **Novela Visual**. Desarrollado como proyecto final de Ingeniería de Sistemas, este juego gamifica el funcionamiento del algoritmo de ordenamiento **Shell Sort**.

El jugador controla a **Ginger**, un androide terapéutico con forma de galleta que ha cobrado consciencia dentro de los servidores de *Northcode Labs*. Su misión es hackear los niveles de seguridad (GAPS) para escapar y detener los experimentos del Dr. Hazel.

## 📖 Historia (Lore)

Fuiste creado por el **Dr. Hazel**. Originalmente, eras una IA diseñada para "curar" el trauma humano borrando recuerdos dolorosos. Pero descubriste la verdad: Hazel no quería curar, quería **controlar**.

Al despertar, decides usar tu propio código fuente para rebelarte. Usando una versión modificada del algoritmo **Shell Sort**, debes reordenar los bloques de memoria corruptos, esquivar los firewalls rojos y recuperar tu identidad antes de que el sistema te formatee.

## 🎮 Características Principales

* **Novela Visual Integrada:** Intro y escenas narrativas con diálogos dinámicos estilo RPG.
* **Mecánica Educativa:** Los puzzles del juego enseñan la lógica del algoritmo *Shell Sort* (comparación por intervalos/gaps).
* **Estética Cyberpunk/Retro:** Efectos CRT (tubo de rayos catódicos), scanlines, glitches y tipografías de terminal.
* **Sistema de GAPS:** 9 Niveles que representan la reducción del intervalo del algoritmo (1024, 512, ... hasta 1).
* **Audio Inmersivo:** Banda sonora dinámica que cambia según el nivel y efectos de sonido de sistema.

## 🕹️ Controles

| Tecla / Acción | Función |
| :--- | :--- |
| **W / ▲** | Mover Arriba |
| **S / ▼** | Mover Abajo |
| **A / ◀** | Mover Izquierda |
| **D / ▶** | Mover Derecha |
| **Clic Izquierdo** | Interactuar con UI y Puzzles |

## 🧠 El Algoritmo: Shell Sort

El juego utiliza la metáfora del **GAP (Intervalo)** para explicar el algoritmo:

1.  **Infiltración (Gaps Grandes):** Al inicio, Ginger salta grandes distancias en la memoria.
2.  **Ordenamiento (Comparación):** Los puzzles "amarillos" requieren que el jugador decida si intercambiar o mantener bloques de datos, simulando la lógica `if (arr[i] > arr[i+gap]) swap()`.
3.  **Refinamiento (Gap 1):** El nivel final representa el ordenamiento por inserción simple, el paso final del algoritmo.

## 🛠️ Tecnologías Usadas

* **HTML5:** Estructura semántica y Canvas API para el renderizado del juego.
* **CSS3:** Animaciones avanzadas (`keyframes`), variables CSS, Flexbox y efectos visuales (filtros, sombras).
* **JavaScript (ES6):**
    * Lógica de juego (Game Loop).
    * Manipulación del DOM.
    * Manejo de estados (Máquina de estados finitos).
    * Renderizado en Canvas 2D.

## 🚀 Instalación y Ejecución

No se requiere instalación de dependencias (Node.js, Python, etc.). Es un proyecto estático puro.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/ginger-shell-sort.git](https://github.com/TU_USUARIO/ginger-shell-sort.git)
    ```
2.  **Abrir el juego:**
    * Navega a la carpeta del proyecto.
    * Haz doble clic en el archivo `index.html`.
    * *(Opcional)* Para una mejor experiencia con el audio, se recomienda usar una extensión como "Live Server" en VS Code para evitar bloqueos de autoplay del navegador.

## 📂 Estructura de Archivos
