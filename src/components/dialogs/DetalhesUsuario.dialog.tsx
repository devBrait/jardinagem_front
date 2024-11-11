import { Dialog, DialogTitle, DialogContent, Typography, Box } from "@mui/material"

interface Paisagista {
  tipoUsuario: 'paisagista'
  id: number
  nome_fantasia: string
  nome: string
  ativo: boolean
  cpf: number
  email: string
  telefone: string
  data_nascimento: Date
  CEP: string
}

interface Fornecedor {
  tipoUsuario: 'fornecedor'
  id: number
  nome: string
  ativo: boolean
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
}

type Usuario = Paisagista | Fornecedor

interface UsuarioDetalhesDialogProps {
  open: boolean
  onClose: () => void
  usuario: Usuario | null
  tipoUsuario: 'paisagista' | 'fornecedor'
}

export default function DetalhesUsuarioDialog({ open, onClose, usuario, tipoUsuario }: UsuarioDetalhesDialogProps) {

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

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      sx={{ 
        '& .MuiDialog-paper': { 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '24px', 
          maxWidth: 'lg', 
          height: 'auto', 
          margin: 'auto'
        },
      }}
    >
      <DialogTitle className='mb-4'>Detalhes do {tipoUsuario === 'paisagista' ? 'Paisagista' : 'Fornecedor'}</DialogTitle>
      <DialogContent>
        {usuario ? (
          <>
            {tipoUsuario === 'paisagista' && 'cpf' in usuario ? (
              <>
                <Box mb={2}>
                    <Typography><strong>Nome:</strong> {usuario.nome}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>CPF:</strong> {formatCPF(usuario.cpf)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Email:</strong> {usuario.email}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Telefone:</strong> {usuario.telefone}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>CEP:</strong> {usuario.CEP}</Typography>
                </Box>
              </>
            ) : tipoUsuario === 'fornecedor' && 'cnpj' in usuario ? (
              <>
                <Box mb={2}>
                  <Typography><strong>Nome Fantasia:</strong> {usuario.nome_fantasia}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Razão Social:</strong> {usuario.razao_social}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>CNPJ:</strong> {formatCNPJ(usuario.cnpj)}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Email:</strong> {usuario.email}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Contato:</strong> {usuario.ctt_1}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Telefone:</strong> {usuario.telefone_1}</Typography>
                </Box>
                {usuario.telefone_2 != 0 ? (
                    <>
                  <Box mb={2}>
                    <Typography><strong>Contato:</strong> {usuario.ctt_2}</Typography>
                  </Box>
                  <Box mb={2}>
                    <Typography><strong>Telefone:</strong> {usuario.telefone_2}</Typography>
                  </Box>
                  </>
                ) : null}
                <Box mb={2}>
                  <Typography><strong>Site:</strong> {usuario.site}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>Instagram:</strong> {usuario.instagram}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography><strong>CEP:</strong> {usuario.CEP}</Typography>
                </Box>
              </>
            ) : null}

            <Box mb={2}>
              <Typography><strong>Status:</strong> {usuario.ativo ? 'Ativo' : 'Inativo'}</Typography>
            </Box>
          </>
        ) : (
          <Typography>Sem detalhes disponíveis.</Typography>
        )}
      </DialogContent>
    </Dialog>
  )
}
