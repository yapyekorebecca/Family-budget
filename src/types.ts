export type CategoryType = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Shopping' | 'Healthcare' | 'Education' | 'Other'

export interface Expense {
  id: string
  amount: number
  category: CategoryType
  description: string
  date: string
}

export interface ExpenseContextType {
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void
  getTotalByCategory: () => Record<CategoryType, number>
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[]
}
