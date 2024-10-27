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
import { Visibility, VisibilityOff } from '@mui/icons-material'
import IconButton from '@mui/material/IconButton'
import toastr from './../../toastrConfig'
import axios from 'axios'

interface ForgotPasswordProps {
  open: boolean
  handleClose: () => void
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [userType, setUserType] = useState('paisagista')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
  
    // Validação da senha
    if (!senha || senha.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('A senha deve conter pelo menos 6 caracteres.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }
  
    if (isValid) {
      const url = userType === 'paisagista' 
        ? `${apiurl}/clientes/redefinir-senha` 
        : `${apiurl}/paisagistas/redefinir-senha`
  
      const success = await redefineSenha(url, email, senha)
  
      if (success) {
        toastr.success('Senha redefinida com sucesso!')
        handleClose()
      } else {
        toastr.error('Erro ao redefinir senha!')
      }
    }
  }
  

  const redefineSenha = async (url: string, email: string, senha: string) => {
    try {
      const response = await axios.put(url, { email, senha }, { headers: { 'Content-Type': 'application/json' } })
  
      if (response.status !== 200 && response.status !== 204) {
        toastr.error("Erro:", response.data.message)
        return false
      }

      return true
    } catch (error) {
      console.error("Erro na requisição:", error)
      return false;
    }
  }

  return (
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
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Por favor, insira seu endereço de e-mail e sua nova senha para que ela seja redefinida.
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
        <FormControl fullWidth>
          <FormLabel htmlFor="senha">Nova Senha</FormLabel>
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
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          {passwordError && <p style={{ color: 'red' }}>{passwordErrorMessage}</p>}
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" type="submit">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  )
}
