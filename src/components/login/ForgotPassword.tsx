import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useState } from 'react'
import toastr from './../../toastrConfig'
import axios from 'axios'
import RedefineSenha from './RedefineSenha'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [userType, setUserType] = useState('paisagista')
  const [codigo, setCodigo] = useState(0) 
  const [openRedefinir, setOpenRedefinir] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const apiurl = import.meta.env.VITE_APP_API_URL

  const handleForgotPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  
    let isValid = true
  
    // Validação do email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      setEmailErrorMessage('Por favor insira um e-mail válido.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }
  
    if (isValid) {
      const url = `${apiurl}/codigo/envia-codigo` 
  
      await EnviaCodigoAsync(url, email)
    }
  }
  

  const EnviaCodigoAsync = async (url: string, email: string) => {
    try {

      const response = await axios.post(url, { email: email }, { headers: { 'Content-Type': 'application/json' } })
  
      if (response.status !== 200 && response.status !== 201) {
        toastr.error("Erro: impossível enviar código.")
        return false
      }

      setCodigo(response.data.codigo)
      setOpenRedefinir(true)
      handleClose()
      toastr.success('Código enviado para seu email!')
      return true
    } catch (error) {
      console.error("Erro na requisição:", error)
      return false;
    }
  }

  return (
    <>
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleForgotPasswordSubmit,
      }}
    >
      <DialogTitle>Resetar Senha</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}
      >
        <DialogContentText>
          Por favor, insira seu endereço de e-mail para redefinir sua senha.
        </DialogContentText>

        <RadioGroup
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          row
        >
          <FormControlLabel value="paisagista" control={<Radio />} label="Paisagista" />
          <FormControlLabel value="fornecedor" control={<Radio />} label="Fornecedor" />
        </RadioGroup>
        <FormControl fullWidth>
          <FormLabel htmlFor="email">E-mail</FormLabel>
          <TextField
            id="email"
            type="email"
            name="email"
            placeholder="seu@email.com"
            autoComplete="email"
            autoFocus
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
            error={emailError}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p style={{ color: 'red' }}>{emailErrorMessage}</p>}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" type="submit">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
    <RedefineSenha open={openRedefinir} handleClose={() => setOpenRedefinir(false)} codigo={codigo} tipoUsuario={userType} email={email} />
    </>
  )
}
