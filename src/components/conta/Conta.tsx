import { Box, Card, CardContent, Typography, Button, TextField, FormLabel, Divider } from "@mui/material";

export default function Conta() {
  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
      <Box display="flex" justifyContent="space-between" style={{ marginTop: '20px' }}>
        <Card variant="outlined" style={{ flex: 1 }}>
          <CardContent>
            <Typography color="text.secondary" gutterBottom marginBottom={2}>
              Seus dados podem ser editados aqui.
            </Typography>
            <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />
            <FormLabel htmlFor="nome" sx={{ marginBottom: '4px' }}>
              Nome completo
            </FormLabel>
            <TextField
              id="nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value="João Pereira da Silva"
            />
            
            <FormLabel htmlFor="cpf" sx={{ marginBottom: '4px' }}>
              CPF
            </FormLabel>
            <TextField
              id="cpf"
              variant="outlined"
              fullWidth
              margin="normal"
              value="123.456.789-00"
            />
            
            <FormLabel htmlFor="email" sx={{ marginBottom: '4px' }}>
              E-mail
            </FormLabel>
            <TextField
              id="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value="joao@gmail.com"
            />
            
            <FormLabel htmlFor="dataNascimento" sx={{ marginBottom: '4px' }}>
              Data de nascimento
            </FormLabel>
            <TextField
              id="dataNascimento"
              variant="outlined"
              fullWidth
              margin="normal"
              placeholder="DD/MM/AAAA"
            />
            
            <Box display="flex" justifyContent="space-between" style={{ marginTop: '16px' }}>
              <Box flex={1} mr={1}>
                <FormLabel htmlFor="telefone" sx={{ marginBottom: '4px' }}>
                  Telefone
                </FormLabel>
                <TextField
                  id="telefone"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  placeholder="11 99999-9999"
                />
              </Box>
              
              <Box flex={1} ml={1}>
                <FormLabel htmlFor="cep" sx={{ marginBottom: '4px' }}>
                  CEP
                </FormLabel>
                <TextField
                  id="cep"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  placeholder="01001-000"
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
              <Button variant="contained" color="primary">
                Salvar alterações
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
