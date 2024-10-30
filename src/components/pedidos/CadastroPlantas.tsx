import React, { useEffect, useState } from "react"
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
} from "@mui/material"
import { useAuth } from "../../AuthContext"
import { useLocation, useNavigate } from "react-router-dom"
import Loading from "../loading/Loading"
import AppTheme from "../../css/theme/AppTheme"
import HomeIcon from '@mui/icons-material/Home'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface FormData {
  nome_cientifico: string
  nome_popular: string
  altura_max: number
  preco: string
  floracao: string
  tamanho: number
  cor_folhagem: string
  imagem: File | null
  porte: string
  quantidade: number 
}

export default function CadastroPlantas(props: { disableCustomTheme?: boolean }) {
  const [formData, setFormData] = useState<FormData>({
    nome_cientifico: '',
    nome_popular: '',
    altura_max: 0,
    preco: '',
    floracao: '',
    tamanho: 0,
    cor_folhagem: '',
    imagem: null,
    porte: '',
    quantidade: 0,
  })

  const [plants, setPlants] = useState([
    { nome_cientifico: "Rosa", nome_popular: "Rosa", floracao: "Sim", cor_folhagem: "Verde", quantidade: 5, preco: "30,00", status: "Disponível" },
    { nome_cientifico: "Hydrangea", nome_popular: "Hortência", floracao: "Sim", cor_folhagem: "Verde", quantidade: 5, preco: "24,99", status: "Disponível" },
    { nome_cientifico: "Epipremnum pinnatum", nome_popular: "Jibóia", floracao: "Não", cor_folhagem: "Verde", quantidade: 0, preco: "30", status: "Indisponível" },
    { nome_cientifico: "Helianthus annuus", nome_popular: "Girassol", floracao: "Sim", cor_folhagem: "Verde", quantidade: 5, preco: "30", status: "Disponível" },
    { nome_cientifico: "Helianthus annuus", nome_popular: "Girassol", floracao: "Sim", cor_folhagem: "Verde", quantidade: 5, preco: "30", status: "Disponível" },
    { nome_cientifico: "Helianthus annuus", nome_popular: "Girassol", floracao: "Sim", cor_folhagem: "Verde", quantidade: 5, preco: "30", status: "Disponível" },
  ])
  const [page, setPage] = useState(0) 
  const [rowsPerPage, setRowsPerPage] = useState(5) 
  const isMobile = window.innerWidth < 600 
  
  const { user, loading } = useAuth()
  const [loadingComponentState, setLoadingComponentState] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const acessoPelaRota = location.pathname === '/cadastro-planta'

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPlants((prevPlants) => [
      ...prevPlants,
      { ...formData, status: "Disponível" },
    ])
    setFormData({
      nome_cientifico: '',
      nome_popular: '',
      altura_max: 0,
      preco: '',
      floracao: '',
      tamanho: 0,
      cor_folhagem: '',
      imagem: null,
      porte: '',
      quantidade: 0,
    })
  }

  const displayedPlants = plants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

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
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="nome_cientifico">Nome científico</FormLabel>
              <TextField
                fullWidth
                placeholder='Digite o nome científico da planta'
                name="nome_cientifico"
                value={formData.nome_cientifico}
                onChange={handleChange}
                variant="outlined"
              />
            </Stack>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <FormLabel htmlFor="floracao">Floração (Sim/Não)</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite se a planta floresce"
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
                name="cor_folagem"
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
              <FormLabel htmlFor="quantidade">Quantidade disponível</FormLabel>
              <TextField
                fullWidth
                placeholder="Digite a quantidade disponível"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleChange}
                variant="outlined"
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
          <FormLabel htmlFor="imagem">Imagem ou arquivo CSV (opcional)</FormLabel>
          <input
            type="file"
            name="imagem"
            accept="image/*,.csv"
            capture={isMobile ? "environment" : undefined}
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
            {displayedPlants.map((planta, index) => (
              <TableRow key={index}>
                <TableCell>{planta.nome_cientifico}</TableCell>
                <TableCell>{planta.nome_popular}</TableCell>
                <TableCell>{planta.floracao}</TableCell>
                <TableCell>{planta.cor_folhagem}</TableCell>
                <TableCell>{planta.quantidade}</TableCell>
                <TableCell>R$ {planta.preco}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: 'black',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: planta.status === 'Disponível' ? '#98b344' : '#e95a5a',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      width: '100px',
                      height: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {planta.status}
                  </span>
                </TableCell>
                <TableCell>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={plants.length} 
        rowsPerPage={rowsPerPage}
        labelRowsPerPage="Plantas por página"
        page={page} 
        onPageChange={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  </Stack>
  )

  return acessoPelaRota ? 
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
        <Container  sx={{ mt: 4, mb: 4 }}>{Content}</Container> 
    </AppTheme>
    : 
    Content
}