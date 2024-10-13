import { Box, Container, Typography } from "@mui/material";

export default function CorpoCentral() {
    return (
        <Container
            maxWidth={false}
            disableGutters
            className="flex items-center justify-between py-10 px-5 bg-radial-custom 
            mx-auto rounded-md mt-5 border-none" 
        >
            {/* Caixa de texto com descrição */}
            <Box className="flex-1 md:mr-50 md:ml-36 text-center md:text-left">
                <Typography variant="h6" component="h2" className="text-cinza_claro mb-5 font-normal">
                    Árvores, arbustos, forrações, substratos, adubos e muito mais, prontos para solicitação e entrega onde desejar.
                </Typography>
                <Typography variant="body1" className="text-cinza_claro">
                    Comodidade e transparência desde o seu primeiro passo.
                </Typography>
            </Box>

             {/* Imagem do caminhão - será ocultada em telas pequenas */}
             <Box className="flex-1 hidden md:block"> {/* Adicionado 'hidden md:block' */}
                <img
                    src="/images/caminhão_v2.png"
                    alt="Caminhão com plantas"
                    className="max-w-[500px] w-full h-auto object-contain"
                />
            </Box>
        </Container>
    );
}
