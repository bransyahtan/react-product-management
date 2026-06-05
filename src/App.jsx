import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layout/AppLayout";

const App = () => {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
};

export default App;
