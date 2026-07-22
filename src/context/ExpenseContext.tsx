import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  Expense, 
  Budget, 
  SavingsGoal, 
  FamilyMember, 
  ExpenseContextType, 
  CategoryType 
} from '../types'

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

// Default monthly budget
const DEFAULT_MONTHLY_BUDGET = 500000

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    const savedBudgets = localStorage.getItem('budgets')
    const savedSavingsGoals = localStorage.getItem('savingsGoals')
    const savedFamilyMembers = localStorage.getItem('familyMembers')
    
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses))
      } catch (error) {
        console.error('Failed to load expenses:', error)
      }
    }
    
    if (savedBudgets) {
      try {
        setBudgets(JSON.parse(savedBudgets))
      } catch (error) {
        console.error('Failed to load budgets:', error)
      }
    }
    
    if (savedSavingsGoals) {
      try {
        setSavingsGoals(JSON.parse(savedSavingsGoals))
      } catch (error) {
        console.error('Failed to load savings goals:', error)
      }
    }
    
    if (savedFamilyMembers) {
      try {
        setFamilyMembers(JSON.parse(savedFamilyMembers))
      } catch (error) {
        console.error('Failed to load family members:', error)
      }
    }
  }, [])

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])
  
  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])
  
  useEffect(() => {
    localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
  }, [savingsGoals])
  
  useEffect(() => {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers))
  }, [familyMembers])

  // Expense functions
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
    }
    setExpenses([newExpense, ...expenses])
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  const updateExpense = (id: string, expense: Omit<Expense, 'id'>) => {
    setExpenses(expenses.map(e => (e.id === id ? { ...expense, id } : e)))
  }

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = {
      ...budget,
      id: Date.now().toString(),
    }
    setBudgets([newBudget, ...budgets])
  }

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id))
  }

  const updateBudget = (id: string, budget: Omit<Budget, 'id'>) => {
    setBudgets(budgets.map(b => (b.id === id ? { ...budget, id } : b)))
  }

  // Savings goal functions
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: Date.now().toString(),
    }
    setSavingsGoals([newGoal, ...savingsGoals])
  }

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(savingsGoals.filter(g => g.id !== id))
  }

  const updateSavingsGoal = (id: string, goal: Omit<SavingsGoal, 'id'>) => {
    setSavingsGoals(savingsGoals.map(g => (g.id === id ? { ...goal, id } : g)))
  }

  // Family member functions
  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: Date.now().toString(),
    }
    setFamilyMembers([newMember, ...familyMembers])
  }

  const deleteFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter(m => m.id !== id))
  }

  // Helper functions
  const getTotalByCategory = (): Record<CategoryType, number> => {
    const categories: CategoryType[] = ['Food', 'Transport', 'Rent', 'Utilities', 'School', 'Shopping', 'Health', 'Entertainment', 'Other']
    const totals: Record<CategoryType, number> = {} as Record<CategoryType, number>
    categories.forEach(cat => (totals[cat] = 0))

    expenses.forEach(expense => {
      totals[expense.category] += expense.amount
    })

    return totals
  }

  const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
    return expenses.filter(e => e.date >= startDate && e.date <= endDate)
  }

  const getMonthlyBudget = (): number => {
    if (budgets.length === 0) return DEFAULT_MONTHLY_BUDGET
    return budgets.reduce((sum, budget) => sum + budget.amount, 0)
  }

  const getTotalExpensesForMonth = (month: string): number => {
    return expenses
      .filter(expense => expense.date.startsWith(month))
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  const value: ExpenseContextType = {
    expenses,
    budgets,
    savingsGoals,
    familyMembers,
    addExpense,
    deleteExpense,
    updateExpense,
    addBudget,
    deleteBudget,
    updateBudget,
    addSavingsGoal,
    deleteSavingsGoal,
    updateSavingsGoal,
    addFamilyMember,
    deleteFamilyMember,
    getTotalByCategory,
    getExpensesByDateRange,
    getMonthlyBudget,
    getTotalExpensesForMonth,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}

export const useExpenses = () => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider')
  }
  return context
}