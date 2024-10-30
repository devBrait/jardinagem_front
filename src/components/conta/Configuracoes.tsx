import { useState } from "react"
import { Box, Card, CardContent, Typography, Button, FormControlLabel, Checkbox, TextField, Divider, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import toastr from "toastr"
import { useAuth } from "../../AuthContext"
import axios from "axios"

export default function Configuracoes() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { user, update } = useAuth()
  const apiurl = import.meta.env.VITE_APP_API_URL

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleAlternaEstadoContaAsync = async () => {
    const url = user?.tipoUsuario === 'cliente' 
      ? `${apiurl}/clientes/alterna-estado` 
      : `${apiurl}/fornecedores/alterna-estado`

    try {
      const response = await axios.put(url, {email: user?.email}, {withCredentials: true})
      
      if (response.status === 200 || response.status === 204) {
        if(user?.ativo){
          toastr.error('Conta desativada com sucesso!')
        }else{
          toastr.success('Conta ativada com sucesso!')
        }


        if (user) {
          update({ ...user, ativo: !user.ativo })
        }

      } else {
        toastr.error('Não foi possível desativar a conta. Tente novamente mais tarde.')
      }
    } catch {
      toastr.error('Ocorreu um erro ao tentar desativar a conta.')
    }
  }
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
  }

  const handleUpdatePassword = async () => { 
    if (newPassword === confirmPassword && newPassword.length >= 6) {
      const url = user?.tipoUsuario === 'cliente' 
        ? `${apiurl}/clientes/redefinir-senha` 
        : `${apiurl}/fornecedores/redefinir-senha`
  
      if (user?.email) {
        const success = await redefineSenha(url, user.email, newPassword)
  
        if (success) {
          toastr.success('Senha atualizada com sucesso!')
        } else {
          toastr.error("Não foi possível atualizar a senha. Tente novamente mais tarde.")
        }
      } else {
        toastr.error('Email do usuário não disponível.')
      }
    } else {
      toastr.error('As senhas devem ser iguais e ter pelo menos 6 caracteres.')
    }
  }
  
  const redefineSenha = async (url: string, email: string, senha: string) => {
    try {
      const response = await axios.put(url, { email, senha }, { headers: { 'Content-Type': 'application/json' } })
  
      if (response.status !== 200 && response.status !== 204) {
        return false
      }
  
      return true
    } catch (error) {
      console.error("Erro na requisição:", error)
      return false
    }
  }  

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>

      {/* Seção de Notificações */}
      <Card variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Notificações
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Gerencie as notificações
          </Typography>
          <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />
          <Typography variant="subtitle1">Email</Typography>
          <FormControlLabel
            control={<Checkbox defaultChecked color="primary" />}
            label="Atualizações de produto"
          />
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Atualizações de segurança"
          />

          <Typography variant="subtitle1" style={{ marginTop: '16px' }}>Telefone</Typography>
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Atualizações de segurança"
          />

          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Button variant="contained" color="primary">
              Salvar alterações
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Seção de Senha */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Senha
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Atualize sua senha
          </Typography>
          <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />
          <TextField
            placeholder="Digite sua senha nova"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            placeholder="Digite sua senha nova novamente"
            variant="outlined"
            fullWidth
            margin="normal"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Button variant="contained" color="primary" onClick={handleUpdatePassword}>
              Atualizar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Seção de Desativar Conta */}
      <Card variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {user?.ativo ? 'Desativar Conta' : 'Ativar Conta' }
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Se você deseja desativar ou ativar sua conta, clique no botão abaixo.
          </Typography>
          <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />

          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: user?.ativo ? '#e95a5a' : '#98b344', 
                color: '#fff',
                '&:hover': {
                  backgroundColor: user?.ativo ? '#d85b5b' : '#98b344', 
                }
              }}
              onClick={handleAlternaEstadoContaAsync}
            >
              {user?.ativo ? 'Desativar Conta' : 'Ativar Conta'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
