import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Dialog, DialogContent, DialogTitle, Menu, MenuItem } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'

export default function ListaPedidos({ handleNovoPedidoClick }: { handleNovoPedidoClick: () => void }) {
  
    interface Pedido {
      id: number
      name: string
      itens: number
      empresa: string
      status: string
      role: string
    }

  const [elementoMenu, setelementoMenu] = useState<null | HTMLElement>(null) // Estado para o Menu
  const [openModal, setOpenModal] = useState(false) // Estado para o Modal
  const [selectedOption, setSelectedOption] = useState('') // Estado para opção selecionada
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null) // Estado para o pedido selecionado


  const pedidos = [
    { id: 1, name: 'Pedido #123', itens: 12, empresa: 'Empresa X', status: 'Ativo', role: 'Designer' },
    { id: 2, name: 'Pedido #456', itens: 2, empresa: 'Empresa Y', status: 'Cancelado', role: 'Líder' },
    { id: 3, name: 'Pedido #789', itens: 7, empresa: 'Empresa Z', status: 'Preparando', role: 'Desenvolvedor' },
  ]

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, pedido: Pedido) => {
    setelementoMenu(event.currentTarget) // Define o elemento do Menu
    setPedidoSelecionado(pedido) // Define o pedido selecionado
  }

  const handleMenuClose = () => {
    setelementoMenu(null)
  }

  const handleOptionClick = (option: string) => {
    setSelectedOption(option)
    setOpenModal(true) // Abre o modal
    handleMenuClose() // Fecha o menu
  }

  const handleCloseModal = () => {
    setOpenModal(false) // Fecha o modal
  }

  return (
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
            {pedidos.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.name}</TableCell>
                <TableCell>{pedido.itens}</TableCell>
                <TableCell>{pedido.empresa}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: pedido.status === 'Ativo' ? '#98b344' : pedido.status === 'Cancelado' ? '#e95a5a' : '#656565',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      width: '100px',
                      height: '30px',
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu de opções */}
      <Menu anchorEl={elementoMenu} open={Boolean(elementoMenu)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOptionClick('Visualizar')}>Visualizar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Cancelar')} >Cancelar</MenuItem>
      </Menu>

      {/* Modal para exibir a opção selecionada */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle >{selectedOption} Pedido</DialogTitle>
        <DialogContent>
          <Typography >
            Ação: {selectedOption} para o pedido {pedidoSelecionado?.name}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
