import { CssBaseline, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import Loading from '../loading/Loading'
import AppTheme from '../../css/theme/AppTheme'
import NovoPedido from '../pedidos/NovoPedido'
import ListaPedidos from '../pedidos/ListaPedidos'
import SideNavbar from '../navBar/SideNavbar'

export default function Cliente(props: { disableCustomTheme?: boolean }) {
  const handleNovoPedidoClick = () => {
    setCurrentComponent(<NovoPedido />)
  }
  const [currentComponent, setCurrentComponent] = useState(<ListaPedidos handleNovoPedidoClick={handleNovoPedidoClick} />) // ListaPedidos como padrão
  const { user, loading } = useAuth()
  const [loadingComponentState, setLoadingComponentState] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return // Espera até que o loading do contexto termine
  
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/not-found')
      } else if (user.tipoUsuario !== 'cliente' && user.tipoUsuario !== 'admin') {
        navigate('/not-found')
      } else {
        setLoadingComponentState(false) // Desativa o carregamento específico deste componente
      }
    }, 500)
  
    return () => clearTimeout(timer)
  }, [user, loading, navigate])
  
  if (loading || loadingComponentState) {
    return <Loading />
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
        {/* flexDirection muda entre coluna para telas pequenas (xs) e linha para grandes (md) */}
        
        {/* navBar */}
        <Box
          sx={{
            width: { xs: '100%', md: 350 },
            flexShrink: 0,
            padding: { xs: '8px' },
            paddingX: { xs: '8px', md: '16px' },
            bgcolor: 'white',
            boxShadow: 0,
            order: { xs: 0, md: 0 },
          }}
        >
          <SideNavbar setCurrentComponent={setCurrentComponent} />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            padding: { xs: '8px', md: '16px' },
            bgcolor: 'white',
            order: { xs: 1, md: 1 },
          }}
        >
          {currentComponent} {/* Renderiza o componente atual */}
        </Box>
      </Box>
    </AppTheme>
  )
}
