import { 
  Stack, 
  Typography, 
  Paper, 
  FormLabel, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  CircularProgress,
  TablePagination,
} from '@mui/material'
import axios from 'axios'
import { useState, useCallback, useEffect } from 'react'
import toastr from 'toastr'

interface NomeCientifico {
  id: number
  nome: string
}

interface ApiResponse {
  items: NomeCientifico[]
  pagination: {
    totalPages: number
    total: number 
  }
}

export default function NovoNomeCientifico() {
  const [nome, setNomeCientifico] = useState('')
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const apiurl = import.meta.env.VITE_APP_API_URL

  const loadNomesCientificos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `${apiurl}/nomes-cientificos?page=${page + 1}&limit=${rowsPerPage}&search=${searchTerm}`, {withCredentials: true}
      )
      setNomesCientificos(response.data.items)
      setTotalItems(response.data.pagination.total)
    } catch (err) {
      toastr.error('Erro ao carregar nomes científicos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, rowsPerPage, searchTerm, apiurl])

  useEffect(() => {
    loadNomesCientificos()
  }, [page, rowsPerPage, searchTerm, loadNomesCientificos])

  const handleChangeNomeCientifico = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCientifico(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (nome.trim()) {
      try {
        setLoading(true)
        await axios.post(`${apiurl}/nomes-cientificos`, { nome }, { withCredentials: true })
        toastr.success('Nome científico cadastrado com sucesso!')
        setNomeCientifico('')
        loadNomesCientificos()
      } catch{
        toastr.error('Erro ao cadastrar nome científico!')
      } finally {
        setLoading(false)
      }
    } else {
      toastr.error('Por favor, insira um nome científico!')
    }
  }

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(0)
  }

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", maxHeight: "700px", mx: 'auto', mt: "15px" }}>
      <Typography variant="h4" align="left">
        Cadastro de Nome Científico
      </Typography>
  
      <Paper elevation={1} sx={{ padding: '15px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormLabel htmlFor="nomeCientifico">Nome Científico</FormLabel>
            <TextField
              fullWidth
              placeholder="Digite o nome científico"
              value={nome}
              onChange={handleChangeNomeCientifico}
              variant="outlined"
              disabled={loading}
            />
  
            <Button
              variant="contained"
              type="submit"
              className='bg-verde_claro'
              fullWidth
              sx={{ height: '40px' }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
            </Button>
          </Stack>
        </form>
      </Paper>
  
      <Paper elevation={1} sx={{ paddingX: '10px', borderRadius: '10px' }}>
        <Stack spacing={2}>
          <Typography variant="h6" align="left">
            Lista de Nomes Científicos
          </Typography>
  
          <TextField
            fullWidth
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={handleSearch}
            variant="outlined"
            size="small"
          />
  
          {loading ? (
            <CircularProgress sx={{ alignSelf: 'center' }} />
          ) : (
            <>
              <List>
                {nomesCientificos.length > 0 ? (
                  nomesCientificos.map((nome) => (
                    <ListItem key={nome.id}>
                      <ListItemText
                        primary={
                          <Typography>
                            {nome.nome}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="Nenhum nome científico cadastrado." />
                  </ListItem>
                )}
              </List>
                <TablePagination
                className='items-center'
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
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}