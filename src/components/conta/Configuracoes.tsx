import { useState } from "react"
import { Box, Card, CardContent, Typography, Button, FormControlLabel, Checkbox, TextField, Divider, InputAdornment, IconButton } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

export default function Configuracoes() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev)
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
            <Button variant="contained" color="primary">
              Atualizar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Seção de Desativar Conta */}
      <Card variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Desativar Conta
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Se você deseja desativar sua conta, clique no botão abaixo.
          </Typography>
          <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />

          <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#e95a5a',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#d85b5b',
                }
              }}
            >
              Desativar Conta
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
