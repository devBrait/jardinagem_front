import { Box, Typography, Link, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      width="auto"
      component="footer"
      sx={{
        backgroundColor: '#DAE3BE',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 3,
      }}
    >
      {/* Informações da empresa */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'start', mb: isMobile ? 2 : 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'gray' }}>
          <span style={{ color: '#98b344' }}>um</span>entreposto
        </Typography>
        <Typography sx={{ color: '#656565', marginTop: 1, textAlign: isMobile ? 'center' : 'left' }}>
          contato@umentreposto.com
        </Typography>
        <Typography sx={{ color: '#656565', marginTop: 1, textAlign: isMobile ? 'center' : 'left' }}>
          CNPJ: 46.640.604/0001-01
        </Typography>
        <Typography sx={{ color: '#656565', marginTop: 1, textAlign: isMobile ? 'center' : 'left' }}>
          Confere lá: @umentreposto
        </Typography>
      </Box>

      {/* Links do site */}
      <Box
       sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mb: isMobile ? 2 : 0,
        textAlign: 'center',
        color: '#656565',
      }}
      >
        <Link
          href="/"
          underline="none"
          sx={{ color: '#656565', '&:hover': { color: '#000' }, transition: 'color 0.3s', mt: 2 }}
        >
          Seja Nosso Parceiro
        </Link>
        <Link
          href="/"
          underline="none"
          sx={{ color: '#656565', '&:hover': { color: '#000' }, transition: 'color 0.3s', mt: 2 }}
        >
          Perguntas Frequentes
        </Link>
        <Link
          href="/"
          underline="none"
          sx={{ color: '#656565', '&:hover': { color: '#000' }, transition: 'color 0.3s', mt: 2 }}
        >
          Termos de uso e condições gerais
        </Link>
        <Link
          href="/"
          underline="none"
          sx={{ color: '#656565', '&:hover': { color: '#000' }, transition: 'color 0.3s', mt: 2 }}
        >
          Política de Privacidade
        </Link>
      </Box>

        {/* Imagem do logo com margin top */}
      <Box sx={{ display: 'flex', justifyContent: isMobile ? 'center' : 'flex-end', marginTop: 2 }}>
        <img
          src="public/images/InovaMack-2023-Logo-branco.png"
          alt="InovaMack"
          style={{
            borderRadius: '8px',
            backgroundColor: '#98b344',
            width: isMobile ? '60px' : '80px',
            height: 'auto',
          }}
        />
      </Box>
    </Box>
  )
}
