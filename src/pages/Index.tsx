import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  PlusCircle,
  DollarSign,
  TrendingUp,
  FileText,
  Target,
  Zap,
  LogOut,
  User,
} from "lucide-react";
import DashboardOverview from "@/components/DashboardOverview";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import ExpenseTracker from "@/components/ExpenseTracker";
import GoalTracker from "@/components/GoalTracker";
import BusinessCard from "@/components/BusinessCard";
import { useAuth } from "@/components/auth/AuthContext";

const Index = () => {
  const { user, logout } = useAuth();
  const { currency } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userData, setUserData] = useState({
    name: "Triumph Anya-Nga",
    business: "OF D S0UTH CTO/CEO",
    monthlyGoal: 100000000,
    currentEarnings: 1500000,
    totalInvoices: 1000,
    paidInvoices: 920,
    plan: "free" as "free" | "pro",
  });

  // Update user data when auth user changes
  useEffect(() => {
    if (user) {
      setUserData({
        name: `${user.firstName} ${user.lastName}`,
        business: user.businessName,
        monthlyGoal: 5000,
        currentEarnings: 3200,
        totalInvoices: 12,
        paidInvoices: 10,
        plan: user.plan,
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg p-2">
                <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  SageSync
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  Financial Management for Creators
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-4">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs sm:text-sm"
                >
                  {userData.plan === "pro" ? "Pro Plan" : "Free Plan"}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
                >
                  {currency.code} ({currency.symbol})
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[120px] lg:max-w-none">
                    {userData.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px] lg:max-w-none">
                    {userData.business}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleProfileClick}
                  className="text-gray-600 hover:text-gray-900 p-2 sm:p-2"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 p-2 sm:p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="flex w-full overflow-x-auto space-x-1 sm:space-x-2 lg:space-x-4 p-1">
            <TabsTrigger
              value="dashboard"
              className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-w-fit"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </TabsTrigger>
            <TabsTrigger
              value="invoices"
              className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-w-fit"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Invoices</span>
              <span className="sm:hidden">Inv</span>
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-w-fit"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Expenses</span>
              <span className="sm:hidden">Exp</span>
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-w-fit"
            >
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Goals</span>
              <span className="sm:hidden">Goals</span>
            </TabsTrigger>
            <TabsTrigger
              value="business-card"
              className="flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap min-w-fit"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Business Card</span>
              <span className="sm:hidden">Card</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview
              user={userData}
              isPro={userData.plan === "pro"}
            />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-6">
            <InvoiceGenerator />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-6">
            <ExpenseTracker isPro={userData.plan === "pro"} />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalTracker user={userData} isPro={userData.plan === "pro"} />
          </TabsContent>

          <TabsContent value="business-card" className="space-y-6">
            <BusinessCard user={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
