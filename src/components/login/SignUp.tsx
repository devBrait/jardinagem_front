import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
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
import { GoogleIcon, UmEntreposto } from './CustomIcons'
import AppTheme from './theme/AppTheme'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import toastr from './../../toastrConfig'




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
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
  const [userType, setUserType] = React.useState('paisagista') // Estado para paisagista ou fornecedor

  const handleUserTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserType((event.target as HTMLInputElement).value)
  }
  

  const handleNaoTemConta = () => {
    window.location.href = '/cadastro'
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const verificaConta = async (url: string, email: string, senha: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })
  
      if (!response.ok) {
        return false
      }
  
      const data = await response.json()
      return data.success
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
      const isCliente = await verificaConta('http://localhost:8080/v1/clientes/login', email, password)
      if (isCliente) {
        window.location.href = '/dashboard-cliente'
        return
      }
  
      const isFornecedor = await verificaConta('http://localhost:8080/v1/fornecedores/login', email, password)
      if (isFornecedor) {
        window.location.href = '/dashboard-fornecedor'
        return
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
              onClick={() => window.location.href = '/'} // Navegação para a página inicial
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
              <FormLabel>Você é um:</FormLabel>
              <RadioGroup row value={userType} onChange={handleUserTypeChange}>
                <FormControlLabel
                  value="paisagista"
                  control={<Radio />}
                  label="Paisagista"
                />
                <FormControlLabel
                  value="fornecedor"
                  control={<Radio />}
                  label="Fornecedor"
                />
              </RadioGroup>
            </FormControl>
            
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
              </Box>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
             {/* Campos adicionais para Paisagista */}
        {userType === 'paisagista' && (
          <>
            <FormControl>
              <FormLabel>CNPJ</FormLabel>
              <TextField
                id="cnpj-paisagista"
                placeholder="Digite o CNPJ"
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <TextField
                id="nome-paisagista"
                placeholder="Digite seu nome"
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <TextField
                id="celular-paisagista"
                placeholder="Digite seu número de celular"
                fullWidth
              />
            </FormControl>
          </>
        )}

        {/* Campos adicionais para Fornecedor */}
{userType === 'fornecedor' && (
  <>
    <FormControl>
      <FormLabel>CNPJ</FormLabel>
      <TextField
        id="cnpj-fornecedor"
        placeholder="Digite o CNPJ"
        fullWidth
      />
    </FormControl>
    <FormControl>
      <FormLabel>Nome</FormLabel>
      <TextField
        id="nome-fornecedor"
        placeholder="Digite seu nome"
        fullWidth
      />
    </FormControl>
    <FormControl>
      <FormLabel>Celular</FormLabel>
      <TextField
        id="celular-fornecedor"
        placeholder="Digite seu número de celular"
        fullWidth
      />
    </FormControl>
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      <FormControl sx={{ flexGrow: 1 }}>
        <FormLabel>Estado</FormLabel>
        <TextField
          id="estado-fornecedor"
          placeholder="Digite o estado"
          fullWidth
        />
      </FormControl>
      <FormControl sx={{ flexGrow: 1 }}>
        <FormLabel>Cidade</FormLabel>
        <TextField
          id="cidade-fornecedor"
          placeholder="Digite a cidade"
          fullWidth
        />
      </FormControl>
    </Stack>
    <FormControl>
      <FormLabel>Endereço</FormLabel>
      <TextField
        id="endereco-fornecedor"
        placeholder="Digite o endereço"
        fullWidth
      />
    </FormControl>
  </>
)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Cadastrar-se
            </Button>
            <Typography sx={{ textAlign: 'center' }}>
              Já tem uma conta?{' '}
              <span>
                <Link
                  underline='none'
                  href="/login"
                  variant="body2"
                  sx={{ alignSelf: 'center' }}
                  onClick={handleNaoTemConta}
                >
                  Acesse
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
              Cadastro com Google
            </Button>
          </Box>
        </Card>
      </SignInContainer>
    </AppTheme>
  )
}
