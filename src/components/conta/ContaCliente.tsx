import { Box, Card, CardContent, Typography, Button, TextField, FormLabel, Divider } from "@mui/material"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from "../../auth/AuthContext"
import toastr from '../../toastrConfig'

export default function ContaCliente() {
  const [clienteData, setClienteData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    cep: '',
  })

  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(clienteData)
  const [error, setError] = useState('')

  const apiurl = import.meta.env.VITE_APP_API_URL
  const { user } = useAuth()

  useEffect(() => {
    const email = user?.email

    const fetchClienteData = async () => {
      try {
        const response = await axios.get(`${apiurl}/clientes/${email}`, {
          withCredentials: true,
        })

        if (response.data.success) {
          const fetchedData = {
            nome: response.data.cliente.nome,
            cpf: formatarCPF(response.data.cliente.cpf),
            email: response.data.cliente.email,
            telefone: response.data.cliente.telefone,
            cep: response.data.cliente.CEP,
          }
          setClienteData(fetchedData)
          setOriginalData(fetchedData)
        } else {
          throw new Error('Dados do cliente não encontrados')
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do cliente:', error)
      }
    }
    fetchClienteData()
  }, [user?.email, apiurl])

  const formatarCPF = (cpf: string) => {
    if (!cpf) return ''
    return cpf
      .toString()
      .replace(/\D/g, '') 
      .replace(/(\d{3})(\d)/, '$1.$2') 
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '') 
    const formattedValue = formatarCPF(rawValue)
    setClienteData({ ...clienteData, cpf: formattedValue })
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setError('')
  }

  const handleCancelClick = () => {
    setClienteData(originalData)
    setIsEditing(false)
  }

  const validateFields = () => {
    const { nome, cpf, email, telefone, cep } = clienteData

    if (!nome || !cpf || !email || !telefone || !cep) {
      setError('Todos os campos são obrigatórios.')
      return false
    }

    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      setError('CPF inválido.')
      return false
    }

    const cepRegex = /^\d{5}-\d{3}$|^\d{8}$/
    if (!cepRegex.test(cep)) {
      setError('CEP inválido. Use o formato 00000-000 ou 00000000.')
      return false
    }

    const telefoneRegex = /^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/ 
    if (!telefoneRegex.test(telefone)) {
      setError('Telefone inválido.')
      return false
    }

    return true
  }

  const handleSaveClick = async () => {
    if (!validateFields()) {
      return 
    }

    try {
      const response = await axios.put(`${apiurl}/clientes/atualizar-dados`, clienteData, {
        withCredentials: true,
      })

      if (response.data.success) {
        setOriginalData(clienteData)
        setIsEditing(false)
        setError('') 
        toastr.success('Dados atualizados com sucesso!')
      } else {
        toastr.error('Erro ao salvar as alterações. Tente novamente.')
      }
    } catch{
      toastr.error('Erro ao salvar as alterações. Tente novamente.')
    }
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Meu Perfil
      </Typography>
      {error && <Typography color="error">{error}</Typography>} {/* Exibir mensagens de erro */}
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
              value={clienteData.nome}
              onChange={(e) => setClienteData({ ...clienteData, nome: e.target.value })}
              disabled={!isEditing}
            />
            
            <FormLabel htmlFor="cpf" sx={{ marginBottom: '4px' }}>
              CPF
            </FormLabel>
            <TextField
              id="cpf"
              variant="outlined"
              fullWidth
              margin="normal"
              value={clienteData.cpf}
              onChange={handleCPFChange}
              disabled={!isEditing}
            />
            
            <FormLabel htmlFor="email" sx={{ marginBottom: '4px' }}>
              E-mail
            </FormLabel>
            <TextField
              id="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={clienteData.email}
              onChange={(e) => setClienteData({ ...clienteData, email: e.target.value })}
              disabled={true}
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
                  value={clienteData.telefone}
                  onChange={(e) => setClienteData({ ...clienteData, telefone: e.target.value })}
                  placeholder="11 99999-9999"
                  disabled={!isEditing}
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
                  value={clienteData.cep}
                  onChange={(e) => setClienteData({ ...clienteData, cep: e.target.value })}
                  placeholder="00000-000"
                  disabled={!isEditing}
                />
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end" style={{ marginTop: '16px' }}>
              {!isEditing ? (
                <Button variant="contained" color="primary" onClick={handleEditClick}>
                  Editar
                </Button>
              ) : (
                <>
                  <Button variant="outlined" color="secondary" onClick={handleCancelClick} style={{ marginRight: '8px' }}>
                    Cancelar
                  </Button>
                  <Button variant="contained" color="primary" onClick={handleSaveClick}>
                    Salvar alterações
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
