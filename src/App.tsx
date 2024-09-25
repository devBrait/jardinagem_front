import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Button from "@mui/material/Button";
import SignIn from './login/SignIn'; // Ajuste o caminho se necessário

export default function App() {
  const [login, setLogin] = useState(false);
  const navigate = useNavigate()

  const showLogin = () => {
    setLogin(true); 
    navigate('/login')
  };

  return (
    <>
      {!login ? (
        <>
          <h1 className="text-2xl text-black font-bold mt-5">
            Olá UmEntrePosto
          </h1>
          <Button
            variant="contained"
            className="bg-black text-1xl"
            onClick={showLogin}
          >
            Carregar Tela de Login
          </Button>
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
}
