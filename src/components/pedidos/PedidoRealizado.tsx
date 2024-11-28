import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Paper, 
  IconButton, 
  CssBaseline
} from '@mui/material';
import { 
  CheckCircleOutline as CheckIcon, 
  LocalMall as OrderIcon, 
  ArrowBack as BackIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppTheme from '../../css/theme/AppTheme';

export default function PedidoRealizado(props: { disableCustomTheme?: boolean }) {
  const navigate = useNavigate();

  const handleVisualizarPedidos = () => {
    navigate('/dashboard-cliente')
  }

  const handleVoltar = () => {
    navigate(-1)
  }

  return (
    <AppTheme {...props}>
    <CssBaseline enableColorScheme />
    <Container maxWidth="sm">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          padding: 3
        }}
      >
        <IconButton 
          onClick={handleVoltar}
          sx={{ 
            alignSelf: 'flex-start', 
            position: 'absolute', 
            top: 16, 
            left: 16 
          }}
        >
          <BackIcon />
        </IconButton>

        <Paper 
          elevation={3} 
          sx={{
            padding: 4,
            borderRadius: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%'
          }}
        >
          <CheckIcon 
            className='text-verde_claro'
            sx={{ fontSize: 100 }} 
          />

          <Typography 
            variant="h4" 
            component="h1" 
            color="primary"
            sx={{ fontWeight: 'bold' }}
          >
            Pedido Realizado
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 2 }}
          >
            Seu pedido foi confirmado com sucesso! 
            Em breve você receberá mais informações, fique de olho no seu e-mail.
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              width: '100%' 
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<OrderIcon />}
              onClick={handleVisualizarPedidos}
            >
              Meus Pedidos
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
    </AppTheme>
  )
}