import React, { createContext, useContext, useState, useEffect } from 'react'
import { Expense, ExpenseContextType, CategoryType } from '../types'

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Load expenses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('expenses')
    if (saved) {
      try {
        setExpenses(JSON.parse(saved))
      } catch (error) {
        console.error('Failed to load expenses:', error)
      }
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

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

  const getTotalByCategory = (): Record<CategoryType, number> => {
    const categories: CategoryType[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Healthcare', 'Education', 'Other']
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

  const value: ExpenseContextType = {
    expenses,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalByCategory,
    getExpensesByDateRange,
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
