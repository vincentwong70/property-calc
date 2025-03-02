import { AppToolbar } from "./components/layout/AppToolbar";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes/Route";

function App() {
  return (
    <Router>
      <AppToolbar />

      <div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
