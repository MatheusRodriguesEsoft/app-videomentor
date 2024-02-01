import { TextField, TextFieldVariants } from '@mui/material'
import React, { useState } from 'react'

function InputNumber(props: {
  style?: React.CSSProperties | undefined
  onChange: (arg0: any) => void
  value: unknown | string
  name?: string | undefined
  className?: string | undefined
  id?: string | undefined
  label:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | React.PromiseLikeOfReactNode
    | null
    | undefined
  variant: TextFieldVariants
}) {
  return (
    <TextField
      style={props.style}
      name={props.name}
      className={props.className}
      id={props.id}
      fullWidth
      label={props.label}
      variant={props.variant}
      value={props.value}
      onChange={props.onChange}
      type={'number'}
      InputProps={{
        inputProps: {
          pattern: '[0-9]*',
        },
      }}
    />
  )
}

export default InputNumber
