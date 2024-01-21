import { yupResolver } from "@hookform/resolvers/yup"
import { Delete } from "@mui/icons-material"
import {
  AppBar,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material"
import React, { useMemo } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { TextFieldElement } from "react-hook-form-mui"

import * as Calculations from "../helpers/calculations"
import { Form, formSchema, RowType } from "../types/form"

export const Taxes: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    defaultValues: { rows: [] },
    resolver: yupResolver(formSchema),
    mode: "all",
  })

  const { fields, append, remove } = useFieldArray({ control, name: "rows" })
  const rows = useWatch({ control, name: "rows" })

  const hasErrors = Object.keys(errors).length > 0 // pas dans un useMemo car ça ne change pas après chaque validation
  const total = useMemo(() => Calculations.getPermanentTaxesAnnualizedTotal(rows), [rows])
  const totalAfterTaxes = useMemo(
    () => Calculations.getPermanentTaxesAnnualizedTotalAfterTaxes(rows),
    [rows],
  )

  const onClickAppendRow = (type: RowType) => {
    if (type === "permanent") {
      append({ type: "permanent", monthlySalary: 0, year: 1900 })
    } else {
      append({
        type: "freelance",
        daysPerYear: 0,
        hourlyRate: 0,
        hoursPerDay: 0,
        year: 1900,
      })
    }
  }

  return (
    <Stack>
      <AppBar>
        <Toolbar>Calcul des taxes</Toolbar>
      </AppBar>
      <Toolbar />
      <Stack
        component="form"
        onSubmit={handleSubmit(
          () => {
            console.log("success")
          },
          () => {
            console.log("error")
          },
        )}
        marginTop={2}
        marginX={2}
        border={1}
        borderColor="lightgray"
        borderRadius={2}
        padding={2}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Salaire par mois</TableCell>
                <TableCell>Taux horaire</TableCell>
                <TableCell>Heures par jour</TableCell>
                <TableCell>Jours par an</TableCell>
                <TableCell>Année</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => {
                if (field.type === "permanent") {
                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.monthlySalary`}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">€/ mois</InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.year`}
                          InputProps={{ inputProps: { min: 1900 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => remove(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                } else {
                  return (
                    <TableRow key={field.id}>
                      <TableCell />
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.hourlyRate`}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">€/ heure</InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.hoursPerDay`}
                        />
                      </TableCell>
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.daysPerYear`}
                        />
                      </TableCell>
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.year`}
                          InputProps={{ inputProps: { min: 1900 } }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => remove(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                }
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="center" spacing={2} marginY={2}>
          <Button
            onClick={() => onClickAppendRow("permanent")}
            sx={{ alignSelf: "center", marginTop: 2 }}
          >
            Ajouter un revenu de CDI
          </Button>
          <Button
            onClick={() => onClickAppendRow("freelance")}
            sx={{ alignSelf: "center", marginTop: 2 }}
          >
            Ajouter un revenu de Freelance
          </Button>
        </Stack>
        <Typography variant="h6">Total : {hasErrors ? "--" : total} €</Typography>
        <Typography variant="h6">
          Total après taxes : {hasErrors ? "--" : totalAfterTaxes} €
        </Typography>
      </Stack>
    </Stack>
  )
}
