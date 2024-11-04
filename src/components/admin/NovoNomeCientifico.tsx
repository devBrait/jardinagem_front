
import { Stack, Typography, Paper, FormLabel, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { useState } from 'react';

interface NomeCientifico {
  id: number;
  nomeCientifico: string;
}

export default function NovoNomeCientifico() {
  const [nomeCientifico, setNomeCientifico] = useState('');
  const [nomesCientificos, setNomesCientificos] = useState<NomeCientifico[]>([]);
  const [idCounter, setIdCounter] = useState(1);

  const handleChangeNomeCientifico = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomeCientifico(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nomeCientifico.trim()) {
      const novoNomeCientifico: NomeCientifico = {
        id: idCounter,
        nomeCientifico: nomeCientifico.trim()
      };
      
      setNomesCientificos([...nomesCientificos, novoNomeCientifico]);
      setIdCounter(idCounter + 1);
      setNomeCientifico('');
    }
  };

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", maxHeight: "700px", mx: 'auto', mt: "15px", mg: 10 }}>
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
              value={nomeCientifico}
              onChange={handleChangeNomeCientifico}
              variant="outlined"
            />

            <Button 
              variant="contained" 
              type="submit" 
              className='bg-verde_claro' 
              fullWidth 
              sx={{ height: '40px' }}
            >
              Cadastrar
            </Button>
          </Stack>
        </form>
      </Paper>

      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
        <Typography variant="h6" align="left">
          Lista de Nomes Científicos
        </Typography>
        <List>
          {nomesCientificos.length > 0 ? (
            nomesCientificos.map((nome) => (
              <ListItem key={nome.id}>
                <ListItemText 
                  primary={
                    <Typography fontWeight="bold">
                      {nome.nomeCientifico}
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
      </Paper>
    </Stack>
  );
}