import { AppToolbar } from "./components/layout/AppToolbar";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Route";
import { SnackbarProvider } from "./providers/NotifyProvider";

function App() {
  return (
    <SnackbarProvider>
      <Router>
        <AppToolbar />

        <div>
          <AppRoutes />
        </div>
      </Router>
    </SnackbarProvider>
  );
}

export default App;
