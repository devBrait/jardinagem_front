import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'

export default function ListaSolicitacoes({ handleCadastroPlantaClick }: { handleCadastroPlantaClick: () => void }) {
  
    interface Solicitacoes {
      id: number
      name: string
      nome_cientifico: string
      quantidade: number
      nome_popular: string
      floracao: string
      cor_folhagem: string
      porte: string
      preco: string
      status: string
    }

  const [elementoMenu, setelementoMenu] = useState<null | HTMLElement>(null) // Estado para o Menu
  const [openModal, setOpenModal] = useState(false) // Estado para o Modal
  const [selectedOption, setSelectedOption] = useState('') // Estado para opção selecionada
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacoes | null>(null) // Estado para o pedido selecionado


  const solicitacoes: Solicitacoes[] = [
    {
      id: 1,
      name: 'Solicitação #123',
      nome_cientifico: 'Nome Científico 1', 
      quantidade: 12,
      nome_popular: 'Nome Popular 1', 
      floracao: 'Sim',
      cor_folhagem: 'Verde', 
      porte: 'Pequeno',
      preco: 'R$ 10,00',
      status: 'Aprovado',
    },
    {
      id: 2,
      name: 'Solicitação #456',
      nome_cientifico: 'Nome Científico 2', 
      quantidade: 2,
      nome_popular: 'Nome Popular 2',
      floracao: 'Não', 
      cor_folhagem: 'Amarelo', 
      porte: 'Médio', 
      preco: 'R$ 20,00', 
      status: 'Recusado',
    },
    {
      id: 3,
      name: 'Solicitação #789',
      nome_cientifico: 'Nome Científico 3', 
      quantidade: 7,
      nome_popular: 'Nome Popular 3', 
      floracao: 'Sim', 
      cor_folhagem: 'Vermelho', 
      porte: 'Grande', 
      preco: 'R$ 30,00', 
      status: 'Preparando',
    },
  ];
  

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, solicitacao: Solicitacoes) => {
    setelementoMenu(event.currentTarget) // Define o elemento do Menu
    setSolicitacaoSelecionada(solicitacao) // Define o pedido selecionado
  }

  const handleMenuClose = () => {
    setelementoMenu(null)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setOpenModal(true) 
    handleMenuClose() 
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Meus Pedidos
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <input
          type="text"
          placeholder="Pesquisar solicitação..."
        
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginTop: '15px',
          }}
        />
        <Button
          sx={{
            marginLeft: 2,
            backgroundColor: '#98b344',
            color: '#fff',
            marginTop: '14px',
            textTransform: 'none',
          }}
          onClick={handleCadastroPlantaClick}
        >
          Cadastrar nova planta
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nº Pedido</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Nome científico</TableCell>
              <TableCell>Nome popular</TableCell>
              <TableCell>Floração</TableCell>
              <TableCell>Cor da folhagem</TableCell>
              <TableCell>Porte</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {solicitacoes.map((solicitacao) => (
              <TableRow key={solicitacao.id}>
                <TableCell>{solicitacao.name}</TableCell>
                <TableCell>{solicitacao.quantidade}</TableCell>
                <TableCell>{solicitacao.nome_cientifico}</TableCell>
                <TableCell>{solicitacao.nome_popular}</TableCell>
                <TableCell>{solicitacao.floracao}</TableCell>
                <TableCell>{solicitacao.cor_folhagem}</TableCell>
                <TableCell>{solicitacao.porte}</TableCell>
                <TableCell>{solicitacao.preco}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: solicitacao.status === 'Aprovado' ? '#98b344' : solicitacao.status === 'Recusado' ? '#e95a5a' : '#656565',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      width: '100px',
                      height: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {solicitacao.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, { ...solicitacao})}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu de opções */}
      <Menu anchorEl={elementoMenu} open={Boolean(elementoMenu)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOptionClick('Aprovar')}>Aprovar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Avaliar')}>Avaliar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Recusar')} >Recusar</MenuItem>
      </Menu>

      {/* Modal para exibir a opção selecionada */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle >{selectedOption} Solicitação</DialogTitle>
        <DialogContent>
          <Typography >
            Ação: {selectedOption} para a solicitação {solicitacaoSelecionada?.name}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
