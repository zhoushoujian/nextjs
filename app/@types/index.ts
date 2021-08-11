//@ts-ignore
declare namespace NodeJS {
  interface Global {
    window: Window;
  }
}

interface Window {
  $getState: any;
  $dispatch: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  __NEXT_DATA__: any;
  axios: any;
}
