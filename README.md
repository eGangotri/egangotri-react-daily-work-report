# eGangotri Daily Work Report

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### Configure absolute Paths
https://levelup.gitconnected.com/understand-and-configure-absolute-import-paths-in-javascript-5cde3be2630d

### Linting
https://creativedesignsguru.com/how-to-configure-eslint-prettier-react/
npm i eslint --save-dev
npm install eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev

### Use of Personal Access Token
 git push  https://egangotri:PAT@github.com/eGangotri/egangotri-react-daily-work-report.git
 insert your Tokern in PAT above

### Google Firebase Deployment
https://www.geeksforgeeks.org/how-to-deploy-react-project-on-firebase/

First time
 npm install -g firebase-tools
 firebase init 

 afterwards

firebase login

    Are you ready to proceed? Yes
    ? Which Firebase features do you want to set up for this directory? Press Space to select features, then Enter to confirm your choices. (Press <space> to select, <a>
    to toggle all, <i> to invert selection, and <enter> to proceed)
    Choose:
    (*) Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys

   ? What do you want to use as your public directory? build
   ? Configure as a single-page app (rewrite all urls to /index.html)? (y/N) y
   ? Set up automatic builds and deploys with GitHub? (y/N) 

What do you want to use as your public directory? public
Configure as a single-page app (rewrite all urls to /index.html)? Yes
Setup automatic builds No


npm run build
firebase deploy

These below are the old version installed for https://github.com/eGangotri/egangotri-react-daily-work-report
https://egangotri-react-daily-work-report.web.app/
https://egangotri-react-daily-work-report.firebaseapp.com/