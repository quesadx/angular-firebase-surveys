# AngularFirebaseSurveys

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.25.

## Project overview

Angular + Firebase survey app that lets users create surveys, share them via QR codes, and view details in real time.

## Tech stack

- Angular standalone components, Signals, `inject()`, and lazy-loaded routes
- Firebase Authentication, Firestore, and Firebase Hosting
- Chart.js + ng2-charts for real-time results
- angularx-qrcode for QR code generation

## Architecture

- `src/main.ts` boots the app with `bootstrapApplication()`.
- `src/app/app.config.ts` registers router, Firebase, Firestore, Auth, and charts providers.
- `src/app/app.routes.ts` uses lazy-loaded standalone components.
- Firestore stores surveys in `surveys` and votes in `surveys/{surveyId}/votes`.

## Project status

The application already covers the core assignment requirements:

- Authentication with Firebase Auth
- Survey creation and list view
- Single vote per user enforced by Firestore rules
- Real-time vote updates with Firestore listeners
- Pie chart visualization for survey results
- QR code to access each survey quickly

## Deployment

This project is prepared for Firebase Hosting.

- Production build output: `dist/angular-firebase-surveys`
- Hosting rewrites are configured so Angular routing works on refresh
- Production survey links use `https://angular-firebase-surveys.web.app`

To deploy after logging into Firebase, run:

```bash
npm run build
firebase login
firebase deploy
```

If you only want to publish the web app, you can use:

```bash
firebase deploy --only hosting
```

## Environment setup

Update the `appUrl` value in the environment file to match your deployment domain so QR codes encode the correct URL.

For production builds, the project uses `src/environments/environment.prod.ts`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
