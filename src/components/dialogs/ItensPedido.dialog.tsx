import { Dialog, DialogTitle, DialogContent, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, DialogActions, Button } from "@mui/material"
import axios from "axios"
import { useState, useEffect } from "react"
import toastr from "toastr"

interface ItensPedidoDialogProps {
    open: boolean
    onClose: () => void
    idPedido: number
}

interface ItemPedido {
    id: number
    nome: string
    preco: number
    quantidade: number
    valorItem: number
}



export const ItensPedidoDialog = ({ open, onClose, idPedido }: ItensPedidoDialogProps) => {

    const [items, setItems] = useState([] as ItemPedido[])
    const apiurl = import.meta.env.VITE_APP_API_URL


    useEffect(() => {
        if(open === false) { return }
        const loadItems = async () => {
        const url = `${apiurl}/pedidos/getById/${idPedido}`
            
        try {
            const response = await axios.get(url, { withCredentials: true })

            setItems(response.data.data.itens)
        } catch {
            toastr.error('Ocorreu um erro ao ler os itens do pedido.')
        }
        }
        if (idPedido) {
        loadItems()
        }
    }, [open, idPedido, apiurl])

    const totalPedido = items.reduce((total, item) => total + (item.valorItem || 0), 0)

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
                                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Nome</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '20%', textAlign: 'right' }}>Quantidade</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '25%', textAlign: 'right' }}>Preço Unit.</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', width: '25%', textAlign: 'right' }}>Total Item</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.nome}</TableCell>
                                    <TableCell align="right">{item.quantidade}</TableCell>
                                    <TableCell align="right">R$ {item.preco.toFixed(2).replace('.', ',')}</TableCell>
                                    <TableCell align="right">R$ {item.valorItem.toFixed(2).replace('.', ',')}</TableCell>
                                </TableRow>
                            ))}
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary' }}>
                                        Nenhum item encontrado
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.length > 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'right' }}>
                                        Total do Pedido:
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        R$ {totalPedido.toFixed(2).replace('.', ',')}
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