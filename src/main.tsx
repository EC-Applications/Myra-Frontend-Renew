import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ThemeProvider } from "./components/theme-provider.tsx";
import "./index.css";
import AppRoutes from "./routing/app-routes.tsx";
import { store } from "./store/store.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./query-client.ts";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  </QueryClientProvider>
);