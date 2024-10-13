import { Box, Divider, List, ListItem, ListItemText, Typography, Drawer, IconButton } from '@mui/material'
import { UmEntreposto } from '../login/CustomIcons'
import LogoutIcon from '@mui/icons-material/Logout'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import HomeIcon from '@mui/icons-material/Home'
import Conta from '../conta/Conta'
import Configuracoes from '../conta/Configuracoes'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import ListaPedidos from '../pedidos/ListaPedidos'
import NovoPedido from '../pedidos/NovoPedido'

interface MenuItem {
    text: string
    icon: JSX.Element
    value: string
    component?: JSX.Element // Opcional, pois nem todos os itens terão um componente associado
}

export default function SideNavbar({ setCurrentComponent }: { setCurrentComponent: (component: JSX.Element) => void }) {

  const handleNovoPedidoClick = () => {
    setCurrentComponent(<NovoPedido />)
    setActiveItem('facaSeuPedido')
  }

  const menuItems: MenuItem[] = [
    { text: 'Home', icon: <HomeIcon sx={{ marginRight: 3 }} />, value: 'home'},
    { text: 'Meus Pedidos', icon: <ShoppingCartIcon sx={{ marginRight: 3 }} />, value: 'meusPedidos', component: <ListaPedidos handleNovoPedidoClick={handleNovoPedidoClick} /> },
    { text: 'Faça seu Pedido', icon: <AddShoppingCartIcon sx={{ marginRight: 3 }} />, value: 'facaSeuPedido', component: <NovoPedido /> },
    { text: 'Conta', icon: <AccountCircleIcon sx={{ marginRight: 3 }} />, value: 'conta', component: <Conta /> },
    { text: 'Configurações', icon: <SettingsIcon sx={{ marginRight: 3 }} />, value: 'configuracoes', component: <Configuracoes /> },
  ]

  const [activeItem, setActiveItem] = useState('meusPedidos')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()

  const toggleDrawer = (open: boolean | ((prevState: boolean) => boolean)) => () => {
    setDrawerOpen(open)
  }

  const sairDaConta = () => {
    console.log('Saindo da conta...')
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
