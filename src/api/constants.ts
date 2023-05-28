import env from "react-dotenv";

const development = {
  BACKEND_SERVER : process.env.REACT_APP_BACKEND_SERVER_DEV,
  env : process.env.REACT_APP_DEV_ENV || 'dev'
  };
  
  const production = {
    BACKEND_SERVER : process.env.REACT_APP_BACKEND_SERVER_PROD,
    env : process.env.REACT_APP_DEV_ENV || 'prod'
  };
  
  export function getServer():string|undefined {
      console.log(`getServer process.env.REACT_APP_DEV_ENV ${process.env.REACT_APP_DEV_ENV}`)
      const _environment = process.env.REACT_APP_DEV_ENV === 'prod' ? production : development;
      console.log(`getServer:_environment ${_environment.BACKEND_SERVER}`)
     return _environment.BACKEND_SERVER;
  } 

  export const backendServer = getServer();

  export const WIDTH_OF_WIDGETS = 250;