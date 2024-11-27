import React, { useCallback, useEffect, useState } from "react"
import {
  Stack,
  Typography,
  Paper,
  FormLabel,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CssBaseline,
  Container,
  IconButton,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material"
import { useAuth } from "../../auth/AuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../loading/Loading"
import AppTheme from "../../css/theme/AppTheme"
import HomeIcon from '@mui/icons-material/Home'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import WarningIcon from '@mui/icons-material/Warning'
import toastr from 'toastr'
import axios from "axios"
import StatusPlantaDialog from "../dialogs/StatusPlanta.Dialog"
import AlteraQuantidadeDialog from "../dialogs/AlteraQuantidade.dialog"

interface FormData {
  nome_cientifico: string
  id_nome_cientifico: number
  nome_popular: string
  id_nome_popular: number
  altura_max: number
  preco: string
  floracao: string
  tamanho: number
  cor_folhagem: string
  imagem: File | null
  porte: string
  quantidade: number 
  ativo: boolean
}

interface NomePopular {
  id: number
  nome: string
  idNomeCientifico: number
}

interface NomeCientifico {
  id: number
  nome: string
  nomesPopulares: NomePopular[]
}

interface Plantas {
  id: number
  idNomeCientifico: number
  nome_cientifico: string
  idNomePopular: number
  nome_popular: string
  cor_floracao: string
  porte: string
  topiaria: string
  alturar_total: number
  quantidade: number
  ativo: boolean
  preco: number // número float
}

type Planta = Plantas

interface ApiResponse {
  data: NomeCientifico[]
  pagination: {
    totalPages: number
    total: number
  }
}


export default function CadastroPlantas(props: { disableCustomTheme?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    nome_cientifico: '',
    id_nome_cientifico: 0,
    nome_popular: '',
    id_nome_popular: 0,
    altura_max: 0,
    preco: '',
    floracao: '',
    tamanho: 0,
    cor_folhagem: '',
    imagem: null,
    porte: '',
    quantidade: 0,
    ativo: true,
  })

  const [plantas, setPlantas] = useState([] as Plantas[])
  const [page, setPage] = useState(0) 
  const [rowsPerPage, setRowsPerPage] = useState(5) 
  const isMobile = window.innerWidth < 600 
  const [carregando, setCarregando] = useState(false)
  const [nomesPopulares, setNomesPopulares] = useState<NomePopular[]>([])
  const [openModalEditar, setOpenModalEditar] = useState(false)
  const [openModalAlternar, setOpenModalAlternar] = useState(false)
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([])
  const { user, loading, update } = useAuth()
  const [loadingComponentState, setLoadingComponentState] = useState(true)
  const [elementoMenu, setElementoMenu] = useState<HTMLElement | null>(null)	
  const [plantaSelecionada, setPlantaSelecionada] = useState<Planta>()
  const navigate = useNavigate()
  const location = useLocation()
  const acessoPelaRota = location.pathname === '/cadastro-planta'
  const apiurl = import.meta.env.VITE_APP_API_URL

  const loadNomesPlantas = useCallback(async () => {
    try {
      setCarregando(true)
      const response = await axios.get<ApiResponse>(
        `${apiurl}/nomes-cientificos/cientifico-com-popular-sem-paginacao`, {withCredentials: true}
      )

      const responsePlantas = await axios.get(`${apiurl}/plantas/fornecedor/${user?.id}`, {withCredentials: true})

      const nomesPopulares = response.data.data
      .flatMap((nomeCientifico: NomeCientifico) =>
        nomeCientifico.nomesPopulares.map((nomePopular: NomePopular) => ({
          id: nomePopular.id,
          nome: nomePopular.nome,
          idNomeCientifico: nomePopular.idNomeCientifico,
        }))
      )
      setNomesPopulares(nomesPopulares)
  
      const nomesCientificos = response.data.data
      .map((nomeCientifico: NomeCientifico) => ({
        id: nomeCientifico.id,
        nome: nomeCientifico.nome,
        nomesPopulares: nomeCientifico.nomesPopulares,
      }))
      setNomesCientificos(nomesCientificos)
      
      const plantas = responsePlantas.data.data.map((planta: Plantas) => ({
        id: planta.id,
        nome_cientifico: nomesCientificos.find(
          (nomeCientifico) => nomeCientifico.id === planta.idNomeCientifico
        )?.nome || '',
        nome_popular: nomesPopulares.find(
          (nomePopular) => nomePopular.id === planta.idNomePopular
        )?.nome || '',
        cor_floracao: planta.cor_floracao,
        porte: planta.porte,
        topiaria: planta.topiaria,
        altura_total: planta.alturar_total,
        quantidade: planta.quantidade,
        ativo: planta.ativo,
        preco: planta.preco.toLocaleString('pt-BR', {
          minimumFractionDigits: 2, // Garante 2 casas decimais
          maximumFractionDigits: 2 // Limita a 2 casas decimais
        }),
      }))
      setPlantas(plantas)

    } catch{
      toastr.error('Erro ao carregar nomes científicos.')
    } finally {
      setCarregando(false)
    }
  }, [apiurl, user?.id])

  useEffect(() => {
    loadNomesPlantas()
  }, [loadNomesPlantas])

  const handleAtivarContaAsync = async () => {
    const url = `${apiurl}/fornecedores/alterna-estado` 

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

  useEffect(() => {
    if (loading) return
    
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/not-found')
      } else if (user.tipoUsuario !== 'fornecedor' && user.tipoUsuario !== 'admin') {
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
  
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'altura_max' || name === 'tamanho' || name === 'quantidade'
        ? Number(value)
        : value,
    }))
  }

  const handleStatus = (id: number) => {
    const updatedPlantas = plantas.map(planta => {
      if (planta.id === id) {
        return { ...planta, ativo: !planta.ativo }
      }
      return planta
    })

    setPlantas(updatedPlantas)
  }

  const handleStatusQuantidade = (id: number, quantidade: number) => {
    let ativo = true

    if (quantidade === 0) {
      ativo = false
    }

    const updatedPlantas = plantas.map(planta => {
      if (planta.id === id) {
        return { ...planta, quantidade: quantidade, ativo: ativo }
      }
      return planta
    })

    setPlantas(updatedPlantas)
  }

  const handleMenuClick = 
    (event: React.MouseEvent<HTMLElement>, planta: Planta) => {
      setElementoMenu(event.currentTarget)
      setPlantaSelecionada( planta )
  }

  const handleOptionClick = (option: string) => {
    if (option === 'Editar' && plantaSelecionada) {
      if (plantaSelecionada) {
          setOpenModalEditar(true)
      }
      handleMenuClose()
    }else if(option === 'Alternar' && plantaSelecionada) {
      setOpenModalAlternar(true)
      handleMenuClose()
    }
  }  

  const handleMenuClose = () => {
    setElementoMenu(null)
  }

  const handleCloseModal = () => {
    setOpenModalAlternar(false)
    setOpenModalEditar(false)
  }

  const validaNomePopular = (nomePopular: string): boolean => {
    const nomeEncontrado = nomesPopulares.find(
      (item) => item.nome.toLowerCase() === nomePopular.toLowerCase()
    )
  
    if (nomeEncontrado) {
      const nomeCientificoEncontrado = nomesCientificos.find(
        (item) => item.id === nomeEncontrado.id
      )
  
      if (nomeCientificoEncontrado) {
        // Atualiza formData usando a função assíncrona de atualização
        setFormData((prevFormData) => ({
          ...prevFormData,
          nome_cientifico: nomeCientificoEncontrado.nome,
          id_nome_cientifico: nomeCientificoEncontrado.id,
          id_nome_popular: nomeEncontrado.id
        }))
        return true
      } else {
        toastr.error('Nome científico não encontrado no sistema.')
        return false
      }
    } else {
      toastr.error('Nome popular não encontrado no sistema.')
      return false
    }
  }
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  
    if (!validateInputs()) {
      return
    }

    const validNomePopular = validaNomePopular(formData.nome_popular)
    if (!validNomePopular) {
      return
    }
  
    const novaPlanta = {
      idFornecedor: user?.id,
      idNomeCientifico: formData.id_nome_cientifico,
      idNomePopular: formData.id_nome_popular,
      topiaria: formData.floracao,
      cor_floracao: formData.cor_folhagem,
      altura_total: formData.altura_max,
      porte: formData.porte,
      preco: parseFloat(formData.preco.replace(',', '.')),
      quantidade: formData.quantidade
    }
  
    try {
      await axios.post(`${apiurl}/plantas/cadastro-planta`, novaPlanta, { withCredentials: true })
      toastr.success('Planta cadastrada com sucesso!')
      loadNomesPlantas()
  
      // Limpa o formulário após o envio
      setFormData({
        nome_cientifico: '',
        id_nome_cientifico: 0,
        nome_popular: '',
        id_nome_popular: 0,
        altura_max: 0,
        preco: '',
        floracao: '',
        tamanho: 0,
        cor_folhagem: '',
        imagem: null,
        porte: '',
        quantidade: 0,
        ativo: true
      })
    } catch {
      toastr.error('Erro ao cadastrar planta!')
    }
  }
  
  const validateInputs = (): boolean => {
    const formatoPreco = /^\d+(\.\d{3})*(,\d{2})?$|^\d+(\.\d{2})?$/
  
    // Valida o nome popular e científico
    if (formData.nome_popular !== '') {
      if (!validaNomePopular(formData.nome_popular)) {
        return false
      }
    }
  
    // Valida os campos restantes
    if (formData.nome_popular === '' || formData.nome_cientifico === '' 
      || formData.altura_max <= 0 || formData.preco === '' || formData.floracao === '' 
      || formData.tamanho <= 0 || formData.cor_folhagem === '' || formData.porte === '' 
      || formData.quantidade <= 0) {
      toastr.error('Todos os campos devem ser preenchidos.')
      return false
    }
  
    // Valida a floracao (Sim/Não)
    if (formData.floracao !== 'Sim' && formData.floracao !== 'Não') {
      toastr.error('A floracao deve ser Sim ou Não.')
      return false
    }
  
    // Valida o formato do preço
    if (!formatoPreco.test(formData.preco)) {
      toastr.error('O preço deve ser um valor válido em reais, como 1000,00.')
      return false
    }
  
    // Valida o porte da planta
    if (formData.porte !== 'Pequeno' && formData.porte !== 'Médio' && formData.porte !== 'Grande') {
      toastr.error('O porte deve ser Pequeno, Médio ou Grande.')
      return false
    }
  
    return true
  }  
  const displayedPlants = plantas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  const Content = (
    <Stack spacing={4} sx={{ maxWidth: "100%", mx: 'auto', mt: "15px", minHeight: '100vh', paddingBottom: '20px' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography variant="h4" align="left">
        Nova planta
      </Typography>
      {acessoPelaRota && (
            <IconButton className='text-cinza_claro' onClick={() => navigate('/')}>
              <HomeIcon />
            </IconButton>
          )}
    </Stack>
    <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="nome_popular">Nome popular</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite o nome popular da planta"
                name="nome_popular"
                value={formData.nome_popular}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            {/* Campo oculto para armazenar o nome científico - não utilizado no momento */}
            <Stack hidden={true} spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="nome_cientifico">Nome científico</FormLabel>
              <TextField
                fullWidth
                placeholder='Nome científico da planta'
                name="nome_cientifico"
                value={formData.nome_cientifico}
                onChange={handleChange}
                variant="outlined"
                disabled={true}
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="floracao">Floração (Sim/Não)</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite se a planta floresce (Sim ou Não)"
                name="floracao"
                value={formData.floracao}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="cor_folagem">Cor da folhagem</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite a cor da folhagem"
                name="cor_folhagem"
                value={formData.cor_folhagem}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="altura_max">Altura máxima (cm)</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite a altura máxima"
                name="altura_max"
                value={formData.altura_max}
                onChange={handleChange}
                variant="outlined"
                type="number"
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="tamanho">Tamanho do vaso (cm)</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite o tamanho do vaso"
                name="tamanho"
                value={formData.tamanho}
                onChange={handleChange}
                variant="outlined"
                type="number"
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="porte">Porte</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite o porte da planta"
                name="porte"
                value={formData.porte}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="quantidade">Quantidade disponível em unidades</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite a quantidade disponível"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                variant="outlined"
                type="number"
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="preco">Preço em R$</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite o preço"
                name="preco"
                value={formData.preco}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
          </Stack>
          {/* Campo oculto para armazenar documento csv - não utilizado no momento */}
          <FormLabel hidden={true} htmlFor="imagem">Imagem ou arquivo CSV (opcional)</FormLabel>
          <input
            type="file"
            name="imagem"
            accept="image/*,.csv"
            capture={isMobile ? "environment" : undefined}
            hidden={true}
            onChange={(event) => {
              if (event.target.files && event.target.files[0]) {
                setFormData((prevState) => ({
                  ...prevState,
                  imagem: event.target.files?.[0] || null,
                }))               
              }
            }}
          />
          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              className="bg-verde_claro"
            >
              Adicionar
            </Button>
          </Stack>
        </Stack>
      </form>
    </Paper>

    <Paper elevation={2} sx={{ paddingX: '20px', borderRadius: '10px' }}>
      <Typography variant="h5" align="left" sx={{ mb: 2, mt: 2 }}>
        Plantas já cadastradas
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome científico</TableCell>
              <TableCell>Nome popular</TableCell>
              <TableCell>Floração</TableCell>
              <TableCell>Cor da folhagem</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedPlants.length === 0 ? (
               <TableRow>
               <TableCell colSpan={8} align="center">
                 Você não tem nenhuma planta cadastrada ainda.
               </TableCell>
             </TableRow>
            ) : ( displayedPlants.map((planta, index) => (
              <TableRow key={index}>
                <TableCell>{planta.nome_cientifico}</TableCell>
                <TableCell>{planta.nome_popular}</TableCell>
                <TableCell>{planta.topiaria.toLocaleUpperCase()}</TableCell>
                <TableCell>{planta.cor_floracao}</TableCell>
                <TableCell>{planta.quantidade}</TableCell>
                <TableCell>R$ {planta.preco}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: planta.ativo ===  true ? '#98b344' : '#e95a5a',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      width: '100px',
                      height: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {planta.ativo === true ? 'Disponível' : 'Indisponível'}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton onClick={(event) => 
                    handleMenuClick(event, planta)
                  }>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={plantas.length} 
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Plantas por página"
        page={page} 
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Menu anchorEl={elementoMenu} open={Boolean(elementoMenu)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOptionClick('Editar')} disabled={plantaSelecionada?.ativo ? false : true}>Editar</MenuItem>
        <MenuItem 
          key={plantaSelecionada?.id || 0} 
          onClick={() => handleOptionClick('Alternar')}>
             {plantaSelecionada?.ativo ? 'Desativar' : 'Ativar'}
        </MenuItem>
      </Menu> 
      <StatusPlantaDialog
        open={openModalAlternar}
        onClose={handleCloseModal}
        id={plantaSelecionada?.id || 0} 
        onStatusChange={handleStatus}
      />
      <AlteraQuantidadeDialog
        open={openModalEditar}
        onClose={handleCloseModal}
        id={plantaSelecionada?.id || 0}
        onStatusChange={handleStatusQuantidade}
      />
    </Paper>
  </Stack>
  )

  return carregando ? (
    <div className="flex items-center justify-center h-screen">
      <CircularProgress />
    </div>
  ) : user?.ativo ? (
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