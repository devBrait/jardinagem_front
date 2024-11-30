import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../../auth/AuthContext'
import axios from 'axios'
import { StatusPedidoDialog } from '../dialogs/StatusPedido.dialog'
import { ItensPedidoDialog } from '../dialogs/ItensPedido.dialog'

export default function ListaPedidos({ handleNovoPedidoClick }: { handleNovoPedidoClick: () => void }) {
  
    interface Pedido {
      id: number
      quantidade: number
      nomeFornecedor: string
      status: string
    }

  const [elementoMenu, setelementoMenu] = useState<null | HTMLElement>(null) // Estado para o Menu
  const [openModalAlternar, setOpenModalAlternar] = useState(false)
  const [openModalVisualizar, setopenModalVisualizar] = useState(false)
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null) // Estado para o pedido selecionado
  const [pedidos, setPedidos] = useState([] as Pedido[]) // Estado para os pedidos
  const { user } = useAuth()
  const apiurl = import.meta.env.VITE_APP_API_URL
  const [carregando, setCarregando] = useState(false)

  const loadPedidos = useCallback(async () => {
    if (!user?.id) {
      toastr.error('Usuário não identificado.')
      return
    }
  
    try {
      setCarregando(true)
  
      const response = await axios.get(`${apiurl}/pedidos/getAllCliente/${user.id}`, {
        withCredentials: true,
      })
      
      setPedidos(response.data.data)
    } catch{
      toastr.error('Erro ao carregar as solicitações.')
    } finally {
      setCarregando(false)
    }
  }, [apiurl, user?.id])
  


  useEffect(() => {
    loadPedidos()
  }, [loadPedidos])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, pedido: Pedido) => {
    setelementoMenu(event.currentTarget) // Define o elemento do Menu
    setPedidoSelecionado(pedido) // Define o pedido selecionado
  }

  
  const handleStatus = (id: number) => {
    const updatedPedidos = pedidos.map(pedido => {
      if (pedido.id === id) {
        return { ...pedido, status: 'Cancelado' }
      }
      return pedido
    })

    setPedidos(updatedPedidos)
  }

  const handleMenuClose = () => {
    setelementoMenu(null)
  }

  const handleOptionClick = (option: string) => {
    if (option === 'Visualizar' && pedidoSelecionado) {
        setopenModalVisualizar(true)
    }else if(option === 'Cancelar' && pedidoSelecionado) {
      setOpenModalAlternar(true)
    }
    handleMenuClose() 
  }

  const handleCloseModal = () => {
    setOpenModalAlternar(false)
    setopenModalVisualizar(false)
  }

  const Content = (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Meus Pedidos
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <input
          type="text"
          placeholder="Pesquisar pedido..."
        
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
          onClick={handleNovoPedidoClick}
        >
          Novo pedido
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nº Pedido</TableCell>
              <TableCell>Nº Itens</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.length === 0 ? (
              <TableRow>
              <TableCell colSpan={8} align="center">
                Nenhum pedido realizado.
              </TableCell>
            </TableRow>
            ) : (pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>Pedido #{pedido.id}</TableCell>
                <TableCell>{pedido.quantidade}</TableCell>
                <TableCell>{pedido.nomeFornecedor}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: pedido.status === 'Pagamento realizado' ? '#98b344' : pedido.status === 'Cancelado' ? '#e95a5a' : '#656565',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      width: '100px',
                      height: '50px',
                      textAlign: 'center',
                    }}
                  >
                    {pedido.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, { ...pedido})}>
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
        <MenuItem onClick={() => handleOptionClick('Visualizar')} disabled={pedidoSelecionado?.status == 'Cancelado' ? true : false}>Visualizar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Cancelar')} disabled={pedidoSelecionado?.status == 'Cancelado' ? true : false}>Cancelar</MenuItem>
      </Menu>
      
      <StatusPedidoDialog
        open={openModalAlternar}
        onClose={handleCloseModal}
        id={pedidoSelecionado?.id ?? 0} 
        onStatusChange={handleStatus}
      />
      <ItensPedidoDialog
        open={openModalVisualizar}
        onClose={handleCloseModal}
        idPedido={pedidoSelecionado?.id ?? 0}
      />
    </Box>
  )

  return  carregando ? (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  ) : Content
}
