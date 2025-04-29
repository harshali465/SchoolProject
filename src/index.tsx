import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter , HashRouter } from "react-router-dom";
import { base_path } from "./environment";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../src/style/css/feather.css";
import "../src/index.scss";
import store from "./core/data/redux/store";
import { Provider } from "react-redux";
import "../src/style/icon/boxicons/boxicons/css/boxicons.min.css";
import "../src/style/icon/weather/weathericons.css";
import "../src/style/icon/typicons/typicons.css";
import "../src/style/icon/fontawesome/css/fontawesome.min.css";
import "../src/style/icon/fontawesome/css/all.min.css";
import "../src/style/icon/ionic/ionicons.css";
import "../src/style/icon/tabler-icons/webfont/tabler-icons.css";
import ALLRoutes from "./feature-module/router/router";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import 'font-awesome/css/font-awesome.min.css';
import { AssignProvider } from "./feature-module/helper/AuthSelector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
        <QueryClientProvider client={queryClient}>

    <AssignProvider>
    <Provider store={store}>
      <BrowserRouter >
        <ALLRoutes />
      </BrowserRouter >
      </Provider>
      </AssignProvider>
      <ReactQueryDevtools initialIsOpen={false} />

      </QueryClientProvider>

  </React.StrictMode>
);
