import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormLabel, IconButton, TextField } from "@mui/material"
import axios from 'axios'
import { useState } from "react"
import toastr from 'toastr'

interface RedefineSenhaProps {
    open: boolean
    handleClose: () => void
    codigo: number
    tipoUsuario: string
    email: string
}


export default function RedefineSenha({open, handleClose, codigo, tipoUsuario, email}: RedefineSenhaProps){

    const [senha, setSenha] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [codigoError, setCodigoError] = useState(false)
    const [codigoInput, setCodigoInput] = useState(0)
    const [showPassword, setShowPassword] = useState(false)
    const apiurl = import.meta.env.VITE_APP_API_URL

    const validateInputs = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        if(codigo == 0 || !senha){
            setPasswordError(true)
            setCodigoError(true)
            toastr.error('Por favor, preencha todos os campos.')
            return
        }

        if(Number(codigoInput) != codigo)
        {
            setCodigoError(true)
            toastr.error('Código informado inválido.')
            return
        }

        // Validação da senha
        if (senha.length < 6) {
          setPasswordError(true)
          toastr.error('A senha deve conter pelo menos 6 caracteres.')
          return
        }

        setPasswordError(false)
        setCodigoError(false)
        const url = tipoUsuario === 'paisagista' 
        ? `${apiurl}/clientes/redefinir-senha` 
        : `${apiurl}/paisagistas/redefinir-senha`

        await onSubmit(senha, url, email)
      }

      const onSubmit = async (senha: string, url: string, email: string) => {
        try {
          const response = await axios.put(url, { email, senha })
      
          if (response.status === 200) {
            toastr.success('Senha redefinida com sucesso!')
            setCodigoInput(0)
            setSenha('')
            handleClose()
          } else {
            toastr.error('Erro: ocorreu um erro ao redefinir a senha.')
          }
        } catch{
          toastr.error('Erro: ocorreu um erro ao redefinir a senha.')
        }
      }

    return (
        <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: validateInputs,
        }}
      >
        <DialogTitle>Confirmar Senha</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Por favor, insira o código de verificação e sua nova senha para continuar.
          </DialogContentText>
      
          <FormControl fullWidth>
            <FormLabel htmlFor="codigo">Código de Verificação</FormLabel>
            <TextField
              error={codigoError}
              id="codigoInput"
              name="codigoInput"
              placeholder="Digite o código"
              variant="outlined"
              color={codigoError ? 'error' : 'primary'}
              value={codigoInput}
              onChange={(e) => setCodigoInput(Number(e.target.value))}
            />
          </FormControl>
      
          <FormControl fullWidth>
            <FormLabel htmlFor="senha">Senha</FormLabel>
            <TextField
              error={passwordError}
              id="senha"
              name="senha"
              placeholder="Digite sua nova senha"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton
                    aria-label="alternar visibilidade da senha"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" type="submit">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    )
}