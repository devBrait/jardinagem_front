import { Stack, Typography, Paper, FormLabel, TextField, FormControl, InputLabel, Select, MenuItem, Button, List, ListItem, ListItemText } from '@mui/material'
import { useState } from 'react'
import { SelectChangeEvent } from '@mui/material'

interface NomePopular {
  id: number
  nomePopular: string
}

interface NomeCientifico {
  id: number
  nomeCientifico: string
  nomesPopulares: NomePopular[]
}

export default function NovoNomePopular() {
  const [nomePopular, setNomePopular] = useState('')
  const [nomeCientificoId, setNomeCientificoId] = useState<number | ''>('')
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([
    { id: 1, nomeCientifico: 'Rosa rubiginosa', nomesPopulares: [] },
    { id: 2, nomeCientifico: 'Cactaceae', nomesPopulares: [] },
    { id: 3, nomeCientifico: 'Ficus elastica', nomesPopulares: [] },
  ])
  const [idCounter, setIdCounter] = useState(1)

  const handleChangeNomePopular = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomePopular(e.target.value)
  }

  const handleChangeNomeCientifico = (e: SelectChangeEvent<number | ''>) => {
    const value = e.target.value

    if (value === '') {
      setNomeCientificoId('')
    } else {
      setNomeCientificoId(Number(value))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (nomePopular.trim() && nomeCientificoId) {
      const index = nomesCientificos.findIndex((n) => n.id === nomeCientificoId)
      if (index !== -1) {
        const updatedNomesCientificos = [...nomesCientificos]
        updatedNomesCientificos[index].nomesPopulares.push({ id: idCounter, nomePopular })
        setNomesCientificos(updatedNomesCientificos)
        setIdCounter(idCounter + 1) // Incrementa o contador para o próximo ID
        setNomePopular('') // Limpa o campo de entrada
        setNomeCientificoId('') // Limpa a seleção do nome científico
      }
    }
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
                value={nomeCientificoId}
                onChange={handleChangeNomeCientifico}
                label="Nome Científico"
              >
                <MenuItem value="">
                  <em>Selecione um nome científico</em>
                </MenuItem>
                {nomesCientificos.map((nome) => (
                  <MenuItem key={nome.id} value={nome.id}>
                    {nome.nomeCientifico}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="contained" type="submit" className='bg-verde_claro' fullWidth sx={{ height: '40px' }}>
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Paper>

      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h6" align="left">
          Lista de Nomes Populares
        </Typography>
        <List>
          {nomesCientificos.map((nomeCientifico) => (
            <div key={nomeCientifico.id}>
              <ListItem>
                <ListItemText primary={<Typography fontWeight="bold">
        {nomeCientifico.nomeCientifico}
      </Typography>} />
              </ListItem>
              {nomeCientifico.nomesPopulares.length > 0 ? (
                nomeCientifico.nomesPopulares.map((nomePopular) => (
                  <ListItem key={nomePopular.id}>
                    <ListItemText primary={`- ${nomePopular.nomePopular}`} />
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
      </Paper>
    </Stack>
  )
}
