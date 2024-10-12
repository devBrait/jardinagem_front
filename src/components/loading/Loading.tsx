import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    height="100vh"
  >
    <CircularProgress className="text-verde_claro"/>
    <Typography variant="h6" style={{ marginTop: 16, color: "#656565" }}>
      Carregando...
    </Typography>
  </Box>
  )
}