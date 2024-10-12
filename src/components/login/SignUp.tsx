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
import AppTheme from '../../css/theme/AppTheme'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { ChangeEvent, FormEvent, useState } from 'react'
import toastr from '../../toastrConfig'
import { InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: '0.5vh',
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

export default function  SignUp(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [cpfError, setcpfError] = useState(false)
  const [cpfErrorMessage, setcpfErrorMessage] = useState('')
  const [cnpjError, setcnpjError] = useState(false)
  const [cnpjErrorMessage, setcnpjErrorMessage] = useState('')
  const [nomeError, setnomeError] = useState(false)
  const [nomeErrorMessage, setnomeErrorMessage] = useState('')
  const [cepError, setcepError] = useState(false)
  const [cepErrorMessage, setcepErrorMessage] = useState('')
  const [empresaError, setempresaError] = useState(false)
  const [empresaErrorMessage, setempresaErrorMessage] = useState('')
  const [celularError, setcelularError] = useState(false)
  const [celularErrorMessage, setcelularErrorMessage] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')
  const [userType, setUserType] = useState('paisagista') 
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()


  interface Paisagista {
    email: string;
    senha: string;
    nome: string;
    telefone: number;
    CPF: number;
  }

  interface Fornecedor {
    email: string;
    senha: string;
    nome: string;
    telefone: number;
    CNPJ: number;
    CEP: string;
    empresa: string;
  }

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }


  const handleUserTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUserType((event.target as HTMLInputElement).value)
  }
  

  const handleNaoTemConta = () => {
    navigate('/cadastro')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    validateInputs()
  }

  const cadastraConta = async (url: string, dadosUsuario: Paisagista | Fornecedor) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosUsuario),
      })
  
      if (!response.ok) {
        return false
      }
  
      await response.json()
      return true
    } catch{
      return false
    }
  }
  
  const validateInputs = async () => {
    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value
    let CPF = ''
    let CNPJ = ''
    let CEP = ''
    let EMPRESA = ''

    const nome = (document.getElementById(`nome-${userType}`) as HTMLInputElement).value
    const celular = (document.getElementById(`celular-${userType}`) as HTMLInputElement).value

    if(userType === 'paisagista') {
        CPF = (document.getElementById(`cpf-${userType}`) as HTMLInputElement).value
    }else{
        CNPJ = (document.getElementById(`cnpj-${userType}`) as HTMLInputElement).value
        CEP = (document.getElementById(`cep`) as HTMLInputElement).value
        EMPRESA = (document.getElementById(`empresa`) as HTMLInputElement).value
    }
  
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

    if(!nome || nome.length < 3) {
      setnomeError(true)
      setnomeErrorMessage('Por favor, insira um nome válido.')
      isValid = false
    }else{
      setnomeError(false)
      setnomeErrorMessage('')
    }

    if(!celular || !/^[1-9]{2}9[0-9]{8}$/.test(celular)) {
      setcelularError(true)
      setcelularErrorMessage('Por favor, insira um celular válido.')
      isValid = false
    }else{
      setcelularError(false)
      setcelularErrorMessage('')
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

    if(userType === 'paisagista') {
      if (!CPF || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(CPF)) {
        setcpfError(true)
        setcpfErrorMessage('Por favor, insira um cpf válido (formato: XXX.XXX.XXX-XX).')
        isValid = false
      }else{
        setcpfError(false)
        setcpfErrorMessage('')
      }
    }else{
      if (!CNPJ || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(CNPJ)) {
        setcnpjError(true)
        setcnpjErrorMessage('Por favor, insira um cnpj válido (formato: XX.XXX.XXX/XXXX-XX).')
        isValid = false
      } else {
        setcnpjError(false)
        setcnpjErrorMessage('')
      }

      if(!CEP || !/^\d{5}-\d{3}$/.test(CEP)){
       setcepError(true)
       setcepErrorMessage('Por favor, insira um CEP válido (formato: XXXXX-XXX).')
       isValid = false
      } else {
          setcepError(false)  
          setcepErrorMessage('')
      }

      if(!EMPRESA){
        setempresaError(true)
        setempresaErrorMessage('Por favor, insira o nome da sua empresa.')
        isValid = false
      }else{
        setempresaError(false)
        setempresaErrorMessage('')
      }
      
    }
    
    // Se os inputs forem válidos, verificar conta
    if (isValid) {
      let cadastrado = false
      if(userType === 'paisagista') {
        const url = 'http://localhost:8080/v1/clientes'
        const dadosUsuario: Paisagista = {
          email:  email,
          senha: password,
          nome: nome,
          telefone: parseInt(celular.replace(/\D/g, ''), 10),
          CPF: parseInt(CPF.replace(/\D/g, ''), 10)
        }
        cadastrado = await cadastraConta(url, dadosUsuario)
        if(cadastrado) {
          toastr.success('Usuário cadastrado com sucesso!')
          navigate('/dashboard-cliente')
        }
    } else{
      const url = 'http://localhost:8080/v1/fornecedores'
        const dadosUsuario: Fornecedor = {
          email:  email,
          senha: password,
          nome: nome,
          telefone: parseInt(celular.replace(/\D/g, ''), 10),
          CNPJ: parseInt(CNPJ.replace(/\D/g, ''), 10),
          CEP: CEP,
          empresa: EMPRESA
        }
        cadastrado = await cadastraConta(url, dadosUsuario)
        if(cadastrado) {
          toastr.success('Usuário cadastrado com sucesso!')
          navigate('/dashboard-fornecedor')
        }
    }    
      
      // Caso ocorre um erro, exibir mensagem de erro
      if(!cadastrado) {
        toastr.error('Erro ao cadastrar novo usuário!')
      }
      return isValid
    }
  }

  

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <SignUpContainer direction="column" justifyContent="space-between">
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
                type={showPassword ? 'text' : 'password'}
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
             {/* Campos adicionais para Paisagista */}
        {userType === 'paisagista' && (
          <>
            <FormControl>
              <FormLabel>CPF</FormLabel>
              <TextField
                error={cpfError}
                helperText={cpfErrorMessage}
                id="cpf-paisagista"
                placeholder="Digite o CPF"
                fullWidth
                variant="outlined"
                color={cpfError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <TextField
                error={nomeError}
                helperText={nomeErrorMessage}
                id="nome-paisagista"
                placeholder="Digite seu nome"
                fullWidth
                variant="outlined"
                color={nomeError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Celular</FormLabel>
              <TextField
                error={celularError}
                helperText={celularErrorMessage}
                id="celular-paisagista"
                placeholder="Digite seu número de celular"
                fullWidth
                variant="outlined"
                color={celularError ? 'error' : 'primary'}
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
        error={cnpjError}
        helperText={cnpjErrorMessage}
        id="cnpj-fornecedor"
        placeholder="Digite o CNPJ"
        fullWidth
        variant="outlined"
        color={cnpjError ? 'error' : 'primary'}
      />
    </FormControl>
    <FormControl>
      <FormLabel>Nome</FormLabel>
      <TextField
        error={nomeError}
        helperText={nomeErrorMessage}
        id="nome-fornecedor"
        placeholder="Digite seu nome"
        fullWidth
        variant="outlined"
        color={nomeError ? 'error' : 'primary'}
      />
    </FormControl>
    <FormControl>
      <FormLabel>Celular</FormLabel>
      <TextField
        error={celularError}
        helperText={celularErrorMessage}
        id="celular-fornecedor"
        placeholder="Digite seu número de celular"
        fullWidth
        variant="outlined"
        color={celularError ? 'error' : 'primary'}
      />
    </FormControl>
    <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
      <FormControl sx={{ flexGrow: 1 }}>
        <FormLabel>CEP</FormLabel>
        <TextField
          error={cepError}
          helperText={cepErrorMessage}
          id="cep"
          placeholder="Digite o CEP"
          fullWidth
          variant="outlined"
          color={cepError ? 'error' : 'primary'}
        />
      </FormControl>
      <FormControl sx={{ flexGrow: 1 }}>
        <FormLabel>Empresa</FormLabel>
        <TextField
          error={empresaError}
          helperText={empresaErrorMessage}
          id="empresa"
          placeholder="Nome da empresa"
          fullWidth
          variant="outlined"
          color={empresaError ? 'error' : 'primary'}
        />
      </FormControl>
    </Stack>
  </>
)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
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
      </SignUpContainer>
    </AppTheme>
  )
}
