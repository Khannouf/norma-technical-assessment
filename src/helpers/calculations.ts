import { sum } from "lodash"

import { FreelanceTaxRate, PermanentTaxRate } from "../constants/taxRates"
import { Row } from "../types/form"

export function getAnnualizedMonthlySalary(row: Row): number {
  return row.type === "permanent"
    ? row.monthlySalary * 12
    : row.hourlyRate * row.hoursPerDay * row.daysPerYear
}

export function getPermanentTaxesAnnualizedTotal(rows: Row[]): number {
  return sum(rows.map((row) => getAnnualizedMonthlySalary(row)))
}

export function getPermanentTaxesAnnualizedTotalAfterTaxes(rows: Row[]): number {
  return sum(
    rows.map((row) => {
      const annualizedMonthlySalary = getAnnualizedMonthlySalary(row)
      return (
        annualizedMonthlySalary *
        (1 - (row.type === "permanent" ? PermanentTaxRate : FreelanceTaxRate))
      )
    }),
  )
}
