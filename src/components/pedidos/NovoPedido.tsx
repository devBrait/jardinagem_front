import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  FormLabel,
  FormControl,
  Container,
  CssBaseline,
  Box,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
/*
import CameraAltIcon from '@mui/icons-material/CameraAlt'
*/
import { useAuth } from '../../auth/AuthContext'
import Loading from '../loading/Loading'
import { useNavigate, useLocation } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import AppTheme from '../../css/theme/AppTheme'
import axios from 'axios'
import toastr from 'toastr'
import WarningIcon from '@mui/icons-material/Warning'
import ResumoPedido from './pagamento/ResumoPedido'

interface FormData {
  cep: string
  enderecoEntrega: string
  numero: string
  cidade: string
  estado: string
  observacoes: string
  arquivo: File | null
  itens: {
    id: number
    nome: string 
    quantidade: number
    fornecedorSelecionado?: number
    quantidadeSelecionada: { [idFornecedor: number]: number, preco: number, idPlanta: number } 
  }[]
}

interface Pedido {
  cep: string
  enderecoEntrega: string
  numero: string
  cidade: string
  estado: string
  observacoes: string
  itens: {
    id: number
    nome: string
    quantidade: number
    idFornecedor: number
    preco: number
  }[]
}

interface Plantas {
  id: number
  nome: string
  idNomeCientifico: number
}

interface opcoesVenda {
  idPlanta: number
  id_fornecedor: number
  nome_fornecedor: string
  preco: number
  quantidade: number
}

export default function NovoPedido(props: { disableCustomTheme?: boolean }) {
  /* Variáveis de Estado para captura de imagem
  const [capturedImage, setCapturedImage] = useState('')
  */
  const { user, loading, update } = useAuth()
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loadingComponentState, setLoadingComponentState] = useState(true)
  const [plantas, setPlantas] = useState([] as Plantas[])
  const [vendas, setVendas] = useState<{ [key: number]: opcoesVenda[] }>({})
  const navigate = useNavigate()
  const location = useLocation()
  const acessoPelaRota = location.pathname === '/realiza-pedido'
  const apiurl = import.meta.env.VITE_APP_API_URL

  const handleAtivarContaAsync = async () => {
    const url = `${apiurl}/clientes/alterna-estado` 

    try {
      const response = await axios.put(url, {email: user?.email}, {withCredentials: true})
      
      if (response.status === 200 || response.status === 204) {
          toastr.success('Conta ativada com sucesso!')

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

  const [formData, setFormData] = useState<FormData>({
    cep: '',
    enderecoEntrega: '',
    numero: '',
    cidade: '',
    estado: '',
    observacoes: '',
    arquivo: null,
    itens: [{ id: 0, nome: '', quantidade: 1, quantidadeSelecionada: { preco: 0, idPlanta: 0 } }],
  })

  useEffect(() => {
    const email = user?.email

    const fetchClienteData = async () => {
      try {
        const response = await axios.get(`${apiurl}/clientes/${email}`, {
          withCredentials: true,
        })

        const responsePlantas = await axios.get(`${apiurl}/nomes-populares`, {withCredentials: true})
        

        // Ensure responsePlantas.data is an array
        const plantasData = responsePlantas.data.data

        if (response.data.success) {
          const dadosCliente = {
            nome: response.data.cliente.nome,
            cpf: response.data.cliente.cpf,
            email: response.data.cliente.email,
            telefone: response.data.cliente.telefone,
            cep: response.data.cliente.CEP,
          }

          // Carrega todos os nomes populares das plantas
          setPlantas(plantasData)

          // Atualiza o estado do formData com o CEP carregado inicialmente
          setFormData((prevData) => ({
            ...prevData,
            cep: dadosCliente.cep,
          }))

          // Chamada para buscar o endereço usando o CEP
          await fetchEnderecoData(dadosCliente.cep)
        } else {
          throw new Error('Dados do cliente não encontrados')
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do cliente:', error)
      }
    }

    fetchClienteData()
  }, [user?.email, apiurl])

  useEffect(() => {
    if (formData.cep) {
      fetchEnderecoData(formData.cep)
    }
  }, [formData.cep])

  const fetchEnderecoData = async (cep: string) => {
    try {
      const enderecoResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

      // Verifica se a resposta contém erro
      if (enderecoResponse.data.erro) {
        setFormData((prevData) => ({
          ...prevData,
          enderecoEntrega: '',
          cidade: '',
          estado: '',
        }))
        toastr.error('CEP inválido')
        return
      }

      // Extrai os dados do endereço
      const enderecoDados = {
        rua: enderecoResponse.data.logradouro || '',
        bairro: enderecoResponse.data.bairro || '',
        cidade: enderecoResponse.data.localidade || '',
        estado: enderecoResponse.data.uf || '',
      }

      // Atualiza o estado com os dados do endereço
      setFormData((prevData) => ({
        ...prevData,
        enderecoEntrega: `${enderecoDados.rua}, ${enderecoDados.bairro}`,
        cidade: enderecoDados.cidade,
        estado: enderecoDados.estado,
      }))
    } catch (error) {
      console.error('Erro ao carregar os dados do endereço:', error)
    }
  }
  

  useEffect(() => {
    if (loading) return
    
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/not-found')
      } else if (user.tipoUsuario !== 'cliente' && user.tipoUsuario !== 'admin') {
        navigate('/not-found')
      } else {
        setLoadingComponentState(false)
      }
    }, 500)
  
    return () => clearTimeout(timer)
  }, [user, loading, navigate])
  
  if (loading || loadingComponentState) {
    return <Loading />
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target
    if(e.target.name === 'cep') {
      const cpfFormatado = value
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o traço após os 5 primeiros dígitos
      .substring(0, 10) // Limita a 10 caracteres (incluindo o traço)

    // Atualiza o estado apenas se o CEP não estiver completo
    setFormData((prevData) => ({
      ...prevData,
      cep: cpfFormatado.length < 10 ? cpfFormatado : prevData.cep,
    }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [e.target.name]: value,
      }))
    }
  }


  const handleItemChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target
    const newItens = [...formData.itens]
  
    // Verificar e atualizar apenas se a quantidade for maior que 0
    const updatedValue = name === "quantidade" ? Number(value) : value
  
    if (name !== "quantidade" || Number(updatedValue) > 0) {
      newItens[index] = {
        ...newItens[index],
        [name]: updatedValue,
      }
  
      setFormData({ ...formData, itens: newItens })
    }
  }
  
  

  const handleAddItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { id: 0, nome: '', quantidade: 1, quantidadeSelecionada: {preco: 0, idPlanta: 0} }],
    })
  }

  const handleRemoveItem = (index: number) => {
    const newItens = formData.itens.filter((_, i) => i !== index)
    
    if(formData.itens.length === 1) {
      return
    }
  
    setFormData({ ...formData, itens: newItens })
  }

  const fetchOpcoesDeVenda = async (plantaId: number, quantidade: number) => {
    try {
      const response = await axios.get(`${apiurl}/plantas/busca-opcoes/${plantaId}/${quantidade}`, {withCredentials: true})
      console.log(response.data.data)
      return response.data.data
    } catch (error) {
      console.error('Erro ao carregar as opções de venda:', error)
    }
  }

  const carregarOpcoesVenda = async (plantaId: number, quantidade: number) => {

    if (quantidade <= 0) {
      return
    }

    const opcoesVenda = await fetchOpcoesDeVenda(plantaId, quantidade)
    console.log(opcoesVenda)
    setVendas((prev) => ({ ...prev, [plantaId]: opcoesVenda }))
  }

  /* Trecho de código para capturar imagem, para futuro reconhecimento de plantas
  const capturaImagem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCapturedImage(reader.result as string)
        console.log(capturedImage)
      }
      reader.readAsDataURL(file)
    }
  } */

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if(!await validateInputs())
    {
      return
    }
    console.log(formData.itens)
    const pedido = {
      cep: formData.cep,
      enderecoEntrega: formData.enderecoEntrega,
      numero: formData.numero,
      cidade: formData.cidade,
      estado: formData.estado,
      observacoes: formData.observacoes,
      itens: formData.itens.map((item) => ({   
        id: item.quantidadeSelecionada.idPlanta,
        nome: item.nome,
        quantidade: item.quantidadeSelecionada[item.fornecedorSelecionado || 0] || 0,
        idFornecedor: item.fornecedorSelecionado || 0,
        preco: item.quantidadeSelecionada.preco
      })),
    }

    setPedido(pedido)
  }

  const validateInputs = async () => {

    if(!await validaCEP(formData.cep)) {
      toastr.error('CEP inválido')
      return false
    }

    if(formData.numero === '')
    {
      toastr.error('Número do endereço não informado.')
      return false
    }

    for (let i = 0; i < formData.itens.length; i++) {
      const item = formData.itens[i]
      const itemSelecionado = item.quantidadeSelecionada.preco
  
      if (itemSelecionado === 0) {
        toastr.error('Remova itens sem quantidade, ou fornecedor selecionados.')
        return false
      }
    }

    return true
  }

  const validaCEP = async (cep: string) => {	
    try {
      const enderecoResponse = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

      // Verifica se a resposta contém erro
      if (enderecoResponse.data.erro) {
        toastr.error('CEP inválido')
        return false
      }

      return true
    } catch{
      toastr.error('CEP inválido')
      return false
    }
  }

  const handleOptionChange = (index: number, optionId: number, checked: boolean) => {
    const newItens = [...formData.itens]
  
    if (checked) {
      newItens[index].fornecedorSelecionado = optionId
    } else {
      if (newItens[index].fornecedorSelecionado === optionId) {
        newItens[index].fornecedorSelecionado = 0
      }
    }
  
    setFormData({ ...formData, itens: newItens })
  }

  const handleQuantityChange = (index: number, idFornecedor: number, quantidade: string, preco: number, idPlanta: number) => {
    const updatedItems = [...formData.itens]
    
    const item = updatedItems[index]
    
    if (!item.quantidadeSelecionada) {
      item.quantidadeSelecionada = { preco, idPlanta }
    }

    console.log(idPlanta)

    // Atualiza a quantidade do fornecedor específico
    item.quantidadeSelecionada[idFornecedor] = parseInt(quantidade, 10) || 0
    item.quantidadeSelecionada.preco = preco
    item.quantidadeSelecionada.idPlanta = idPlanta
    
    // Atualiza o estado
    setFormData({ ...formData, itens: updatedItems })
  }
  
  const closePedido = () => {
    setPedido(null)
  }

  const Content = pedido ? (
        <ResumoPedido pedido={pedido} closePedido={closePedido} />
  ) : (
    <Stack spacing={4} sx={{ maxWidth: '100%', maxHeight: '900px', mx: 'auto', mt: '15px', mg: 10 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" align="left">
         Novo Pedido
        </Typography>
        {acessoPelaRota && (
          <IconButton className='text-cinza_claro' onClick={() => navigate('/')}>
            <HomeIcon />
          </IconButton>
        )}
      </Stack>
      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormLabel htmlFor="cep">CEP</FormLabel>
            <TextField
              fullWidth
              placeholder="Digite seu CEP (XXXXX-XXX)"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              variant="outlined"
            />
            <FormLabel htmlFor="enderecoEntrega">Endereço de Entrega</FormLabel>
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <TextField
                fullWidth
                placeholder="Digite o endereço de entrega"
                name="enderecoEntrega"
                value={formData.enderecoEntrega}
                variant="outlined"
                disabled={true}
              />
              <TextField
                placeholder="Número"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Cidade</FormLabel>
                <TextField
                  id="cidade"
                  placeholder="Digite a cidade"
                  fullWidth
                  variant="outlined"
                  name="cidade"
                  disabled={true}
                  value={formData.cidade}
                />
              </FormControl>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Estado</FormLabel>
                <TextField
                  id="estado"
                  placeholder="Digite o estado"
                  fullWidth
                  variant="outlined"
                  name="estado"
                  disabled={true}
                  value={formData.estado}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Adicionar itens</Typography>        
              {/* <Button
                className="bg-verde_claro text-white"
                sx={{ textTransform: 'none'}}
                component="label"
                >
                <CameraAltIcon sx={{ mr: 1 }} />
                  Adicionar por imagem
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={capturaImagem}
                  style={{ display: 'none' }}
                />
            </Button> */}
            </Stack>
            <>
            {formData.itens.map((item, index) => (
                <Stack key={index} spacing={2} width="100%">
                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Autocomplete para Nome da Planta */}
                    <Autocomplete
                      fullWidth
                      options={plantas}
                      noOptionsText="Nenhuma planta encontrada"
                      getOptionKey={(option) => option.id}
                      getOptionLabel={(option) => option?.nome || ''}
                      isOptionEqualToValue={(option, value) => option?.id === value?.id}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="nome"
                          label="Nome da Planta"
                          variant="outlined"
                          placeholder="Selecione uma planta"
                        />
                      )}
                      value={
                        (plantas && plantas.length > 0)
                          ? plantas.find((planta) => planta.id === item.id) || null
                          : null
                      }
                      onChange={(event, newValue) => {
                        event.preventDefault()
                        const newItens = [...formData.itens]
                        newItens[index] = {
                          ...newItens[index],
                          id: newValue?.id || 0,
                          nome: newValue?.nome || ''
                        }
                        setFormData({ ...formData, itens: newItens })
                        // Chamar rotina para carregar opções de venda
                        if (newValue) {
                          carregarOpcoesVenda(newValue.id, item.quantidade)
                        }
                      }}
                    />
                    
                    {/* Campo para Quantidade */}
                    <TextField
                      label="Quantidade"
                      placeholder="Digite a quantidade em unidades"
                      name="quantidade"
                      value={item.quantidade}
                      onChange={(e) => handleItemChange(index, e)}
                      type="number"
                      variant="outlined"
                      sx={{ width: '50%', maxWidth: 320 }}
                    />
                    
                    {/* Botão para Remover Item */}
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  </Stack>

                  {/* Renderizar Opções de Venda abaixo */}
                  {vendas[item.id] && vendas[item.id].length > 0 ? (
                  <Stack spacing={1} width="100%">
                      <Typography variant="subtitle1">Opções de Venda:</Typography>
                      <Stack direction="row" flexWrap="wrap">
                        {vendas[item.id].map((venda) => (
                          <Stack
                            key={venda.id_fornecedor}
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            marginBottom={1}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={Boolean(item.fornecedorSelecionado === venda.id_fornecedor)}
                                  onChange={(e) =>
                                    handleOptionChange(index, venda.id_fornecedor, e.target.checked)
                                  }
                                  name={`venda-${venda.nome_fornecedor}`}
                                />
                              }
                              label={`${venda.nome_fornecedor} (${venda.quantidade} unidades) por R$ ${venda.preco
                                .toFixed(2)
                                .replace('.', ',')} (un)`}
                            />
                            {item.fornecedorSelecionado === venda.id_fornecedor && (
                              <TextField
                                type="number"
                                size="small"
                                variant="outlined"
                                value={item.quantidadeSelecionada[venda.id_fornecedor] || ''}
                                onChange={(e) => {
                                  const valor = parseInt(e.target.value, 10) || 0
                                  if (valor < 0) {
                                    toastr.error("A quantidade mínima é 1.")
                                  } else if (valor > venda.quantidade) {
                                    toastr.error(`Máximo permitido é ${venda.quantidade}.`)
                                  } else {
                                    handleQuantityChange(index, venda.id_fornecedor, e.target.value, venda.preco, venda.idPlanta)
                                  }
                                }}
                                placeholder="Qtd"
                                style={{ width: '70px' }}
                              />
                            )}
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ) : vendas[item.id] ? (
                    <Typography variant="body2" color="textSecondary">
                      Ninguém está vendendo isso no momento.
                    </Typography>
                  ) : null}
                </Stack>
              ))}
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddItem}
                  className="bg-verde_claro text-white border-verde_footer"
                >
                  Adicionar Novo Item
                </Button>
              </>
            <FormLabel htmlFor="observacoes">Observações Gerais</FormLabel>
            <TextField
              fullWidth
              placeholder="Digite suas observações"
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              multiline
              rows={4}
              variant="outlined"
            />

            <Button variant="contained" className="bg-verde_claro" type="submit" fullWidth>
              Finalizar Pedido
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )

  return user?.ativo ? (
    acessoPelaRota ? (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Container sx={{ mt: 4, mb: 4 }}>{Content}</Container>
      </AppTheme>
    ) : (
      Content // Renderiza apenas o Content se o acesso não for pela rota
    )
  ) : (
    <Box 
    sx={{
      flexGrow: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: { xs: '16px', md: '32px' },
      bgcolor: 'white',
      margin: { xs: '16px', md: '32px' },
      height: '100%',
    }}
    aria-live="polite"
  >
    <Box sx={{ textAlign: 'center' }}>
      <WarningIcon sx={{ fontSize: 48, color: '#656565' }} />
      <Typography variant="h6" color="error" gutterBottom>
        Conta desativada!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Para realizar suas atividades normalmente, ative sua conta novamente.
      </Typography>
      <Button
        variant="contained"
        sx={{ marginTop: '16px' }}
        onClick={handleAtivarContaAsync}
        className="bg-verde_claro"
      >
        Ativar Conta
      </Button>
    </Box>
  </Box>
  )  
}
