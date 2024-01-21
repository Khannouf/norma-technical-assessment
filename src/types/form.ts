import * as yup from "yup"

//schema pour le type des taxes permanente
export const permanentTaxesRowSchema = yup.object({
  type: yup.string().oneOf(["permanent"]).required(),
  year: yup.number().required().min(1900).max(2100).integer(),
  monthlySalary: yup.number().required().min(0),
})
export type PermanentTaxesRow = yup.InferType<typeof permanentTaxesRowSchema>

//schema pour le type des taxes freelance
export const freelanceTaxesRowSchema = yup.object({
  type: yup.string().oneOf(["freelance"]).required(),
  year: yup.number().required().min(1900).max(2100).integer(),
  hourlyRate: yup.number().required().min(0),
  hoursPerDay: yup.number().required().min(0).max(24),
  daysPerYear: yup.number().required().min(0).max(365),
})
export type FreelanceTaxesRow = yup.InferType<typeof permanentTaxesRowSchema>

//si le type est permanent alors on retourne un schema permanent sinon freelance
export const rowSchema = yup.lazy((value) => {
  if (value?.type === "permanent") return permanentTaxesRowSchema
  else return freelanceTaxesRowSchema
})

//Row qui est soit un schema permanent soit un freelance
export type Row = yup.InferType<typeof rowSchema>
export type RowType = Row["type"]

export const formSchema = yup.object({
  rows: yup.array().of(rowSchema).required(),
})
//on interfere un schéma de type row
export type Form = yup.InferType<typeof formSchema>
