import { useState } from "react"
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
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../AuthContext"

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Funções para redirecionamento de login e cadastro
  const handleLoginClick = () => {
    navigate("/login")// Caminho correto para o login
  }

   // Funções para abrir e fechar o menu do avatar
   const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleMenuClose()
  }

  const handlePerfil = () => {
    if(user?.tipoUsuario == 'cliente'){
      navigate("/dashboard-cliente")
    }else if(user?.tipoUsuario == 'fornecedor' || user?.tipoUsuario == 'admin'){
      navigate("/dashboard-fornecedor")
    }
  }
 

  const handleCadastroClick = () => {
   navigate("/cadastro") // Caminho correto para o cadastro
  }

  const toggleDrawer = (open: boolean | ((prevState: boolean) => boolean)) => () => {
    setDrawerOpen(open)
  }

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
              textAlign: { xs: 'center', md: 'left'}, // Centraliza em telas pequenas
              flexGrow: 1,
              marginBottom: { xs: '6px', md: '0' },
              padding: { xs: '12px', md: '0' },
            }}
          >
            <span style={{ color: "#98b344" }}>um</span>entreposto
          </Typography>

          {user ? (
            <>
            <Box display={{ xs: 'right', md: 'none' }} className="space-x-4 ml-2">
              <IconButton onClick={handleAvatarClick}>
                <Avatar sx={{ bgcolor: "#98b344"}}>
                  {user.email.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: "45px" }}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
            </>
          ) : null}

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
          {user ? (
            <>
              <IconButton onClick={handleAvatarClick} sx={{ padding: 0 }}>
                <Avatar sx={{ bgcolor: "#98b344" }}>
                  {user.email.charAt(0).toUpperCase()} {/* Iniciais do usuário */}
                </Avatar>
              </IconButton>
              {/* Contêiner vazio para manter o espaço sem afetar a área de clique */}
              <Box sx={{ width: '100px' }} /> {/* Ajuste a largura conforme necessário */}
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: "45px" }}
              >
                <MenuItem onClick={handlePerfil}>Meu perfil</MenuItem>
                <MenuItem onClick={handleLogout}>Sair</MenuItem>
              </Menu>
            </>
            ) : (
            <>
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
              </>
            )}
          </Box>
          
        </Toolbar>
          <Divider orientation="horizontal" sx={{color: "#656565", marginTop: "10px"}}/>
      </AppBar>

        {/* Menu Lateral */}
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ height: '100%', backgroundColor: "#ffff" }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List className="text-verde_claro cursor-pointer">
            {['Home', 'Como Funciona', 'Blog', 'Vantagens'].map((text) => (
              <ListItem key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            {user ? (
              null
          ) : (
            <>
              <ListItem>
                <Button
                  onClick={handleLoginClick}
                  variant="contained"
                  sx={{
                    backgroundColor: '#ffff',
                    color: "#98b344",
                    width: '100%',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#6b8a2a',
                      transition: 'background-color 0.3s ease',
                    },
                  }}
                >
                  Login
                </Button>
              </ListItem>
              <ListItem>
                <Button
                  onClick={handleCadastroClick}
                  variant="contained"
                  sx={{
                    backgroundColor: '#7a9a2a',
                    color: 'white',
                    width: '100%',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#6b8a2a',
                      transition: 'background-color 0.3s ease',
                    },
                  }}
                >
                  Cadastro
                </Button>
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>

    </>
  )
}
