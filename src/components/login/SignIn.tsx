import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import CssBaseline from '@mui/material/CssBaseline'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import HomeIcon from '@mui/icons-material/Home'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import ForgotPassword from './ForgotPassword'
import { GoogleIcon, UmEntreposto } from './CustomIcons'
import AppTheme from '../../css/theme/AppTheme'
import toastr from './../../toastrConfig'
import { FormEvent, useState } from 'react'
import { InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../AuthContext'
import axios from 'axios'


const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: '10vh',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function  SignIn(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const apiurl = import.meta.env.VITE_APP_API_URL
  const admin = import.meta.env.VITE_USER_ADMIN
  const password_admin = import.meta.env.VITE_USER_ADMIN_PASSWORD
  

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleNaoTemConta = () => {
    navigate('/cadastro')
  }

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const verificaConta = async (url: string, email: string, senha: string) => {
    try {
      const response = await axios.post(url, { email, senha }, { withCredentials: true });
  
      if (response.status !== 200){
        return false
      }

     return response.data
    } catch{
      return false
    }
  }
  
  const validateInputs = async () => {
    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
  
    let isValid = true
  
    // Validação de e-mail
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true)
      setEmailErrorMessage('Por favor insira um e-mail válido.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }
  
    // Validação de senha
    if (!password || password.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('A senha deve conter 6 caracteres.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }
  
    // Se os inputs forem válidos, verificar conta
    if (isValid) {
      let data = null

      if(email === admin && password === password_admin){
        const data = await verificaConta(`${apiurl}/admin/login`, email, password)
        if (data) {
          toastr.success('Administrador logado com sucesso!')
          const userData = { email: email, tipoUsuario: 'admin' }
          login(userData)
          navigate('/dashboard-admin')
          return
        }
      }
      
      data = await verificaConta(`${apiurl}/clientes/login`, email, password)
      if (data) {
        toastr.success('Usuário logado com sucesso!')
        const userData = { email: email, tipoUsuario: 'cliente' } 
        login(userData)
        navigate('/dashboard-cliente')
        return
      }else{
       data = await verificaConta(`${apiurl}/fornecedores/login`, email, password)
       if (data) {
         toastr.success('Usuário logado com sucesso!')
         const userData = { email: email, tipoUsuario: 'fornecedor' } 
         login(userData)
         navigate('/dashboard-fornecedor')
         return
       }
      }

      // Se nenhuma conta foi encontrada, definir a mensagem de erro
      setEmailError(true)
      setPasswordError(true)
      toastr.error('Erro: email/senha incorretos!')
    }
  
    return isValid
  }
  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
      <Card variant="outlined">
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={() => navigate('/')} // Navegação para a página inicial
            >
              <HomeIcon />
            </IconButton>
            <UmEntreposto />
          </Stack>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(1rem, 10vw, 2.15rem)' }}
          >
            Bem-vindo
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? 'error' : 'primary'}
                sx={{ ariaLabel: 'email' }}
              />
            </FormControl>
            <FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <FormLabel htmlFor="password">Senha</FormLabel>
              <Link
                underline='none'
                component="button"
                onClick={(event) => {
                  event.preventDefault()
                  handleClickOpen()
                }}
                variant="body2"
                sx={{ alignSelf: 'baseline' }}
              >
                Esqueceu sua senha?
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type={showPassword ? 'text' : 'password'} // Altera o tipo dependendo do estado
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Lembrar conta"
            />
            <ForgotPassword open={open} handleClose={handleClose} />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Acessar
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Não tem uma conta?{' '}
              <span>
                <Link
                  underline='none'
                  href="/cadastro"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                  onClick={handleNaoTemConta}
                >
                  Registre-se
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>ou</Divider>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              onClick={() => alert('Log in com Google')}
              startIcon={<GoogleIcon />}
            >
              Log-in com Google
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}
