import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Erro() {
  const navigate = useNavigate()

  const handleHome = () => {
    navigate('/')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        bgcolor: 'white',
      }}
    >
      <Typography variant="h1" color="#656565" className='font-bold' sx={{ fontSize: '4rem'}}>
        404
      </Typography>
      <Typography variant="h6" className="text-cinza_claro" sx={{ marginBottom: 2 }}>
        Desculpe, ocorreu um erro.
      </Typography>
      <Typography variant="body1" className="text-cinza_claro" sx={{ marginBottom: 4}}>
        A página que você está procurando não foi encontrada.
      </Typography>
      <Button variant="contained" className='bg-verde_claro' onClick={handleHome}>
        Voltar para a Página Inicial
      </Button>
    </Box>
  )
}
