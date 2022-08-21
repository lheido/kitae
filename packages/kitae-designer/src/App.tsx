import { supabase } from "./features/supabase";
import { Login } from "./pages/Login";

function App() {
  console.log(supabase.auth.user());
  return <Login />;
}

export default App;
