import env from "react-dotenv";

const development = {
  BACKEND_SERVER : env.REACT_APP_BACKEND_SERVER_DEV,
  env : env.REACT_APP_DEV_ENV || 'dev'
  };
  
  const production = {
    BACKEND_SERVER : env.REACT_APP_BACKEND_SERVER_PROD,
    env : env.REACT_APP_DEV_ENV || 'prod'
  };
  
  export function getServer():string|undefined {
      console.log(`getServer env.REACT_APP_DEV_ENV ${env.REACT_APP_DEV_ENV}`)
      const _environment = env.REACT_APP_DEV_ENV === 'prod' ? production : development;
      console.log(`getServer:_environment ${_environment.BACKEND_SERVER}`)
      console.log(`Last Deployment:. ${env.REACT_APP_LAST_DEPLOYMENT_ON} `);

     return _environment.BACKEND_SERVER;
  } 

  export const backendServer = getServer();

  export const WIDTH_OF_WIDGETS = 250;