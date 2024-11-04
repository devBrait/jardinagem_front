import { CssBaseline, Box, Button, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import Loading from '../loading/Loading'
import AppTheme from '../../css/theme/AppTheme'
import NovoPedido from '../pedidos/NovoPedido'
import ListaPedidos from '../pedidos/ListaPedidos'
import SideNavbar from '../navBar/SideNavbar'
import WarningIcon from '@mui/icons-material/Warning' 
import axios from 'axios'
import toastr from 'toastr'

export default function Cliente(props: { disableCustomTheme?: boolean }) {
  const handleNovoPedidoClick = () => {
    setCurrentComponent(<NovoPedido />)
  }
  
  const [currentComponent, setCurrentComponent] = useState(<ListaPedidos handleNovoPedidoClick={handleNovoPedidoClick} />) // ListaPedidos como padrão
  const { user, loading, update } = useAuth()
  const [loadingComponentState, setLoadingComponentState] = useState(true)
  const navigate = useNavigate()
  const apiurl = import.meta.env.VITE_APP_API_URL

  const handleAtivarContaAsync = async () => {
    const url = `${apiurl}/clientes/alterna-estado` 

    try {
      const response = await axios.put(url, {email: user?.email}, {withCredentials: true})
      
      if (response.status === 200 || response.status === 204) {
          toastr.success('Conta ativada com sucesso!')

        if (user) {
          update({ ...user, ativo: !user.ativo })
        }

      } else {
        toastr.error('Não foi possível desativar a conta. Tente novamente mais tarde.')
      }
    } catch {
      toastr.error('Ocorreu um erro ao tentar desativar a conta.')
    }
  }

  useEffect(() => {
    if (loading) return // Espera até que o loading do contexto termine

    const timer = setTimeout(() => {
      if (!user) {
        navigate('/not-found')
      } else if (user.tipoUsuario !== 'cliente' && user.tipoUsuario !== 'admin') {
        navigate('/not-found')
      } else {
        setLoadingComponentState(false) 
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [user, loading, navigate])
  
  if (loading || loadingComponentState) {
    return <Loading />
  }

  const userDesativado = user && !user.ativo

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

        {userDesativado ? (
        <Box 
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: { xs: '16px', md: '32px' },
            bgcolor: 'white',
            margin: { xs: '16px', md: '32px' },
            height: '100%',
          }}
          aria-live="polite"
        >
          <Box sx={{ textAlign: 'center' }}>
            <WarningIcon sx={{ fontSize: 48, color: '#656565' }} />
            <Typography variant="h6" color="error" gutterBottom>
              Conta desativada!
            </Typography>
            <Typography variant="body1" gutterBottom>
              Para realizar suas atividades normalmente, ative sua conta novamente.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ marginTop: '16px' }}
              onClick={handleAtivarContaAsync}
            >
              Ativar Conta
            </Button>
          </Box>
        </Box>
      ) : (
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
      )}
      </Box>
    </AppTheme>
  )
}
