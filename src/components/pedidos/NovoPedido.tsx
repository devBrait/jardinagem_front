import { useState } from 'react'
import {
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  InputAdornment,
  FormLabel,
  FormControl,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import FileUploadIcon from '@mui/icons-material/FileUpload'

interface FormData {
  cep: string;
  enderecoEntrega: string;
  numero: string; 
  cidade: string;
  estado: string;
  observacoes: string;
  arquivo: File | null; 
  itens: { nome: string; quantidade: string }[];
}


export default function NovoPedido(){
  const [formData, setFormData] = useState<FormData>({
    cep: '',
    enderecoEntrega: '',
    numero: '',
    cidade: '',
    estado: '',
    observacoes: '',
    arquivo: null,
    itens: [{ nome: '', quantidade: '' }],
  })
  
  const [isAddingItems, setIsAddingItems] = useState(true) // True: adicionando itens, False: upload de arquivo
  const isMobile = window.innerWidth < 600; // Verifica se a tela é pequena

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleItemChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    const newItens = [...formData.itens]
    newItens[index] = { ...newItens[index], [name]: value }
    setFormData({ ...formData, itens: newItens })
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { nome: '', quantidade: '' }],
    })
  }

  const handleRemoveItem = (index: number) => {
    const newItens = formData.itens.filter((_, i) => i !== index)
    setFormData({ ...formData, itens: newItens })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, arquivo: file });
    }
  };

  const toggleAddMethod = () => {
    setIsAddingItems((prev) => !prev)
    setFormData({
      ...formData,
      itens: isAddingItems ? [{ nome: '', quantidade: '' }] : [],
      arquivo: isAddingItems ? null : formData.arquivo,
    })
  }

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", maxHeight: "900px", mx: 'auto', mt: "15px", mg: 10 }}>
      <Typography variant="h4" align="left">
        Novo Pedido
      </Typography>
      <Paper elevation={1} sx={{ padding: '20px', borderRadius: '10px' }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormLabel htmlFor="cep">CEP</FormLabel>
            <TextField
              fullWidth
              placeholder="Digite seu CEP"
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
                onChange={handleChange}
                variant="outlined"
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
                  value={formData.cidade}
                  onChange={handleChange}
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
                  value={formData.estado}
                  onChange={handleChange}
                />
              </FormControl>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Adicionar itens ou arquivo</Typography>
              <Button onClick={toggleAddMethod} className='bg-verde_claro text-white' sx={{ textTransform: 'none'}}>
                {isAddingItems ? 'Adicionar arquivo' : 'Adicionar itens'}
              </Button>
            </Stack>

            {isAddingItems ? (
              <>
                {formData.itens.map((item, index) => (
                  <Stack key={index} direction="row" spacing={2} alignItems="center">
                    <TextField
                      label="Nome do Item"
                      placeholder="Digite o nome do item"
                      name="nome"
                      value={item.nome}
                      onChange={(e) => handleItemChange(index, e)}
                      variant="outlined"
                    />
                    <TextField
                      label="Quantidade"
                      placeholder="Digite a quantidade"
                      name="quantidade"
                      value={item.quantidade}
                      onChange={(e) => handleItemChange(index, e)}
                      type="number"
                      variant="outlined"
                    />
                    <IconButton onClick={() => handleRemoveItem(index)}>
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddItem}
                  className='bg-verde_claro text-white border-verde_footer'
                >
                  Adicionar Novo Item
                </Button>
              </>
            ) : (
              <TextField
                fullWidth
                label="Selecione um arquivo"
                name="arquivo"
                type="file"
                onChange={handleFileChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  inputProps: {
                    capture: isMobile ? "environment" : undefined,
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <FileUploadIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            )}

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

            <Button variant="contained" className='bg-verde_claro' type="submit" fullWidth>
              Enviar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}
