import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  FormLabel,
  TextField,
  Button,
  IconButton,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import DeleteIcon from "@mui/icons-material/Delete"
import axios from "axios"
import { useAuth } from "../../AuthContext"
import toastr from "../../toastrConfig"

export default function ContaFornecedor() {
  const [fornecedorData, setFornecedorData] = useState({
    CNPJ: "",
    nome_fantasia: "",
    razao_social: "",
    ctt_1: "",
    telefone_1: "",
    ctt_2: "",
    telefone_2: "",
    email: "",
    site: "",
    instagram: "",
    CEP: "",
    obs: "",
  })

  const [contatos, setContatos] = useState([
    { nome: "", telefone: "" },
    { nome: "", telefone: "" },
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [originalData, setOriginalData] = useState(fornecedorData)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const apiurl = import.meta.env.VITE_APP_API_URL

  const handleAddContato = () => {
    if (contatos.length < 2) {
      setContatos([...contatos, { nome: "", telefone: "" }])
    }
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setError("")
  }

  const handleCancelClick = () => {
    setFornecedorData(originalData)
    setContatos([
      { nome: originalData.ctt_1 || "", telefone: originalData.telefone_1 || "" },
      { nome: originalData.ctt_2 || "", telefone: originalData.telefone_2 || "" },
    ].filter(contato => contato.telefone !== ""))
    setIsEditing(false)
  }

  const carregarContatos = (data: {
    ctt_1: string
    telefone_1: string
    ctt_2: string
    telefone_2: string
  }) => {
    const loadedContatos = [
      { nome: data.ctt_1 || "", telefone: data.telefone_1 || "" },
      { nome: data.ctt_2 || "", telefone: data.telefone_2 || "" },
    ].filter(contato => contato.telefone !== "")
    setContatos(loadedContatos)
  }

  useEffect(() => {
    const email = user?.email
    const fetchClienteData = async () => {
      try {
        const response = await axios.get(`${apiurl}/fornecedores/${email}`, {
          withCredentials: true,
        })

        if (response.data.success) {
          const fetchedData = {
            CNPJ: formatarCNPJ(response.data.fornecedor.CNPJ),
            nome_fantasia: response.data.fornecedor.nome_fantasia,
            razao_social: response.data.fornecedor.razao_social || "",
            ctt_1: response.data.fornecedor.ctt_1 || "",
            telefone_1: response.data.fornecedor.telefone_1 || "",
            ctt_2: response.data.fornecedor.ctt_2 || "",
            telefone_2: response.data.fornecedor.telefone_2 || "",
            email: response.data.fornecedor.email,
            site: response.data.fornecedor.site || "",
            instagram: response.data.fornecedor.instagram || "",
            CEP: response.data.fornecedor.CEP,
            obs: response.data.fornecedor.obs || "",
          }

          setFornecedorData(fetchedData)
          setOriginalData(fetchedData)
          carregarContatos(fetchedData)
        } else {
          throw new Error("Dados do fornecedor não encontrados")
        }
      } catch (error) {
        console.error("Erro ao carregar os dados do fornecedor:", error)
      }
    }

    fetchClienteData()
  }, [user?.email, apiurl])

  const formatarCNPJ = (cnpj: string) => {
    if (!cnpj) return ""
    return cnpj
      .toString()
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
  }

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    const formattedValue = formatarCNPJ(rawValue)
    setFornecedorData({ ...fornecedorData, CNPJ: formattedValue })
  }

  const validateFields = () => {
    const { nome_fantasia, CNPJ, email, razao_social, CEP } = fornecedorData

    if (!nome_fantasia || !CNPJ || !email || !razao_social || !CEP) {
      setError("Todos os campos são obrigatórios.")
      return false
    }

    if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(CNPJ)) {
      setError("CNPJ inválido.")
      return false
    }

    const cepRegex = /^\d{5}-\d{3}$|^\d{8}$/
    if (!cepRegex.test(CEP)) {
      setError("CEP inválido. Use o formato 00000-000 ou 00000000.")
      return false
    }

    // Validar pelo menos um contato com telefone
    if (!contatos[0].telefone) {
      setError("É necessário pelo menos um contato com telefone.")
      return false
    }

    const telefoneRegex = /^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/
    if (contatos[0].telefone && !telefoneRegex.test(contatos[0].telefone)) {
      setError("Telefone inválido.")
      return false
    }

    return true
  }

  const handleSaveClick = async () => {
    if (!validateFields()) {
      return
    }

    try {
      const cnpj = fornecedorData.CNPJ.replace(/\D/g, '')
      
      // Sincronizar os contatos com fornecedorData antes de enviar
      const dadosAtualizados = {
        ...fornecedorData,
        CNPJ: cnpj,
        ctt_1: contatos[0]?.nome || "",
        telefone_1: contatos[0]?.telefone || "",
        ctt_2: contatos[1]?.nome || "",
        telefone_2: contatos[1]?.telefone || "",
      }

      const response = await axios.put(`${apiurl}/fornecedores/atualizar-dados`, dadosAtualizados, {
        withCredentials: true,
      })

      if (response.data.success) {
        setOriginalData(dadosAtualizados)
        setFornecedorData(dadosAtualizados)
        setIsEditing(false)
        setError("")
        toastr.success("Dados atualizados com sucesso!")
      } else {
        toastr.error("Erro ao salvar as alterações. Tente novamente.")
      }
    } catch {
      toastr.error("Erro ao salvar as alterações. Tente novamente.")
    }
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
      {error && <Typography color="error">{error}</Typography>} {/* Exibir mensagens de erro */}
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
              id="nome_fantasia"
              variant="outlined"
              fullWidth
              margin="normal"
              disabled={!isEditing}
              onChange={(e) => setFornecedorData({ ...fornecedorData, nome_fantasia: e.target.value })}
              value={fornecedorData.nome_fantasia}
            />
            
            <FormLabel htmlFor="cnpj" sx={{ marginBottom: '4px' }}>
              CNPJ
            </FormLabel>
            <TextField
              id="cnpj"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={handleCNPJChange}
              disabled={!isEditing}
              value={fornecedorData.CNPJ}
            />
            
            <FormLabel htmlFor="email" sx={{ marginBottom: '4px' }}>
              E-mail
            </FormLabel>
            <TextField
              id="email"
              variant="outlined"
              fullWidth
              margin="normal"
              disabled={true}
              value={fornecedorData.email}
            />            
            <FormLabel htmlFor="cep" sx={{ marginBottom: '4px' }}>
              CEP
            </FormLabel>
            <TextField
              id="CEP"
              variant="outlined"
              fullWidth
              margin="normal"   
              disabled={!isEditing}
              placeholder="00000-000"
              onChange={(e) => setFornecedorData({ ...fornecedorData, CEP: e.target.value })}
              value={fornecedorData.CEP}
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
                  disabled={!isEditing}
                  onChange={(e) => setFornecedorData({ ...fornecedorData, site: e.target.value })}
                  value={fornecedorData.site}
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
                  disabled={!isEditing}
                  onChange={(e) => setFornecedorData({ ...fornecedorData, instagram: e.target.value })}
                  value={fornecedorData.instagram}
                />
              </Box>
            </Box>

            <Divider orientation="horizontal" style={{ margin: '16px 0', width: '100%' }} />            
            {/* Renderiza os campos de contato dinamicamente */}
            {contatos.map((contato, index) => (
            <Box key={index} display="flex" alignItems="center" mt={2}>
              {/* Campo para Nome do Contato */}
              <Box flex={1} mr={1}>
                <FormLabel htmlFor={`nomeContato-${index}`} sx={{ marginBottom: '4px' }}>
                  Nome do Contato
                </FormLabel>
                <TextField
                  id={`nomeContato-${index}`}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  disabled={!isEditing}
                  value={contato.nome}
                  onChange={(e) => handleContatoChange(index, 'nome', e.target.value)}
                />
              </Box>

              {/* Campo para Telefone */}
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
                  disabled={!isEditing}
                  value={contato.telefone}
                  onChange={(e) => handleContatoChange(index, 'telefone', e.target.value)}
                />
              </Box>

              {/* Botão de Remover Contato */}
              {contatos.length > 1 && (
                <IconButton onClick={() => handleRemoveContato(index)} aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddContato}
              startIcon={<AddIcon />}
              style={{ marginTop: '16px' }}
              disabled={contatos.length >= 2 || !isEditing} // Desabilita se já houver 2 contatos
            >
              Adicionar Contato
            </Button>

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
