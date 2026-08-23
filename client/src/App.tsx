import AppRoutes from "./routes";
import { ThemeProvider } from "./context/theme-provider";
import { SocketProvider } from "./context/socket-provider";
import { ChatbotWidget } from "./components/chatbot/ChatbotWidget";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SocketProvider>
        <AppRoutes />
        <ChatbotWidget />
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;