# Avance del proyecto

Este proyecto es una aplicación en Angular conectada con Firebase para encuestas en tiempo real. Hasta ahora se dejó lista la base técnica para que la app pueda autenticarse con Google, guardar datos en Firestore y manejar votos de forma segura.

## Qué se implementó hasta ahora

Se configuró el proyecto Angular con una estructura moderna basada en componentes standalone, lo que permite trabajar con una base más simple y ordenada. También se conectó Angular con Firebase usando AngularFire, para poder usar sus servicios directamente dentro de la aplicación.

Además, se dejó preparado el sistema de autenticación con Firebase Auth, se configuró Firestore como base de datos y se organizó la estructura inicial para trabajar con encuestas y votos.

## Cómo quedó la conexión con Firebase

La aplicación ya está conectada a Firebase desde la configuración general del proyecto. Ahí se inicializa Firebase con las credenciales del entorno y se habilitan los servicios que la app necesita:

- Authentication, para iniciar sesión con Google
- Firestore, para guardar encuestas y votos

Con esto, Angular puede usar Firebase sin configuraciones extra en cada componente.

## Cómo es el flujo de la aplicación

El flujo general quedó pensado así:

1. El usuario entra a la aplicación.
2. Angular carga la configuración general y conecta con Firebase.
3. Si el usuario no ha iniciado sesión, se prepara el flujo de autenticación con Google.
4. Cuando el usuario entra con Firebase Auth, se obtiene su UID único.
5. Ese UID se usa para identificar al usuario dentro de la app y para relacionarlo con sus votos.
6. Las encuestas se guardan en Firestore y cada encuesta puede tener una lista de votos asociada.
7. Las reglas de seguridad controlan qué puede hacer cada usuario según si está autenticado o no.

## Cómo se estructuró Firestore

La base de datos se organizó de una forma simple para guardar encuestas y votos por separado.

### Colección `users`

Esta colección guarda la información básica de cada usuario que inicia sesión en la aplicación.

Cada documento de `users` suele guardar datos como:

- `uid`: identificador único del usuario
- `name`: nombre del usuario
- `email`: correo electrónico
- `createdAt`: fecha en la que se registró o se guardó por primera vez

### Colección `surveys`

Esta es la colección principal. Aquí se guarda cada encuesta como un documento independiente.

Cada documento de `surveys` debería tener datos como:

- `title`: título de la encuesta
- `description`: descripción corta de la encuesta
- `options`: lista de opciones disponibles
- `createdBy`: UID del usuario que creó la encuesta
- `createdAt`: fecha de creación
- `totalVotes`: total de votos registrados

### Subcolección `votes`

Dentro de cada encuesta existe una subcolección llamada `votes`. Ahí se guarda el voto de cada usuario.

Cada voto puede tener estos datos:

- `userId`: UID del usuario que votó
- `option`: opción que eligió
- `createdAt`: fecha en la que votó

### Ejemplo real de Firestore

```text
users
  └── wggyCbPv1XoRJ6HNSThw
      ├── uid: "wggyCbPv1XoRJ6HNSThw"
      ├── name: "testuserName"
      ├── email: "test@una.ac.cr"
      └── createdAt: "2026-05-05T12:25:00Z"

surveys
  └── survey_001
      ├── title: "¿Cuál es tu color favorito?"
      ├── description: "Encuesta rápida para conocer preferencias"
      ├── options: ["Rojo", "Azul", "Verde"]
      ├── createdBy: "wggyCbPv1XoRJ6HNSThw"
      ├── createdAt: "2026-05-05T12:30:00Z"
      ├── totalVotes: 3
      └── votes
          ├── user_abc123
          │   ├── userId: "user_abc123"
          │   ├── option: "Azul"
          │   └── createdAt: "2026-05-05T12:35:10Z"
          └── user_xyz789
              ├── userId: "user_xyz789"
              ├── option: "Rojo"
              └── createdAt: "2026-05-05T12:36:20Z"
```

Esta estructura permite mantener separados los datos de las encuestas y los votos, y hace más fácil consultar la información después.

## Cómo se maneja el usuario con Firebase Auth

Firebase Auth devuelve un `UID` para cada usuario autenticado. Ese UID es el identificador principal que se está usando en el proyecto para saber quién inició sesión y para registrar sus votos sin confundirlos con los de otros usuarios.

Gracias a eso, cada voto queda asociado a un usuario específico y se evita que una misma persona se registre más de una vez en la misma encuesta.

## Reglas de seguridad

También se dejaron configuradas reglas básicas de Firestore para proteger los datos:

- solo usuarios autenticados pueden leer y crear encuestas
- solo el creador de una encuesta puede editarla o eliminarla
- cada usuario solo puede crear su propio voto
- los votos no se pueden modificar ni borrar

Esto asegura que los datos tengan un control básico de acceso desde el inicio.

## Resumen del estado actual

En este punto, el proyecto ya tiene la base lista para comenzar con la parte funcional de las encuestas. Ya están preparados:

- la estructura inicial de Angular
- la conexión con Firebase
- la autenticación con Google
- Firestore para guardar encuestas y votos
- el uso del UID para identificar usuarios
- las reglas de seguridad para proteger la información

Con esto, el proyecto queda listo para seguir con la interfaz y las funcionalidades de creación, voto y visualización de resultados.
