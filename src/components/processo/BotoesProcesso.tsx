import { Box, Typography, Divider, Stack } from '@mui/material';

export default function BotoesProcesso() {
    return (
        <Box className="flex flex-col mx-auto mt-24 mb-20 items-center">
            <Stack 
                direction={{ xs: "column", md: "row" }}
                spacing={4} 
                justifyContent="center" 
                alignItems="center"
            >
                {/* Esquerda */} 
                <Box className="flex flex-col items-center">
                    {/* Ícones com Textos */} 
                    <Box className="flex flex-col md:flex-row md:justify-between items-center">
                        {/* 1º Cadastro */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">1º Cadastro</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_lista.png" alt="icone de lista" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Cadastre as <strong className='text-verde_claro'>plantas</strong> de seu estoque.
                            </Typography>
                        </Box>

                        <Divider 
                            orientation="horizontal" 
                            flexItem 
                            sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }}
                        />

                        {/* 2º Avaliação */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">2º Avaliação</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_produtor.png" alt="icone de produtor" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Aprove, avalie ou recuse <strong className='text-verde_claro'>pedidos de clientes</strong>.
                            </Typography>
                        </Box>

                        <Divider 
                            orientation="horizontal" 
                            flexItem 
                            sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }}
                        />

                        {/* 3º Envio */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">3º Envio</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_transporte.png" alt="icone de transporte" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Selecione o <strong className='text-verde_claro'>transporte mais adequado</strong> e envie o pedido.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Divisor Vertical */}
                <Divider orientation="vertical" flexItem   
                sx={{
                    display: { xs: 'none', md: 'block' },
                    color: "#656565",
                    marginX: 5,
                }}/>

                <Divider orientation="horizontal" flexItem  
                sx={{
                    display: { xs: 'block', md: 'none' },
                    color: "#656565",
                    width: "100%",
                    marginX: 5,
                }}/>

                {/* Direita */}
                <Box className="flex flex-col items-center">
                    {/* Ícones com Textos */} 
                    <Box className="flex flex-col md:flex-row md:justify-between items-center">
                        {/* 1º Pedido */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">1º Pedido</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_lista.png" alt="icone de lista" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Você envia quais <strong className='text-verde_claro'>plantas e insumos</strong> precisa.
                            </Typography>
                        </Box>

                        <Divider 
                            orientation="horizontal" 
                            flexItem 
                            sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }}
                        />

                        {/* 2º Aprovação */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">2º Aprovação</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_produtor.png" alt="icone de produtor" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Nós escolhemos o melhor <strong className='text-verde_claro'>custo-benefício</strong>.
                            </Typography>
                        </Box>

                        <Divider 
                            orientation="horizontal" 
                            flexItem 
                            sx={{ display: { xs: 'none', md: 'block' }, mx: 2 }}
                        />

                        {/* 3º Entrega */}
                        <Box className="flex flex-col items-center mb-5">
                            <Typography variant="h6" className="text-center mb-3 text-cinza_claro">3º Entrega</Typography>
                            <Box className="h-24 w-24 rounded-full bg-[#DAE3BE] flex items-center justify-center">
                                <img src="/images/icon_transporte.png" alt="icone de transporte" className="h-16 w-16 object-contain" />
                            </Box>
                            <Typography variant="body1" className="text-center text-cinza_claro mt-2 text-sm">
                                Selecionamos o <strong className='text-verde_claro'>transporte mais adequado</strong> e efetuamos a entrega.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
}
