import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React, { useCallback, useEffect, useState } from "react"
import { useAuth } from '../../auth/AuthContext'
import toastr from 'toastr'
import axios from 'axios'
import { StatusPedidoDialog } from '../dialogs/StatusPedido.dialog'
import { ResumoPedidoDialog } from '../dialogs/ResumoPedido.dialog'


interface Solicitacoes {
  id: number               
  cep: string              
  totalPreco: number      
  items: Items[]    
  status: string           
}

interface Items {
  plantaId: string     
  quantidade: number     
  preco: number        
}

export default function ListaSolicitacoes({ handleCadastroPlantaClick }: { handleCadastroPlantaClick: () => void }) {
  const [elementoMenu, setelementoMenu] = useState<null | HTMLElement>(null) 
  const [openModalAlternar, setOpenModalAlternar] = useState(false)
  const [openModalResumo, setOpenModalResumo] = useState(false)
  const [solicitacoes, setSolicitacoes] = useState([] as Solicitacoes[]) 
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacoes>()
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
  
      const response = await axios.get(`${apiurl}/pedidos/getAllFornecedor/${user.id}`, {
        withCredentials: true,
      })
      

      setSolicitacoes(response.data.data)
    } catch{
      toastr.error('Erro ao carregar as solicitações.')
    } finally {
      setCarregando(false)
    }
  }, [apiurl, user?.id])
  


  useEffect(() => {
    loadSolicitacoes()
  }, [loadSolicitacoes])
  

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, solicitacao: Solicitacoes) => {
    setelementoMenu(event.currentTarget)
    setSolicitacaoSelecionada(solicitacao) 
  }

  const handleMenuClose = () => {
    setelementoMenu(null)
  }

  const handleStatus = (id: number) => {
    const updatedSolicitacoes = solicitacoes.map(solicitacoes => {
      if (solicitacoes.id === id) {
        return { ...solicitacoes, status: 'Cancelado' }
      }
      return solicitacoes
    })

    setSolicitacoes(updatedSolicitacoes)
  }

  const handleOptionClick = (option: string) => {
    if (option === 'Avaliar' && solicitacaoSelecionada) {
      setOpenModalResumo(true)
    }else if(option === 'Alternar' && solicitacaoSelecionada) {
      setOpenModalAlternar(true)
    }
    handleMenuClose() 
  }

  const handleCloseModal = () => {
    setOpenModalAlternar(false)
    setOpenModalResumo(false)
  }

  const Content = (
    <Box sx={{ padding: 3 }}>
    <Typography variant="h4" gutterBottom>
      Solicitações
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
                <TableCell>Pedido #{solicitacao.id}</TableCell>
                <TableCell>
                  {solicitacao.items.reduce((total, item) => total + item.quantidade, 0)}
                </TableCell>
                <TableCell>R$ {solicitacao.totalPreco.toFixed(2).replace('.', ',')}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        solicitacao.status === "Pagamento realizado"
                          ? "#98b344"
                          : solicitacao.status === "Cancelado"
                          ? "#e95a5a"
                          : "#656565",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      width: "100px",
                      height: "50px",
                      textAlign: "center",
                    }}
                  >
                    {solicitacao.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuClick(event, { ...solicitacao })}
                  >
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
      <MenuItem onClick={() => handleOptionClick('Avaliar')} disabled={solicitacaoSelecionada?.status == 'Cancelado' ? true : false}>Avaliar</MenuItem>
      <MenuItem onClick={() => handleOptionClick('Alternar')} disabled={solicitacaoSelecionada?.status == 'Cancelado' ? true : false}>Recusar</MenuItem>
    </Menu>

    {/* Modal para exibir a opção selecionada */}
    <StatusPedidoDialog
        open={openModalAlternar}
        onClose={handleCloseModal}
        id={solicitacaoSelecionada?.id ?? 0} 
        onStatusChange={handleStatus}
      />
      <ResumoPedidoDialog
        open={openModalResumo}
        onClose={handleCloseModal}
        idFornecedor={user?.id ?? 0} 
        idPedido={solicitacaoSelecionada?.id ?? 0}
      />
  </Box>
  )

  return carregando ? (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  ) : Content
}

