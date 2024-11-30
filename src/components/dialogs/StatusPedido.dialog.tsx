import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Stack, Button } from "@mui/material"
import axios from "axios"
import toastr from "toastr"

interface StatusPedidoDialogProps {
    open: boolean
    onClose: () => void
    id: number
    onStatusChange: (id: number) => void
}


export const StatusPedidoDialog = ({ open, onClose, id, onStatusChange }: StatusPedidoDialogProps) => {

    const apiurl = import.meta.env.VITE_APP_API_URL

    const onConfirm = async () => {
        const url =`${apiurl}/pedidos/alterna-estado` 

        try{
            const response = await axios.put(url, {id: id}, {withCredentials: true})

            if (response.status === 200 || response.status === 204) {
                toastr.success('Status do pedido alterado com sucesso!')
                onStatusChange(id)
                onClose()
            }
        }catch{
            toastr.error('Ocorreu um erro ao tentar mudar o status do pedido.')
        }
    }


    return(
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza que você deseja fazer isso?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Stack direction="column" spacing={2} width="100%">
                    <Button onClick={onConfirm} color="primary" variant="contained" fullWidth>
                        Sim
                    </Button>
                    <Button onClick={onClose} className='bg-red-400 hover:bg-red-500' fullWidth>
                        Não
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    )
}