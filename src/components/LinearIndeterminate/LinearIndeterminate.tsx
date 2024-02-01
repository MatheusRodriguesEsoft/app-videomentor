import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'

export default function LinearIndeterminate() {
  return (
    <Box
      sx={{
        zIndex: '98',
        width: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <LinearProgress
        color={'inherit'}
        style={{ color: 'rgb(172, 226, 255)', background: 'rgb(12, 149, 223)' }}
      />
    </Box>
  )
}
