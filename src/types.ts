export type CategoryType = 'Food' | 'Transport' | 'Rent' | 'Utilities' | 'School' | 'Shopping' | 'Health' | 'Entertainment' | 'Other'

export interface Expense {
  id: string
  title: string
  amount: number
  category: CategoryType
  date: string
  notes?: string
  familyMember?: string
}

export interface Budget {
  id: string
  category: CategoryType
  amount: number
  month: string
}

export interface SavingsGoal {
  id: string
  title: string
  target: number
  current: number
  deadline?: string
  description?: string
}

export interface FamilyMember {
  id: string
  name: string
  avatar?: string
}

export interface ExpenseContextType {
  expenses: Expense[]
  budgets: Budget[]
  savingsGoals: SavingsGoal[]
  familyMembers: FamilyMember[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  deleteExpense: (id: string) => void
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void
  addBudget: (budget: Omit<Budget, 'id'>) => void
  deleteBudget: (id: string) => void
  updateBudget: (id: string, budget: Omit<Budget, 'id'>) => void
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void
  deleteSavingsGoal: (id: string) => void
  updateSavingsGoal: (id: string, goal: Omit<SavingsGoal, 'id'>) => void
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void
  deleteFamilyMember: (id: string) => void
  getTotalByCategory: () => Record<CategoryType, number>
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[]
  getMonthlyBudget: () => number
  getTotalExpensesForMonth: (month: string) => number
}