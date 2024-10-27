import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const data = [
  {
    title: 'Direto com o produtor',
    items: [
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CheckCircleIcon color="success" /> },
      { text: '', icon: <CancelIcon color="error" /> },
    ],
    footer: 'Paisagistas e empresas de jardinagem',
  },
  {
    title: 'Um Entreposto',
    items: [
      { text: 'Comunicação simplificada.' },
      { text: 'Atendimento flexível e ágil' },
      { text: 'Entregas durante a semana' },
      { text: 'Variedade de plantas' },
      { text: 'Orçamento em 24 horas' },
    ],
    footer: 'Facilitando sua compra cada vez mais',
  },
  {
    title: 'Concorrentes',
    items: [
      { text: '', icon: <CheckCircleIcon color="success" /> },
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CancelIcon color="error" /> },
      { text: '', icon: <CheckCircleIcon color="success" /> },
    ],
    footer: 'Garden e fornecedores diversos.',
  },
];

export default function Vantagens() {
  return (
    <Box id="vantagens" sx={{ backgroundColor: '#ffffff', padding: '30px 0', marginBottom: '80px' }}>
        <Box textAlign="center" mb={5}>
            <Typography
            variant="h4"
            sx={{
                color: '#98b344',
                fontWeight: 'bold',
                marginBottom: 2,
                fontSize: { xs: '1.3rem', sm: '2rem' }, 
            }}
            >
            Você sabe das vantagens de pedir com a gente?
            </Typography>
            <Typography
            variant="subtitle1"
            color="#656565"
            sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' }, 
            }}
            >
            Entenda melhor a diferença de fazer seu pedido por conta, com a gente e com concorrentes:
            </Typography>
        </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {data.map((section, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              display: { xs: index === 1 ? 'block' : 'none', md: 'block' },
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#DAE3BE',
              width: '300px',
              margin: { xs: '10px 0', md: '0' },
              transform: index === 1 ? 'scale(1.05)' : 'scale(0.95)',
              transition: 'transform 0.3s ease',
            }}
          >
            <Typography variant="h6" sx={{ color: '#98b344', marginBottom: 2, fontWeight: 'bold' }}>
              {section.title}
            </Typography>
            <List>
              {section.items.map((item, i) => (
                <ListItem key={i} sx={{ justifyContent: 'center' }}>
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      marginRight: 0,
                      justifyContent: 'center',
                    }}
                  >
                    {'icon' in item ? item.icon : null}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ textAlign: 'center', display: item.text ? 'block' : 'none', color: '#656565'}} />
                </ListItem>
              ))}
            </List>
            <Box mt={2} sx={{ color: '#98b344', fontSize: '14px', fontWeight: 'bold' }}>
              {section.footer}
            </Box>
          </Paper>
        ))}
      </Box>

      <Box textAlign="center" mt={5}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#656565' }}>
          Simples, Único e Seguro.
        </Typography>
      </Box>
    </Box>
  );
}
