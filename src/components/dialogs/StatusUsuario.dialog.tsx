import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Stack } from '@mui/material'
import axios from 'axios'
import toastr from 'toastr'

interface StatusUsuarioDialogProps {
    open: boolean
    onClose: () => void
    email: string
    tipoUsuario: 'paisagista' | 'fornecedor'
    onStatusChange: (email: string) => void
}

export default function StatusUsuarioDialog({ open, onClose, email, tipoUsuario, onStatusChange } : StatusUsuarioDialogProps )  {

    const apiurl = import.meta.env.VITE_APP_API_URL

    const onConfirm = async () => {
        const url = tipoUsuario === 'paisagista' 
        ? `${apiurl}/clientes/alterna-estado` 
        : `${apiurl}/fornecedores/alterna-estado`

        try{
            const response = await axios.put(url, {email: email}, {withCredentials: true})

            if (response.status === 200 || response.status === 204) {
                toastr.success('Status do usuário alterado com sucesso!')
                onStatusChange(email)
                onClose()
            }
        }catch {
            toastr.error('Ocorreu um erro ao tentar mudar o status do usuário.')
        }
    }


    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmação</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Tem certeza que deseja fazer isso?
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
    );
}
