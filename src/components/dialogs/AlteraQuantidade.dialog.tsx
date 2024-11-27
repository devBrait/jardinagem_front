import { Dialog, DialogTitle, DialogContent, Box, Typography, TextField, DialogActions, Button } from "@mui/material"
import axios from "axios"
import { useState } from "react"
import toastr from "toastr"

interface AlteraQuantidadePlantaDialogProps {
  open: boolean
  onClose: () => void
  id: number
  onStatusChange: (id: number, novaQuantidade: number) => void
}

export default function AlteraQuantidadeDialog({open, onClose, id, onStatusChange} : AlteraQuantidadePlantaDialogProps) {

  const apiurl = import.meta.env.VITE_APP_API_URL
  const [novaQuantidade, setNovaQuantidade] = useState<number>(0)

  const handleQuantidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= 0) {
      setNovaQuantidade(value)
    }
  }

  const onConfirm = async () => {
    const url =`${apiurl}/plantas/quantidade` 

      try{
          const response = await axios.put(url, {id: id, quantidade: novaQuantidade}, {withCredentials: true})

          if (response.status === 200 || response.status === 204) {
              toastr.success('Quantidade da planta alterada com sucesso!')
              onStatusChange(id, novaQuantidade)
              onClose()
          }
      }catch{
          toastr.error('Ocorreu um erro ao tentar alterar a quantidade da planta.')
      }
  }

    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Alterar Quantidade Disponível</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography>
            Informe a nova quantidade disponível para a planta.
          </Typography>
          <TextField
            label="Nova Quantidade"
            type="number"
            value={novaQuantidade}
            onChange={handleQuantidadeChange}
            onKeyDown={(e) => {
              if (e.key === '-' || e.key === 'e') e.preventDefault()
            }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
