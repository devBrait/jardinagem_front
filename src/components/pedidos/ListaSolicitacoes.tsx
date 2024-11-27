import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogContent, DialogTitle, Menu, MenuItem, CircularProgress } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { useCallback, useEffect, useState } from "react"
import { useAuth } from '../../auth/AuthContext'
import toastr from 'toastr'
import axios from 'axios'

export default function ListaSolicitacoes({ handleCadastroPlantaClick }: { handleCadastroPlantaClick: () => void }) {
  
    interface Solicitacoes {
      id: number
      nome: string
      nome_cientifico: string
      quantidade: number
      nome_popular: string
      floracao: string
      cor_folhagem: string
      porte: string
      preco: number
      status: string
    }

  const [elementoMenu, setelementoMenu] = useState<null | HTMLElement>(null) // Estado para o Menu
  const [openModal, setOpenModal] = useState(false) // Estado para o Modal
  const [selectedOption, setSelectedOption] = useState('') // Estado para opção selecionada
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacoes | null>(null) // Estado para o pedido selecionado
  const [solicitacoes, setSolicitacoes] = useState<Solicitacoes[]>([]) // Estado para as solicitações
  const [carregando, setCarregando] = useState(false)
  const { user } = useAuth()
  const apiurl = import.meta.env.VITE_APP_API_URL

  const loadSolicitacoes = useCallback(async () => {
    if (!user?.id) {
      toastr.error('Usuário não identificado.')
      return
    }
  
    try {
      setCarregando(true)
  
      const response = await axios.get(`${apiurl}/pedidos/getAll/${user.id}`, {
        withCredentials: true,
      })
      
      const solicitacoesData = Array.isArray(response.data.data)
      ? response.data.data
      : []

      setSolicitacoes(solicitacoesData)


    } catch{
      toastr.error('Erro ao carregar as solicitações.')
      setSolicitacoes([])
    } finally {
      setCarregando(false)
    }
  }, [apiurl, user?.id])
  


  useEffect(() => {
    loadSolicitacoes()
  }, [loadSolicitacoes])
  

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

  const Content = (
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
          {solicitacoes.length === 0 ? (
               <TableRow>
               <TableCell colSpan={8} align="center">
                 Nenhuma soliticição de pedido realizada.
               </TableCell>
             </TableRow>
            ) : (solicitacoes.map((solicitacao) => (
            <TableRow key={solicitacao.id}>
              <TableCell>{solicitacao.nome}</TableCell>
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
          )))}
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
          Ação: {selectedOption} para a solicitação {solicitacaoSelecionada?.nome}.
        </Typography>
      </DialogContent>
    </Dialog>
  </Box>
  )

  return carregando ? (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  ) : Content
}

