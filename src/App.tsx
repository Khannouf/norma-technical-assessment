import { Box } from "@mui/material"
import { setLocale } from "yup"

import { Taxes } from "./components/Taxes"
import yupFr from "./constants/yup"

setLocale(yupFr)

function App() {
  return (
    <Box height="100vh" width="100vw">
      <Taxes />
    </Box>
  )
}

export default App
