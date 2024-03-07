import {
  Box,
  Button,
  Grid,
  GridItem,
  Icon,
  TextButton,
  TextInput,
  Typography,
} from '@strapi/design-system'
import { ArrowRight } from '@strapi/icons'
import React, { useState } from 'react'
import { useIntl } from 'react-intl'

const Input = React.forwardRef((props: any, ref: any) => {
  const [currentAction, setCurrentAction] = useState('None Selected')
  const { attribute, disabled, intlLabel, name, onChange, required, value } =
    props // these are just some of the props passed by the content-manager

  const { formatMessage } = useIntl()

  return (
    <>
      <Typography>{props.name}</Typography>

      <Typography>
        <pre>{JSON.stringify(props, null, 2)}</pre>
      </Typography>
    </>
  )
})

export default Input
