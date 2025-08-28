import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  DollarSign,
  TrendingDown,
  Calendar,
  Filter,
  Download,
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: "business" | "personal";
  recurring: boolean;
}

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      description: "Office supplies",
      amount: 45.5,
      category: "Office",
      date: "2024-01-15",
      type: "business",
      recurring: false,
    },
    {
      id: 2,
      description: "Software subscription",
      amount: 29.99,
      category: "Software",
      date: "2024-01-14",
      type: "business",
      recurring: true,
    },
    {
      id: 3,
      description: "Internet bill",
      amount: 89.99,
      category: "Utilities",
      date: "2024-01-13",
      type: "business",
      recurring: true,
    },
    {
      id: 4,
      description: "Client lunch",
      amount: 65.0,
      category: "Meals",
      date: "2024-01-12",
      type: "business",
      recurring: false,
    },
    {
      id: 5,
      description: "Gas",
      amount: 40.0,
      category: "Transport",
      date: "2024-01-11",
      type: "personal",
      recurring: false,
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    type: "business" as "business" | "personal",
    recurring: false,
  });

  const [filter, setFilter] = useState("all");

  const categories = [
    "Office",
    "Software",
    "Utilities",
    "Meals",
    "Transport",
    "Marketing",
    "Equipment",
    "Professional Services",
    "Other",
  ];

  const addExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.category) {
      const expense: Expense = {
        id: Date.now(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
        type: newExpense.type,
        recurring: newExpense.recurring,
      };
      setExpenses([expense, ...expenses]);
      setNewExpense({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        type: "business",
        recurring: false,
      });
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    if (filter === "all") return true;
    return expense.type === filter;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const businessExpenses = expenses
    .filter((e) => e.type === "business")
    .reduce((sum, e) => sum + e.amount, 0);
  const personalExpenses = expenses
    .filter((e) => e.type === "personal")
    .reduce((sum, e) => sum + e.amount, 0);

  // AI-powered expense categorization suggestions
  const getAISuggestion = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("office") || desc.includes("supplies")) return "Office";
    if (
      desc.includes("software") ||
      desc.includes("app") ||
      desc.includes("subscription")
    )
      return "Software";
    if (
      desc.includes("internet") ||
      desc.includes("phone") ||
      desc.includes("electricity")
    )
      return "Utilities";
    if (
      desc.includes("lunch") ||
      desc.includes("dinner") ||
      desc.includes("coffee") ||
      desc.includes("meal")
    )
      return "Meals";
    if (
      desc.includes("gas") ||
      desc.includes("uber") ||
      desc.includes("taxi") ||
      desc.includes("transport")
    )
      return "Transport";
    return "";
  };

  const aiSuggestion = getAISuggestion(newExpense.description);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Expense Tracker
          </h2>
          <p className="text-sm sm:text-base text-gray-500">
            Track and categorize your business expenses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
            <span className="sm:hidden">Filter</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Business</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${businessExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Tax deductible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              ${personalExpenses.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Non-deductible</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Expense
            </CardTitle>
            <CardDescription>Record a new expense</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="What did you spend on?"
                value={newExpense.description}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, description: e.target.value })
                }
              />
              {aiSuggestion && (
                <p className="text-xs text-blue-600 mt-1">
                  💡 AI suggests: {aiSuggestion}
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 ml-2 text-xs"
                    onClick={() =>
                      setNewExpense({ ...newExpense, category: aiSuggestion })
                    }
                  >
                    Use this
                  </Button>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newExpense.amount}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, amount: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newExpense.category}
                onValueChange={(value) =>
                  setNewExpense({ ...newExpense, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={newExpense.date}
                onChange={(e) =>
                  setNewExpense({ ...newExpense, date: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={newExpense.type}
                onValueChange={(value: "business" | "personal") =>
                  setNewExpense({ ...newExpense, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={addExpense} className="w-full">
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Expense List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                  className="text-xs sm:text-sm"
                >
                  All
                </Button>
                <Button
                  variant={filter === "business" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("business")}
                  className="text-xs sm:text-sm"
                >
                  Business
                </Button>
                <Button
                  variant={filter === "personal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("personal")}
                  className="text-xs sm:text-sm"
                >
                  Personal
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-gray-50 space-y-2 sm:space-y-0"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-sm sm:text-base">
                          {expense.description}
                        </p>
                        <Badge
                          variant={
                            expense.type === "business"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {expense.type}
                        </Badge>
                        {expense.recurring && (
                          <Badge variant="outline" className="text-xs">
                            Recurring
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        <span>{expense.category}</span>
                        <span>
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-red-600 text-sm sm:text-base">
                        ${expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker;
