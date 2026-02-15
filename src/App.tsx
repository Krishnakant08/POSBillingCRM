import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import "./App.css";
import { MenuProvider } from "./Contexts/MenuContext";
import { OrderProvider } from "./Contexts/OrderContext";
import { SettingsProvider } from "./Contexts/SettingsContext";
import { TableProvider } from "./Contexts/TableContext";

function App() {
  return (
    <MenuProvider>
      <SettingsProvider>
        <TableProvider>
          <OrderProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </OrderProvider>
        </TableProvider>
      </SettingsProvider>
    </MenuProvider>
  );
}

export default App;
