import { 
  Stack, 
  Typography, 
  Paper, 
  FormLabel, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  TablePagination 
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import { SelectChangeEvent } from '@mui/material'
import axios from 'axios'
import toastr from 'toastr'

interface NomePopular {
  id: number
  nome: string
}

interface NomeCientifico {
  id: number
  nome: string
  nomesPopulares: NomePopular[]
}

interface ApiResponse {
  success: boolean
  data: NomeCientifico[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export default function NovoNomePopular() {
  const [nomePopular, setNomePopular] = useState('')
  const [loading, setLoading] = useState(false)
  const [nomeCientificoId, setNomeCientificoId] = useState<number | null>(null)
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const apiurl = import.meta.env.VITE_APP_API_URL

  const loadNomesCientificos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `${apiurl}/nomes-cientificos/cientifico-com-popular?page=${page + 1}&limit=${rowsPerPage}`, { withCredentials: true }
      )
      setNomesCientificos(response.data.data)
      setTotalItems(response.data.pagination.total)
    } catch (err) {
      toastr.error('Erro ao carregar nomes científicos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [apiurl, page, rowsPerPage])

  useEffect(() => {
    loadNomesCientificos()
  }, [loadNomesCientificos])

  const handleChangeNomePopular = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomePopular(e.target.value)
  }

  const handleChangeNomeCientifico = (e: SelectChangeEvent<number | null>) => {
    const value = e.target.value as number | null
    setNomeCientificoId(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nomePopular.trim() === '' || nomeCientificoId === null) {
      toastr.error('Preencha todos os campos')
      return
    }

    try {
      setLoading(true)
      await axios.post(`${apiurl}/nomes-populares`, { nome: nomePopular, idNomeCientifico: nomeCientificoId }, { withCredentials: true })
      toastr.success('Nome popular cadastrado com sucesso!')
      loadNomesCientificos()
      setNomePopular('')
      setNomeCientificoId(null)
    } catch (err) {
      toastr.error('Erro ao cadastrar nome popular!')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0) 
  }

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", maxHeight: "700px", mx: 'auto', mt: "15px", mg: 10 }}>
      <Typography variant="h4" align="left">
        Cadastro de Nome Popular
      </Typography>
      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormLabel htmlFor="nomePopular">Nome Popular</FormLabel>
            <TextField
              fullWidth
              placeholder="Digite o nome popular"
              value={nomePopular}
              onChange={handleChangeNomePopular}
              variant="outlined"
            />
            
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="nomeCientifico-label">Nome Científico</InputLabel>
              <Select
                labelId="nomeCientifico-label"
                value={nomeCientificoId ?? ''}
                onChange={handleChangeNomeCientifico}
                label="Nome Científico"
              >
                <MenuItem value="">
                  <em>Selecione um nome científico</em>
                </MenuItem>
                {nomesCientificos.map((lstNomes) => (
                  <MenuItem key={lstNomes.id} value={lstNomes.id}>
                    {lstNomes.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" type="submit" fullWidth sx={{ height: '40px' }}>
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Paper>

      <Paper elevation={1} sx={{ paddingX: '20px', borderRadius: '10px' }}>
        <Typography variant="h6" align="left">
          Lista de Nomes Populares
        </Typography>
        {loading ? (
          <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <List>
            {nomesCientificos.map((lstNomes) => (
              <div key={lstNomes.id}>
                <ListItem>
                  <ListItemText primary={<Typography fontWeight="bold">{lstNomes.nome}</Typography>} />
                </ListItem>
                {lstNomes.nomesPopulares.length > 0 ? (
                  lstNomes.nomesPopulares.map((nomePopular) => (
                    <ListItem key={nomePopular.id}>
                      <ListItemText primary={`- ${nomePopular.nome}`} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Nenhum nome popular cadastrado." />
                  </ListItem>
                )}
              </div>
            ))}
          </List>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Nomes por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Stack>
  )
}
