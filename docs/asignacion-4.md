# UNIVERSIDAD NACIONAL SEDE REGIONAL BRUNCA
**EIF209 Programación IV**  
**Profesores:** Daniel Granados - Rubén Mora - Juan Gamboa

## Actividad 4: Desarrollo de aplicación web en tiempo real con Angular y Firebase
**Entrega:** 08/05/2026 5:00pm

### Objetivo
Diseñar y desarrollar una aplicación web moderna utilizando Angular en su versión más reciente y Firebase, que permita la creación y participación en encuestas con resultados en tiempo real, integrando principios de desarrollo frontend, manejo de estado reactivo, visualización de datos mediante gráficos y reglas de seguridad en el backend.

La actividad busca introducir a los estudiantes en el uso práctico de frameworks frontend modernos, servicios backend serverless y aplicaciones reactivas en tiempo real, simulando un escenario real de desarrollo web.

La actividad estará dividida en dos secciones, una de **programación** que cuenta con un valor del **60%** y una **teórica** con un valor del **40%**, la cual será un quiz la siguiente clase que se realizará de forma individual, de forma que, la programación, esquemas de diseño en tiempo real, como buenas prácticas de la tecnología de Angular y Firebase que los alumnos implementen puede ser evaluada de forma teórica.

### Instrucciones
1. Lea y comprenda cuidadosamente todo el documento antes de iniciar la actividad.
2. La actividad es de carácter grupal, conformando grupos de proyecto.
3. Todas las decisiones técnicas y de diseño deben estar reflejadas en el proyecto final y documentadas.
4. No se aceptarán trabajos que se entregan de forma tardía o no sean entregados por el Aula Virtual. Si se realiza un cambio en el repositorio luego de la fecha establecida, no serán tomados en cuenta.
5. En caso de no entregarse **TODOS** los documentos solicitados en el Aula Virtual, todos los estudiantes tienen 0 de forma inmediata.
6. El uso de Inteligencia Artificial está permitido siempre y cuando no entorpezca el aprendizaje del alumno, ya que todo lo incluido en el desarrollo puede ser tema a calificar en la segunda parte.

---

## Descripción General del Proyecto
Cada grupo deberá desarrollar una aplicación web de encuestas y votaciones, donde los usuarios puedan crear encuestas y otros usuarios puedan votar, visualizando los resultados en tiempo real mediante gráficos.

La aplicación debe demostrar el uso correcto de:
- Angular moderno
- Firebase como backend
- Actualización en tiempo real
- Visualización de datos y UI

---

## Requerimientos Funcionales

### Parte 1: Autenticación
1. Autenticación de usuarios mediante Firebase Authentication.
2. Se permite utilizar:
   - Login con Google
   - Login con correo electrónico
3. Solo los usuarios autenticados pueden:
   - Crear encuestas
   - Votar
   - Visualizar resultados detallados

### Parte 2: Gestión de Encuestas
Cada usuario autenticado podrá:
1. Crear una encuesta que incluya:
   - Título
   - Descripción (opcional)
   - Al menos 2 opciones de voto
2. Visualizar una lista de encuestas disponibles.
3. Acceder a una encuesta específica para votar.

### Parte 3: Sistema de Votación
1. Cada usuario podrá emitir un único voto por encuesta.
2. El sistema debe impedir votos duplicados.
3. El voto debe almacenarse en Firestore.
4. Una vez emitido el voto, el usuario debe poder:
   - Ver los resultados
   - Ver que su voto fue registrado correctamente.
5. Cuando se inicia o se abre al público la encuesta, se deberá generar un QR que permita entrar fácilmente a la misma.

### Parte 4: Resultados en Tiempo Real y Gráficos
1. Los resultados de cada encuesta deben:
   - Actualizarse en tiempo real sin recargar la página.
   - Reflejarse inmediatamente cuando un usuario emite un voto.
2. Los resultados deben mostrarse utilizando gráficos, por ejemplo:
   - Barras
   - Pastel
   - Líneas (si aplica)
3. La elección de la librería de gráficos es libre (por ejemplo: Chart.js u otra compatible con Angular).

---

## Requerimientos Técnicos

### Angular
La aplicación debe utilizar características modernas de Angular:
- Componentes standalone
- Manejo de estado con Signals
- `inject()` en lugar de constructores tradicionales
- Routing con carga perezosa (lazy loading)
- Estructura clara y modular del proyecto
- Debe justificar las diferentes tecnologías o librerías que utilice y el por qué se incluyen en Angular moderno.

❌ **No se permite** el uso de versiones antiguas ni estructuras basadas en `NgModule`.

### Firebase
El proyecto debe integrar:
- Firebase Authentication
- Firestore
- Listeners en tiempo real (`onSnapshot` o equivalentes)

Además:
- Definir y documentar Firestore Security Rules que:
  - Impidan votos duplicados
  - Restrinjan la creación y modificación de encuestas
  - Protejan la información de los usuarios
- Documentar cuál es el enfoque NoSQL para evitar consumir extra en Firebase y superar la capa gratuita.

---

## Parte 5: Documentación del Proyecto
Cada grupo deberá documentar su trabajo en el repositorio de GitHub, incluyendo en el archivo `README.md`:
1. Descripción general del proyecto.
2. Tecnologías utilizadas.
3. Estructura general de la aplicación.
4. Explicación breve del flujo de:
   - Autenticación
   - Creación de encuestas
   - Votación
   - Visualización en tiempo real
5. Capturas de pantalla del sistema en funcionamiento.
6. Enlace a la aplicación desplegada.

## Parte 6: Presentación en Clase
1. Cada grupo dispondrá de 10 minutos para:
   - Mostrar la aplicación funcionando
   - Explicar brevemente la arquitectura y decisiones técnicas
   - Generar una encuesta y que los compañeros se puedan conectar usando el QR y demuestre los resultados en tiempo real.

---

## Entregables
Un archivo en PDF donde se encuentre lo siguiente:
- Portada con el nombre de los participantes del grupo.
- Enlace al repositorio de GitHub, que incluya:
  - Código fuente del proyecto
  - Archivo `README.md` completo
- Enlace a la aplicación desplegada (Firebase Hosting u otro servicio)

*Todos los enlaces deben estar correctamente nombrados, accesibles y compartidos con el profesor.*

---

## Criterios de Evaluación

| Rúbrica | Alto (4–5) | Suficiente (2–3) | Bajo (0–1) |
|---|---|---|---|
| **Uso de Angular moderno (20%)** | Uso correcto de standalone, signals y routing moderno, hace uso de buenas prácticas de Angular, a nivel de código como de diseño. | Uso parcial de características modernas, no tiene un aspecto visual que agrade al usuario y no tiene buenas prácticas de desarrollo. | Uso incorrecto o versiones antiguas |
| **Integración con Firebase (20%)** | Auth y Firestore bien integrados | Integración básica | Integración incompleta |
| **Tiempo real y votación (20%)** | Actualización inmediata y correcta | Funciona con retrasos o fallos menores | No es realmente tiempo real |
| **Visualización con gráficos (15%)** | Gráficos claros y bien integrados, los gráficos aportan valor visual y no están sobresaturados. | Gráficos básicos, no aportan valor, generan más ruido y no están definiendo la información de forma correcta. | No utiliza gráficos |
| **Seguridad y reglas (15%)** | Reglas claras y correctas | Reglas incompletas | No hay reglas |
| **Documentación y presentación (10%)** | README claro y demo efectiva | Documentación básica | No documenta ni presenta |

*Cada rúbrica se evalúa de 0 a 5, y luego se pondera al porcentaje indicado.*