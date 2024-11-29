import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography 
} from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import axios from 'axios'
import toastr from 'toastr'

interface Pedido {
    cep: string
    enderecoEntrega: string
    numero: string
    cidade: string
    estado: string
    observacoes: string
    itens: {
      id: number
      nome: string
      quantidade: number 
      idFornecedor: number
      preco: number
    }[]
}


interface PagamentoProps {
    pedido: Pedido
    closePagamento: () => void
}

export default function Pagamento({ pedido, closePagamento }: PagamentoProps){

  const valorTotal = pedido.itens.reduce((total, item) => total + (item.quantidade * item.preco), 0)
  const { user } = useAuth()
  const apiurl = import.meta.env.VITE_APP_API_URL
  const navigate = useNavigate()

    const handleConfirm = async () => {
        const url = `${apiurl}/pedidos` 
        try{
            const novoPedido = {
                idCliente: user?.id,
                data_criacao: new Date(),
                status: 'Pagamento realizado', 
                valor_total: valorTotal,
                CEP: pedido.cep,
                numero_endereco: pedido.numero,
                pedidoItems: {
                  create: pedido.itens.map(item => ({
                    idPlanta: item.id,
                    quantidade: item.quantidade,
                    preco_unitario: item.preco,
                    idFornecedor: item.idFornecedor
                  })),
                },
            }
            const response = await axios.post(url, novoPedido, {withCredentials: true})

            if (response.status === 200 || response.status === 201) {
                toastr.success('Pedido realizado com sucesso!')
                navigate('/pedido-realizado')
            } else {
              toastr.error('Não foi possível concluir a compra. Tente novamente mais tarde.')
            }

        }catch{
            toastr.error('Erro ao confirmar pagamento')
        }
    }

  return (
    <Dialog 
      open={true} 
      onClose={closePagamento}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '16px',
          padding: '16px'
        }
      }}
    >
      <DialogTitle>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2 
          }}
        >
          <CheckCircle /> Confirmar Pagamento
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ 
            textAlign: 'center', 
            mb: 2 
          }}
        >
          Deseja confirmar o pagamento do pedido?
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            textAlign: 'center', 
            fontWeight: 'bold',
            color: 'primary.main'
          }}
        >
          R$ {valorTotal.toFixed(2).replace('.', ',')}
        </Typography>
      </DialogContent>
      
      <DialogActions 
        sx={{ 
          justifyContent: 'center', 
          gap: 2,
          pb: 2 
        }}
      >
        <Button 
          onClick={closePagamento} 
          startIcon={<Cancel />}
          sx={{ minWidth: '120px' }}
          className='bg-vermelho hover:bg-red-400'
        >
          Cancelar
        </Button>
        
        <Button 
          onClick={handleConfirm} 
          color="primary" 
          variant="contained"
          startIcon={<CheckCircle />}
          sx={{ minWidth: '120px' }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  )
}