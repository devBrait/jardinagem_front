import { useState, useEffect } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import axios from 'axios'
import toastr from 'toastr'

interface ResumoPedidoDialogProps {
  open: boolean
  onClose: () => void
  idFornecedor: number
  idPedido: number
}

interface ItemPedido {
    id: number;
    nome: string;
    quantidade: number;
}

export const ResumoPedidoDialog = ({ open, onClose, idFornecedor, idPedido }: ResumoPedidoDialogProps) => {
  
    const [items, setItems] = useState([] as ItemPedido[])
    const apiurl = import.meta.env.VITE_APP_API_URL


    useEffect(() => {
        if(open === false) { return }
        const loadItems = async () => {
        const url = `${apiurl}/pedidos/getAllNomesPlantas/${idFornecedor}/${idPedido}`
            
        try {
            const response = await axios.get(url, { withCredentials: true })
            setItems(response.data.data)
        } catch {
            toastr.error('Ocorreu um erro ao ler os itens do pedido.')
        }
        }
        if (idFornecedor && idPedido) {
        loadItems()
        }
    }, [open, idFornecedor, idPedido, apiurl])

  return (
    <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="xs" 
        fullWidth
        >
        <DialogTitle 
            sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            }}
        >
            Detalhes do Pedido
        </DialogTitle>
        
        <DialogContent dividers>
            <TableContainer>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: '70%' }}>Nome</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: '30%', textAlign: 'right' }}>Quantidade</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {items.map((item) => (
                    <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell align="right">{item.quantidade}</TableCell>
                    </TableRow>
                ))}
                {items.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ color: 'text.secondary' }}>
                        Nenhum item encontrado
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </TableContainer>
        </DialogContent>
        
        <DialogActions>
            <Button 
            onClick={onClose} 
            className='bg-vermelho hover:bg-red-400'
            fullWidth
            >
            Fechar
            </Button>
        </DialogActions>
        </Dialog>
  )
}
