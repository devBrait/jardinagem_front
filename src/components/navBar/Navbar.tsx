import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Link,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Funções para redirecionamento de login e cadastro
  const handleLoginClick = () => {
    window.location.href = "/login"; // Caminho correto para o login
  };

  const handleCadastroClick = () => {
    window.location.href = "/cadastro"; // Caminho correto para o cadastro
  };

  const toggleDrawer = (open: boolean | ((prevState: boolean) => boolean)) => () => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#fff", boxShadow: "none" }}>
        <Toolbar className="px-[50px] flex justify-between">
          {/* Ícone do menu */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              display: { xs: 'block', md: 'none' },
              padding: 1,
            }}
          >
            <MenuIcon sx={{ color: "#98b344", fontSize: 32 }} /> {/* Cor do ícone */}
          </IconButton>

          {/* Cabeçalho com o título da marca */}
          <Typography
            variant="h1"
            sx={{
              fontSize: "32px",
              fontWeight: 400,
              color: "#656565",
              margin: 0,
              textAlign: { xs: 'center', md: 'left' }, // Centraliza em telas pequenas
              flexGrow: 1,
            }}
          >
            <span style={{ color: "#98b344" }}>um</span>entreposto
          </Typography>

          {/* Links de navegação (visíveis apenas em telas grandes e centralizados) */}
          <Box
            display={{ xs: 'none', md: 'flex' }}
            justifyContent="center"
            flexGrow={12}
            mx={5}
          >
            <Link href="/" underline="none" sx={{ mx: 2, color: "#656565", "&:hover": { color: "#000" }, transition: "color 0.3s ease"}}>
              <Typography variant="body1" className="text-lg">Home</Typography>
            </Link>
            <Typography mx={1} color="#656565">
            |
          </Typography>
            <Link href="/" underline="none" sx={{ mx: 2, color: "#656565", "&:hover": { color: "#000" }, transition: "color 0.3s ease" }}>
              <Typography variant="body1" className="text-lg">Como Funciona</Typography>
            </Link>
            <Typography mx={1} color="#656565">
            |
          </Typography>
            <Link href="/" underline="none" sx={{ mx: 2, color: "#656565", "&:hover": { color: "#000" }, transition: "color 0.3s ease" }}>
              <Typography variant="body1" className="text-lg">Blog</Typography>
            </Link>
            <Typography mx={1} color="#656565">
            |
          </Typography>
          <Link href="/" underline="none" sx={{ mx: 2, color: "#656565", "&:hover": { color: "#000" }, transition: "color 0.3s ease" }}>
              <Typography variant="body1" className="text-lg">Vantagens</Typography>
            </Link>
          </Box>

          {/* Botões de Login e Cadastro */}
          <Box display={{ xs: 'none', md: 'flex' }} className="space-x-4">
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{ backgroundColor: "#98b344", "&:hover": { backgroundColor: "#7a9244" }, borderRadius: "50px", px: 4, py: 1, textTransform: 'none' }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={handleCadastroClick}
              sx={{ backgroundColor: "#98b344", "&:hover": { backgroundColor: "#7a9244" }, borderRadius: "50px", px: 4, py: 1, textTransform: 'none' }}
            >
              Cadastro
            </Button>
          </Box>
          
        </Toolbar>
          <Divider orientation="horizontal" sx={{color: "#656565", marginTop: "10px"}}/>
      </AppBar>

        {/* Menu Lateral */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ height: '100%', backgroundColor: "#98b344" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List className="text-white cursor-pointer">
            {['Home', 'Como Funciona', 'Blog', 'Vantagens'].map((text) => (
              <ListItem
                key={text}
                sx={{
                  '&:hover': {
                    backgroundColor: '#7a9a2a', // Cor de fundo ao passar o mouse
                    transition: 'background-color 0.3s ease', // Transição suave
                  },
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <ListItem
              onClick={handleLoginClick}
              sx={{
                '&:hover': {
                  backgroundColor: '#7a9a2a',
                  transition: 'background-color 0.3s ease',
                },
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              onClick={handleCadastroClick}
              sx={{
                '&:hover': {
                  backgroundColor: '#7a9a2a',
                  transition: 'background-color 0.3s ease',
                },
              }}
            >
              <ListItemText primary="Cadastro" />
            </ListItem>
          </List>
        </Box>
    </Drawer>
    </>
  )
}
