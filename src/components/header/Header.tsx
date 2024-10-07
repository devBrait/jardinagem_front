import { Box, Divider, Typography } from '@mui/material';

export default function Header() {
    return (
        <Box
            className="flex flex-col md:flex-row items-center justify-between p-4 md:mt-12"
            sx={{ textAlign: { xs: 'center', md: 'left' } }} // Ajuste de alinhamento para diferentes telas
        >
            {/* Box para Fornecedores */}
            <Box className="mb-8 md:mb-0 md:ml-32">
                <Typography variant="h5" component="h1" className="font-semibold text-cinza_claro">
                    Para Fornecedores...
                </Typography>
                <Typography component="h2" className="text-verde_claro mt-1 font-semibold">
                    Vender suas plantas é muito fácil.
                </Typography>
            </Box>

            {/* Divider vertical para telas grandes e horizontal para telas pequenas */}
            <Divider
                orientation="vertical"
                flexItem
                sx={{
                    display: { xs: 'none', md: 'block' },
                    height: '60px',
                    color: "#656565",
                    marginX: 5,
                }}
            />

            {/* Box para Paisagistas */}
            <Box className="mb-4 md:mb-0 md:mr-32">
                <Typography variant="h5" component="h1" className="font-semibold  text-cinza_claro">
                    Para Paisagistas...
                </Typography>
                <Typography component="h2" className="text-verde_claro mt-1 font-semibold">
                    Solicitar suas plantas é muito fácil.
                </Typography>
            </Box>
        </Box>
    );
}
