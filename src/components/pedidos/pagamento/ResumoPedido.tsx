import { Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, FormControlLabel, Checkbox } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import HomeIcon from '@mui/icons-material/Home'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from "react"
import Pagamento from "./Pagamento"
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
  

interface ResumoPedidoProps {
    pedido: Pedido
    closePedido: () => void
}

export default function ResumoPedido({ pedido, closePedido }: ResumoPedidoProps) {
    const [pagamento, setPagamento] = useState({
        pix: false,
        boleto: false
      })
    const [open, setOpen] = useState(false)
    const valorTotal = pedido.itens.reduce((total, item) => total + (item.quantidade * item.preco), 0)
    
    const closePagamento = () => {
      setOpen(false)
    }

    const handleMetodoPagamento = (method: 'pix' | 'boleto') => {
        setPagamento((prev: { pix: boolean; boleto: boolean }) => ({
          pix: method === 'pix' ? !prev.pix : false,
          boleto: method === 'boleto' ? !prev.boleto : false
        }))
      }

      const openPagamento = () => {
        if(!pagamento.pix && !pagamento.boleto) {
          toastr.error('Selecione uma forma de pagamento.')
          return
        }
        setOpen(true)
      }

    return open ? (
       <Pagamento pedido={pedido} closePagamento={closePagamento}/>
    ) : (
      <div className="max-w-2xl mx-auto p-6 bg-transparent">
        <Typography 
          variant="h4" 
          className="text-center font-bold mb-8 flex items-center justify-center gap-3"
        >
          Resumo do Pedido
        </Typography>
  
        {/* Endereço de entrega */}
        <Paper 
          elevation={3} 
          className="p-5 mb-6 bg-white border-l-4 border-verde_claro rounded-lg"
        >
          <Typography variant="h6" className="mb-3 text-lg font-semibold flex items-center gap-2">
            <HomeIcon className="text-primary"/>
            Endereço de Entrega
          </Typography>
          <Typography variant="body1" className="pl-8">
            {pedido.enderecoEntrega + ', ' + pedido.numero}
          </Typography>
        </Paper>
  
        {/* Itens do pedido */}
        <Paper 
          elevation={3} 
          className="p-5 mb-6 bg-white rounded-lg shadow-md"
        >
          <Typography variant="h6" className="mb-4 text-lg font-semibold flex items-center gap-2">
            <ShoppingCartIcon className="text-primary"/>
            Itens do Pedido
          </Typography>
          <TableContainer>
            <Table className="w-full">
              <TableHead className="bg-white">
                <TableRow>
                  <TableCell className="font-bold ">Nome</TableCell>
                  <TableCell className="font-bold  text-center">Quantidade</TableCell>
                  <TableCell className="font-bold  text-right">Preço</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedido.itens.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="">{item.nome}</TableCell>
                    <TableCell className=" text-center">{item.quantidade}</TableCell>
                    <TableCell className=" text-right">
                      R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-white font-bold">
                  <TableCell colSpan={2} className="text-right font-semibold">Total:</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    R$ {valorTotal.toFixed(2).replace('.', ',')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
  
        {/* Formas de pagamento */}
        <Paper 
          elevation={3} 
          className="p-5 mb-6 bg-white border-l-4 border-verde_claro rounded-lg"
        >
          <Typography variant="h6" className="mb-3 text-lg font-semibold  flex items-center gap-2">
            <CreditCardIcon className="text-verde_claro"/>
            Forma de Pagamento
          </Typography>
          <div className="pl-8 flex items-center gap-2">
          <FormControlLabel
            control={
              <Checkbox
                checked={pagamento.pix}
                onChange={() => handleMetodoPagamento('pix')}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">PIX</Typography>
            }
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={pagamento.boleto}
                onChange={() => handleMetodoPagamento('boleto')}
                color="primary"
              />
            }
            label={
              <Typography variant="body1">BOLETO</Typography>
            }
          />
        </div>
        </Paper>
        <div className="flex space-x-4">
          <Button
            onClick={closePedido}
            className="flex-1 py-3 flex items-center justify-center gap-2 bg-vermelho hover:bg-red-400"
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openPagamento()}
            className="flex-1 py-3 flex items-center justify-center gap-2"
            startIcon={<CreditCardIcon />}
          >
            Pagar
          </Button>
        </div>
      </div>
    )
  }