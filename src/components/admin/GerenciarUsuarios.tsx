import { useEffect, useState } from "react"
import {
  Stack,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Dialog,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  IconButton,
  Button,
  Box,
  CircularProgress,
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import axios from "axios"
import toastr from 'toastr'

interface Paisagista {
  id: number
  nome: string
  email: string
  cpf: number
  data_nascimento: Date
  CEP: string
  telefone: string
  ativo: boolean
}

interface Fornecedor {
  id: number
  cnpj: number 
  nome_fantasia: string
  razao_social: string
  ctt_1: string
  telefone_1: number
  ctt_2: string
  telefone_2: number
  email: string
  site: string
  instagram: string
  CEP: string
  ativo: boolean
}


interface ResponsePaisagista {
  success: boolean
  data: Paisagista[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

interface ResponseFornecedor {
  success: boolean
  data: Fornecedor[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    itemsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

export default function GerenciarUsuarios({ handleNomePopularClick }: { handleNomePopularClick: () => void }) {
  const [paisagistas, setPaisagistas] = useState<Paisagista[]>([])
  const [loading, setLoading] = useState(false)
  const [pagePaisagistas, setPagePaisagistas] = useState(0)
  const [rowsPerPagePaisagistas, setRowsPerPagePaisagistas] = useState(5)
  
  const [elementoMenu, setElementoMenu] = useState<null | HTMLElement>(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: number; name: string } | null>(null)
  const apiurl = import.meta.env.VITE_APP_API_URL
  const limitPerPage = 10

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [pageFornecedores, setPageFornecedores] = useState(0)
  const [rowsPerPageFornecedores, setRowsPerPageFornecedores] = useState(5)

  

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, usuario: { id: number; name: string; nome_fantasia?: string }) => {
      setElementoMenu(event.currentTarget)
      setUsuarioSelecionado(usuario)
    }
  
    useEffect(() => {
      const fetchPaisagistas = async () => {
        try {
          setLoading(true)
          const responsePaisagistas = 
                await axios.get<ResponsePaisagista>(`${apiurl}/clientes?page=${pagePaisagistas + 1}&limit=${limitPerPage}`, { withCredentials: true })

          const responseFornecedores = 
                await axios.get<ResponseFornecedor>(`${apiurl}/fornecedores?page=${pageFornecedores + 1}&limit=${limitPerPage}`, { withCredentials: true })

          setFornecedores(responseFornecedores.data.data)
          setPaisagistas(responsePaisagistas.data.data)
        } catch (err) {
          console.log(err)
          toastr.error("Erro ao buscar usuários!")
        }finally {
          setLoading(false)
        }
      }
      fetchPaisagistas()
    }, [apiurl, pagePaisagistas, pageFornecedores, limitPerPage])
  
    const handleMenuClose = () => {
      setElementoMenu(null)
    }
  
    const handleOptionClick = (option: string) => {
      setSelectedOption(option)
      setOpenModal(true)
      handleMenuClose()
    }
  
    const handleCloseModal = () => {
      setOpenModal(false)
    }
  
    const handleChangePagePaisagistas = (_event: unknown, newPage: number) => {
      setPagePaisagistas(newPage)
    }
  
    const handleChangeRowsPerPagePaisagistas = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPagePaisagistas(parseInt(event.target.value, 10))
      setPagePaisagistas(0)
    }
  
    const handleChangePageFornecedores = (_event: unknown, newPage: number) => {
      setPageFornecedores(newPage)
    }
  
    const handleChangeRowsPerPageFornecedores = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPageFornecedores(parseInt(event.target.value, 10))
      setPageFornecedores(0)
    }

    const formatCPF = (cpf: number) => {
      const cpfString = String(cpf)
    
      const cleanedCPF = cpfString.replace(/\D/g, '')
    
      if (cleanedCPF.length === 11) {
        return cleanedCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
      }
    
      return cpfString
    }

    const formatCNPJ = (cnpj: number) => {
      const cnpjString = String(cnpj);
    
      const cleanedCNPJ = cnpjString.replace(/\D/g, '');
    
      if (cleanedCNPJ.length === 14) {
        return cleanedCNPJ.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
    
      return cnpjString;
    }
    

    const Content = <Stack spacing={4} sx={{ maxWidth: "100%", mx: "auto", mt: "15px", minHeight: "100vh", paddingBottom: "20px" }}>
    <Typography variant="h4" align="left">
      Usuários cadastrados
    </Typography>
    <Box sx={{ textAlign: 'left', marginTop: 'px' }}>
      <Button
        sx={{
          backgroundColor: '#98b344',
          color: '#fff',
          textTransform: 'none',
        }}
        onClick={handleNomePopularClick}
      >
        Cadastrar nome popular
      </Button>
    </Box>
    <Paper elevation={2} sx={{ paddingX: "20px", borderRadius: "10px" }}>
      <Typography variant="h5" align="left" sx={{ mb: 2, mt: 2 }}>
        Paisagistas
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>CPF</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paisagistas.slice(pagePaisagistas * rowsPerPagePaisagistas, (pagePaisagistas + 1) * rowsPerPagePaisagistas).map((paisagista) => (
              <TableRow key={paisagista.id}>
                <TableCell>{paisagista.nome}</TableCell>
                <TableCell>{formatCPF(paisagista.cpf)}</TableCell>
                <TableCell>{paisagista.email}</TableCell>
                <TableCell>{paisagista.telefone}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: paisagista.ativo === true ? "#98b344" : "#e95a5a",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      width: "100px",
                      height: "30px",
                      textAlign: "center",
                    }}
                  >
                    {paisagista.ativo === true ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell>
                <IconButton onClick={(event) => handleMenuClick(event, { id: paisagista.id, name: paisagista.nome })}>
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
        count={paisagistas.length}
        labelRowsPerPage="Paisagistas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        rowsPerPage={rowsPerPagePaisagistas}
        page={pagePaisagistas}
        onPageChange={handleChangePagePaisagistas}
        onRowsPerPageChange={handleChangeRowsPerPagePaisagistas}   
      />
      <Menu anchorEl={elementoMenu} open={Boolean(elementoMenu)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOptionClick('Editar')}>Editar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Visualizar')}>Visualizar</MenuItem>
      </Menu>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedOption} Pedido</DialogTitle>
        <DialogContent>
          <Typography>
            Ação: {selectedOption} para o/a {usuarioSelecionado ? usuarioSelecionado.name : ''}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>

    <Paper elevation={2} sx={{ paddingX: "20px", borderRadius: "10px" }}>
      <Typography variant="h5" align="left" sx={{ mb: 2, mt: 2 }}>
        Fornecedores
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome Fantasia</TableCell>
              <TableCell>Razão Social</TableCell>
              <TableCell>CNPJ</TableCell>
              <TableCell>Contato</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fornecedores.slice(pageFornecedores * rowsPerPageFornecedores, (pageFornecedores + 1) * rowsPerPageFornecedores).map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell>{fornecedor.nome_fantasia}</TableCell>
                <TableCell>{fornecedor.razao_social}</TableCell>
                <TableCell>{formatCNPJ(fornecedor.cnpj)}</TableCell>
                <TableCell>{fornecedor.ctt_1}</TableCell>
                <TableCell>{fornecedor.telefone_1}</TableCell>
                <TableCell>{fornecedor.email}</TableCell>
                <TableCell>
                  <span
                    style={{
                      borderColor: "black",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: fornecedor.ativo ? "#98b344" : "#e95a5a",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      width: "100px",
                      height: "30px",
                      textAlign: "center",
                    }}
                  >
                    {fornecedor.ativo ? "Ativo" : "Inativo"}
                  </span>
                </TableCell>
                <TableCell>
                <IconButton onClick={(event) => handleMenuClick(event, { id: fornecedor.id, name: fornecedor.nome_fantasia, nome_fantasia: fornecedor.nome_fantasia })}>
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
        count={fornecedores.length}
        labelRowsPerPage="Fornecedores por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        rowsPerPage={rowsPerPageFornecedores}
        page={pageFornecedores}
        onPageChange={handleChangePageFornecedores}
        onRowsPerPageChange={handleChangeRowsPerPageFornecedores}
      />
      <Menu anchorEl={elementoMenu} open={Boolean(elementoMenu)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleOptionClick('Editar')}>Editar</MenuItem>
        <MenuItem onClick={() => handleOptionClick('Visualizar')}>Visualizar</MenuItem>
      </Menu>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{selectedOption} usuário</DialogTitle>
        <DialogContent>
          <Typography>
            Ação: {selectedOption} para o/a {usuarioSelecionado ? usuarioSelecionado.name : ''}.
          </Typography>
        </DialogContent>
      </Dialog>
    </Paper>
  </Stack>
    
  return loading ? (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <CircularProgress sx={{ display: 'block' }} />
    </div>
  ) : Content
}