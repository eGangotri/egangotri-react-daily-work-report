import env from "react-dotenv";

const development = {
  BACKEND_SERVER: import.meta.env.VITE_BACKEND_SERVER_DEV,
  env: import.meta.env.VITE_DEV_ENV || 'dev'
};

//for some reason, firebase deploy is not picking this. So, hardcoding it here.
const production = {
  BACKEND_SERVER: "https://egangotri-node-backend-dwr.onrender.com/" || import.meta.env.VITE_BACKEND_SERVER_PROD,
  env: import.meta.env.VITE_DEV_ENV || 'prod'
};

export function getServer(): string | undefined {
  console.log(`getServer: import.meta.env.VITE_DEV_ENV ${import.meta.env.VITE_DEV_ENV}`)
  const _environment = import.meta.env.VITE_DEV_ENV === 'prod' ? production : development;
  console.log(`getServer:_environment ${_environment.BACKEND_SERVER}`)
  console.log(`Last Deployment:. ${import.meta.env.VITE_LAST_DEPLOYMENT_ON} `);

  return _environment.BACKEND_SERVER;
}

export const backendServer = getServer();

export const WIDTH_OF_WIDGETS = 250;