import { useState } from "react"
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
} from "@mui/material"
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function GerenciarUsuarios({ handleNomePopularClick }: { handleNomePopularClick: () => void }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const paisagistas = [
    {
      id: 1,
      name: "João da Silva",
      cpf: "123.456.789-00",
      email: "joao@email.com",
      telefone: "1234567890",
      status: "Ativo",
      senha: "123456",
    },
    {
      id: 2,
      name: "Raphael Grizante",
      cpf: "987.654.321-00",
      email: "raphael@email.com",
      telefone: "0987654321",
      status: "Ativo",
      senha: "abcdef",
    },
    {
      id: 3,
      name: "Ricardo de Oliveira",
      cpf: "111.222.333-44",
      email: "ricardo@email.com",
      telefone: "1122334455",
      status: "Inativo",
      senha: "password",
    },
  ]

  const fornecedores = [
    {
      id: 1,
      nome_fantasia: "Empresa ABC",
      razao_social: "Empresa ABC LTDA",
      cnpj: "12.345.678/0001-90",
      telefone_1: "12345678901",
      ctt_1: "João da Silva",
      telefone_2: null,
      ctt_2: null,
      email: "contato@empresaabc.com",
      site: "www.empresaabc.com",
      instagram: "@empresaabc",
      CEP: "12345-678",
      obs: null,
      ativo: true,
      senha: "senha123",
    },
    {
        id: 2,
        nome_fantasia: "Braga Jardinagem",
        razao_social: "Braga Jardinagem LTDA",
        cnpj: "98.765.432/0001-21",
        telefone_1: "98765432100",
        ctt_1: "Maria Braga",
        telefone_2: null,
        ctt_2: null,
        email: "contato@bragajardinagem.com",
        site: "www.bragajardinagem.com",
        instagram: "@bragajardinagem",
        CEP: "87654-321",
        obs: "Fornecedor confiável",
        ativo: true,
        senha: "senha456",
      },
      {
        id: 3,
        nome_fantasia: "MackLeaps",
        razao_social: "MackLeaps LTDA",
        cnpj: "11.222.333/0001-44",
        telefone_1: "11223344550", 
        ctt_1: "Ricardo Mack",
        telefone_2: "22334455667",
        ctt_2: "Lucia Mack",
        email: "contato@mackleaps.com",
        site: "www.mackleaps.com",
        instagram: "@mackleaps",
        CEP: "11223-445",
        obs: null,
        ativo: true,
        senha: "senha789",
      },
  ]

  const [elementoMenu, setElementoMenu] = useState<null | HTMLElement>(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<{ id: number; name: string; } | null>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, usuario: { id: number; name: string; nome_fantasia?: string }) => {
    setElementoMenu(event.currentTarget)
    setUsuarioSelecionado(usuario)
  }

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Stack spacing={4} sx={{ maxWidth: "100%", mx: "auto", mt: "15px", minHeight: "100vh", paddingBottom: "20px" }}>
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
              {paisagistas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((paisagista) => (
                <TableRow key={paisagista.id}>
                  <TableCell>{paisagista.name}</TableCell>
                  <TableCell>{paisagista.cpf}</TableCell>
                  <TableCell>{paisagista.email}</TableCell>
                  <TableCell>{paisagista.telefone}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        borderColor: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: paisagista.status === "Ativo" ? "#98b344" : "#e95a5a",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        width: "100px",
                        height: "30px",
                        textAlign: "center",
                      }}
                    >
                      {paisagista.status}
                    </span>
                  </TableCell>
                  <TableCell>
                  <IconButton onClick={(event) => handleMenuClick(event, { ...paisagista})}>
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
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Paisagistas por página"
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
              {fornecedores.map((fornecedor) => (
                <TableRow key={fornecedor.id}>
                  <TableCell>{fornecedor.nome_fantasia}</TableCell>
                  <TableCell>{fornecedor.razao_social}</TableCell>
                  <TableCell>{fornecedor.cnpj}</TableCell>
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
          rowsPerPage={rowsPerPage}
          labelRowsPerPage="Fornecedores por página"
          page={page}
          onPageChange={handleChangePage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
          onRowsPerPageChange={handleChangeRowsPerPage}
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
  )
}