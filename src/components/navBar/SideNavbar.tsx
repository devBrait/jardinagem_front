import { Box, Divider, List, ListItem, ListItemText, Typography, Drawer, IconButton } from '@mui/material'
import { UmEntreposto } from '../login/CustomIcons'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import PeopleIcon from '@mui/icons-material/People'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import Configuracoes from '../conta/Configuracoes'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import ListaPedidos from '../pedidos/ListaPedidos'
import NovoPedido from '../pedidos/NovoPedido'
import ListaSolicitacoes from '../pedidos/ListaSolicitacoes'
import CadastroPlantas from '../pedidos/CadastroPlantas'
import YardIcon from '@mui/icons-material/Yard'
import InventoryIcon from '@mui/icons-material/Inventory'
import ContaCliente from '../conta/ContaCliente'
import ContaFornecedor from '../conta/ContaFornecedor'
import GerenciarUsuarios from '../admin/GerenciarUsuarios'
import NovoNomePopular from '../admin/NovoNomePopular'
import NovoNomeCientifico from '../admin/NovoNomeCientifico'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'

interface MenuItem {
    text: string
    icon: JSX.Element
    value: string
    component?: JSX.Element 
}

export default function SideNavbar({ setCurrentComponent }: { setCurrentComponent: (component: JSX.Element) => void }) {
  const { user } = useAuth()

  const handleNovoPedidoClick = () => {
    setCurrentComponent(<NovoPedido />)
    setActiveItem('facaSeuPedido')
  }

  const handleCadastroPlantaClick = () => {
    setCurrentComponent(<CadastroPlantas />)
    setActiveItem('cadastroPlantas')
  }

  const handleNomePopularClick = () => {
    setCurrentComponent(<NovoNomePopular />)
    setActiveItem('novoNomePopular')
  }

  const menuItems: MenuItem[] = user?.tipoUsuario === 'cliente' ? [
    { text: 'Home', icon: <HomeIcon sx={{ marginRight: 3 }} />, value: 'home' },
    { text: 'Meus Pedidos', icon: <ShoppingCartIcon sx={{ marginRight: 3 }} />, value: 'meusPedidos', component: <ListaPedidos handleNovoPedidoClick={handleNovoPedidoClick} /> },
    { text: 'Faça seu Pedido', icon: <AddShoppingCartIcon sx={{ marginRight: 3 }} />, value: 'facaSeuPedido', component: <NovoPedido /> },
    { text: 'Conta', icon: <AccountCircleIcon sx={{ marginRight: 3 }} />, value: 'conta', component: <ContaCliente /> },
    { text: 'Configurações', icon: <SettingsIcon sx={{ marginRight: 3 }} />, value: 'configuracoes', component: <Configuracoes /> },
] : user?.tipoUsuario === 'fornecedor' ? [
    { text: 'Home', icon: <HomeIcon sx={{ marginRight: 3 }} />, value: 'home' },
    { text: 'Solicitações', icon: <InventoryIcon sx={{ marginRight: 3 }} />, value: 'solicitacoes', component: <ListaSolicitacoes handleCadastroPlantaClick={handleCadastroPlantaClick} /> },
    { text: 'Cadastro de Plantas', icon: <YardIcon sx={{ marginRight: 3 }} />, value: 'cadastroPlantas', component: <CadastroPlantas /> },
    { text: 'Conta', icon: <AccountCircleIcon sx={{ marginRight: 3 }} />, value: 'conta', component: <ContaFornecedor /> },
    { text: 'Configurações', icon: <SettingsIcon sx={{ marginRight: 3 }} />, value: 'configuracoes', component: <Configuracoes /> },
] : user?.tipoUsuario === 'admin' ? [
    { text: 'Home', icon: <HomeIcon sx={{ marginRight: 3 }} />, value: 'home' },
    { text: 'Gerenciar Usuários', icon: <PeopleIcon sx={{ marginRight: 3 }} />, value: 'gerenciarUsuarios', component: <GerenciarUsuarios handleNomePopularClick={handleNomePopularClick} /> },
    { text: 'Novo nome popular', icon: <LibraryAddIcon sx={{ marginRight: 3 }} />, value: 'novoNomePopular', component: <NovoNomePopular /> },
    { text: 'Novo nome científico', icon: <DriveFileRenameOutlineIcon sx={{ marginRight: 3 }} />, value: 'novoNomeCientifico', component: <NovoNomeCientifico /> },
] : []

  
  const [activeItem, setActiveItem] = useState(
    user?.tipoUsuario === 'cliente' ? 'meusPedidos' :
    user?.tipoUsuario === 'fornecedor' ? 'solicitacoes' :
    user?.tipoUsuario === 'admin' ? 'gerenciarUsuarios' : 
    'gerenciarUsuarios'
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const toggleDrawer = (open: boolean | ((prevState: boolean) => boolean)) => () => {
    setDrawerOpen(open)
  }

  const sairDaConta = () => {
    logout()
    navigate('/')
  }

  const handleMenuItemClick = (item: MenuItem) => {
    setActiveItem(item.value)

    if(item.value == 'home'){
        navigate('/')
    }else if(item.component){
        setCurrentComponent(item.component)
    }
    setDrawerOpen(false)
  }
  return (
    <Box sx={{ display: 'flex' }}>
      <IconButton onClick={toggleDrawer(true)} sx={{ display: { xs: 'block', md: 'none' } }}>
        <MenuIcon sx={{ color: '#98b344', fontSize: 30 }} />
      </IconButton>
      <Typography
        variant="h6"
        className='ml-6'
        sx={{
          padding: 2,
          display: { xs: 'center', md: 'none' }, // Exibir apenas em telas médias ou grandes
          justifyContent: 'center',
          color: '#656565',
        }}
      >
        <UmEntreposto />
      </Typography>
      {/* Drawer para telas pequenas */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            bgcolor: 'white',
            color: '#656565',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <List className="mt-4 cursor-pointer" sx={{ flexGrow: 1 }}>
            {menuItems.map((item) => (
              <ListItem
                key={item.value}
                onClick={() => handleMenuItemClick(item)}
                sx={{
                  position: 'relative',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                {item.icon}
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'bold' }} />
                {activeItem === item.value && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '30px',
                      backgroundColor: '#656565',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
          
        </Box>
        <Box sx={{ padding: 2, textAlign: 'left' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              color: '#656565',
              padding: 2,
              borderRadius: 2,
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={sairDaConta} 
          >
            <LogoutIcon sx={{ marginRight: 2 }} />
            Sair da Conta
          </Box>
        </Box>
      </Drawer>
      {/* Conteúdo da Barra Lateral (para telas grandes) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          width: 250,
          bgcolor: 'white',
          color: '#656565',
          height: '100%',
          maxWidth: '100%',
          boxShadow: '0px 0px 1px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            <UmEntreposto />
          </Typography>
          <Divider orientation="horizontal" sx={{ color: "#656565" }} />
          <List className="mt-10 cursor-pointer">
            {menuItems.map((item) => (
              <ListItem
                key={item.value}
                onClick={() => handleMenuItemClick(item)} // Atualiza o componente ao clicar
                sx={{
                  position: 'relative',
                  transition: 'background-color 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                {item.icon}
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 'bold' }} />
                {activeItem === item.value && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '30px',
                      backgroundColor: '#656565',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ padding: 2, textAlign: 'left' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              color: '#656565',
              padding: 2,
              borderRadius: 2,
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 'bold',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
            onClick={sairDaConta} 
          >
            <LogoutIcon sx={{ marginRight: 2 }}/>
            Sair da Conta
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
