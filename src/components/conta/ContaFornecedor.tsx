import { useState } from "react"
import { Box, Typography, Card, CardContent, Divider, FormLabel, TextField, Button, IconButton } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"

export default function ContaFornecedor() {
  const [contatos, setContatos] = useState([{ nome: "", telefone: "" }])

  const handleAddContato = () => {
    setContatos([...contatos, { nome: "", telefone: "" }])
  }

  const handleRemoveContato = (index: number) => {
    const newContatos = contatos.filter((_, i) => i !== index)
    setContatos(newContatos)
  }

  const handleContatoChange = (index: number, field: string, value: string) => {
    const updatedContatos = contatos.map((contato, i) => 
      i === index ? { ...contato, [field]: value } : contato
    )
    setContatos(updatedContatos)
  }

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
              Nome da Empresa
            </FormLabel>
            <TextField
              id="nome"
              variant="outlined"
              fullWidth
              margin="normal"
              value="João Pereira da Silva"
            />
            
            <FormLabel htmlFor="cnpj" sx={{ marginBottom: '4px' }}>
              CNPJ
            </FormLabel>
            <TextField
              id="cnpj"
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

            <FormLabel htmlFor="cep" sx={{ marginBottom: '4px' }}>
                        CEP
                        </FormLabel>
                        <TextField
                        id="cep"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        placeholder="00000-00"
            />

            <Box display="flex" justifyContent="space-between" style={{ marginTop: '16px' }}>
              <Box flex={1} mr={1}>
                <FormLabel htmlFor="site" sx={{ marginBottom: '4px' }}>
                  Site da Empresa
                </FormLabel>
                <TextField
                  id="site"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  placeholder="https://www.empresaxyz.com.br"
                />
              </Box>
              
              <Box flex={1} ml={1}>
                <FormLabel htmlFor="instagram" sx={{ marginBottom: '4px' }}>
                  Instagram
                </FormLabel>
                <TextField
                  id="instagram"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  placeholder="@empresa"
                />
              </Box>
            </Box>

            <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />
            
            {/* Renderiza os campos de contato dinamicamente */}
            {contatos.map((contato, index) => (
              <Box key={index} display="flex" alignItems="center" mt={2}>
                <Box flex={1} mr={1}>
                  <FormLabel htmlFor={`nomeContato-${index}`} sx={{ marginBottom: '4px' }}>
                    Nome do Contato
                  </FormLabel>
                  <TextField
                    id={`nomeContato-${index}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={contato.nome}
                    onChange={(e) => handleContatoChange(index, "nome", e.target.value)}
                  />
                </Box>

                <Box flex={1} ml={1}>
                  <FormLabel htmlFor={`telefoneContato-${index}`} sx={{ marginBottom: '4px' }}>
                    Telefone
                  </FormLabel>
                  <TextField
                    id={`telefoneContato-${index}`}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    placeholder="11 99999-9999"
                    value={contato.telefone}
                    onChange={(e) => handleContatoChange(index, "telefone", e.target.value)}
                  />
                </Box>

                <IconButton onClick={() => handleRemoveContato(index)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            {/* Botão para adicionar mais contatos */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddContato}
              startIcon={<AddIcon />}
              style={{ marginTop: '16px' }}
            >
              Adicionar Contato
            </Button>

            <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
              <Button variant="contained" color="primary">
                Salvar alterações
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
