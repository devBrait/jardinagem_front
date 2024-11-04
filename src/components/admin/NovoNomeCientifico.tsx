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
  Pagination,
  CircularProgress,
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
  }
}

export default function NovoNomeCientifico() {
  const [nome, setNomeCientifico] = useState('')
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const apiurl = import.meta.env.VITE_APP_API_URL
  const limitPerPage = 10

  const loadNomesCientificos = useCallback(async () => {
    try {
      setLoading(true)

      const response = await axios.get<ApiResponse>(
        `${apiurl}/nomes-cientificos?page=${page}&limit=${limitPerPage}&search=${searchTerm}`, {withCredentials: true}
      )
      setNomesCientificos(response.data.items) // items contém os nomes científicos
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      toastr.error('Erro ao carregar nomes científicos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, limitPerPage, searchTerm, apiurl])

  useEffect(() => {
    loadNomesCientificos()
  }, [page, searchTerm, loadNomesCientificos])

  const handleChangeNomeCientifico = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCientifico(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (nome === '') {
      toastr.error('Por favor, insira um nome científico!');
      return;
    }
  
    if (nome.trim()) {
      try {
        setLoading(true)
        await axios.post(`${apiurl}/nomes-cientificos`, { nome }, { withCredentials: true })
        toastr.success('Nome científico cadastrado com sucesso!')
        setNomeCientifico('')
        loadNomesCientificos()
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.error
          if (errorMessage) {
            toastr.error(errorMessage+'!')
          } else {
            toastr.error('Erro ao cadastrar nome científico!')
          }
        } else {
          toastr.error('Erro ao cadastrar nome científico!')
        }
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1) 
  }

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", maxHeight: "700px", mx: 'auto', mt: "15px" }}>
      <Typography variant="h4" align="left">
        Cadastro de Nome Científico
      </Typography>
  
      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
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
  
      <Paper elevation={1} sx={{ paddingX: '20px', borderRadius: '10px', paddingBottom: '10px' }}>
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
  
              {totalPages > 1 && (
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    alignSelf: 'center',
                    '& .MuiPaginationItem-root': {
                      color: '#656565', 
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      color: 'white', 
                      backgroundColor: '#98b344',
                    },
                  }}
                />
              )}
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}