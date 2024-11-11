import { Stack, Typography, Paper, FormLabel, TextField, FormControl, InputLabel, Select, MenuItem, Button, List, ListItem, ListItemText, Pagination, CircularProgress } from '@mui/material'
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
  const [idCounter, setIdCounter] = useState(1)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limitPerPage = 10 
  const apiurl = import.meta.env.VITE_APP_API_URL

  const loadNomesCientificos = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get<ApiResponse>(
        `${apiurl}/nomes-cientificos/cientifico-com-popular?page=${page}&limit=${limitPerPage}`, { withCredentials: true }
      )
      setNomesCientificos(response.data.data)
      setTotalPages(response.data.pagination.totalPages)
    } catch (err) {
      toastr.error('Erro ao carregar nomes científicos')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [apiurl, page])

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

    if(nomePopular.trim() == '' || nomeCientificoId === null) {
      toastr.error('Preencha todos os campos')
      return
    }

    if (nomePopular.trim() && nomeCientificoId !== null) {
      const index = nomesCientificos.findIndex((n) => n.id === nomeCientificoId)
      if (index !== -1) {
        try{
          setLoading(true)
          const updatedNomesCientificos = [...nomesCientificos]
          await axios.post(`${apiurl}/nomes-populares`, { nome: nomePopular, idNomeCientifico: nomeCientificoId }, { withCredentials: true })
          toastr.success('Nome popular cadastrado com sucesso!')
          updatedNomesCientificos[index].nomesPopulares.push({ id: idCounter, nome: nomePopular })
          setNomesCientificos(updatedNomesCientificos)
          setIdCounter(idCounter + 1)
          setNomePopular('')
          setNomeCientificoId(null)
      }catch(err){
        if (axios.isAxiosError(err) && err.response) {
          const errorMessage = err.response.data.error
          if (errorMessage) {
            toastr.error(errorMessage+'!')
          } else {
            console.log(err.message)
            console.log('aqui')
            toastr.error('Erro ao cadastrar nome popular!')
          }
        } else {
          toastr.error('Erro ao cadastrar nome popular!')
        }
      }finally {
        setLoading(false)
      }
    }
    }
  }

  const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
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

      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
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
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          color="primary"
          sx={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
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
      </Paper>
    </Stack>
  )
}