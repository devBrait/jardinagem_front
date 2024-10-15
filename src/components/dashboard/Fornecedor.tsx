import { CssBaseline, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAuth } from '../../AuthContext'
import { useNavigate } from 'react-router-dom'
import Loading from '../loading/Loading'
import SideNavbar from '../navBar/SideNavbar'
import ListaSolicitacoes from '../pedidos/ListaSolicitacoes'
import AppTheme from '../../css/theme/AppTheme'
import CadastroPlantas from '../pedidos/CadastroPlantas'

export default function Fornecedor(props: { disableCustomTheme?: boolean }) {

    const handleCadastroPlantaClick = () => {
        setCurrentComponent(<CadastroPlantas />)
    }

    const [currentComponent, setCurrentComponent] = useState(<ListaSolicitacoes handleCadastroPlantaClick={handleCadastroPlantaClick}/>)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) {
            navigate('/not-found')
            }else if(user.tipoUsuario !== 'fornecedor' && user.tipoUsuario !== 'admin'){
            navigate('/not-found')
            }
        setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, [user, navigate])

    if (loading) {
        return <Loading />
    }

    return (
        <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '100vh' }}>
            {/* flexDirection muda entre coluna para telas pequenas (xs) e linha para grandes (md) */}
            
            {/* navBar */}
            <Box
            sx={{
                width: { xs: '100%', md: 350 },
                flexShrink: 0,
                padding: { xs: '8px' },
                paddingX: { xs: '8px', md: '16px' },
                bgcolor: 'white',
                boxShadow: 0,
                order: { xs: 0, md: 0 },
            }}
            >
            <SideNavbar setCurrentComponent={setCurrentComponent} />
            </Box>
            <Box
            sx={{
                flexGrow: 1,
                padding: { xs: '8px', md: '16px' },
                bgcolor: 'white',
                order: { xs: 1, md: 1 },
            }}
            >
            {currentComponent} {/* Renderiza o componente atual */}
            </Box>
        </Box>
        </AppTheme>
    )
}
