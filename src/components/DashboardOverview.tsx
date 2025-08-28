
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText, TrendingUp, CheckCircle, Clock, AlertCircle } from "lucide-react";

interface DashboardOverviewProps {
  user: {
    name: string;
    business: string;
    monthlyGoal: number;
    currentEarnings: number;
    totalInvoices: number;
    paidInvoices: number;
  };
}

const DashboardOverview = ({ user }: DashboardOverviewProps) => {
  const goalProgress = (user.currentEarnings / user.monthlyGoal) * 100;
  const unpaidInvoices = user.totalInvoices - user.paidInvoices;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-xl p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
        <p className="text-sm sm:text-base text-blue-100">Here's what's happening with your finances today.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${user.currentEarnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mb-2">
              of ${user.monthlyGoal.toLocaleString()} goal
            </div>
            <Progress value={goalProgress} className="h-2" />
            <p className="text-xs text-emerald-600 mt-1">
              {goalProgress.toFixed(0)}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{user.paidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {((user.paidInvoices / user.totalInvoices) * 100).toFixed(0)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unpaidInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest financial activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 rounded-full p-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Invoice #001 paid</p>
                <p className="text-xs text-muted-foreground">$750 • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New invoice created</p>
                <p className="text-xs text-muted-foreground">$1,200 • 1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 rounded-full p-2">
                <DollarSign className="h-4 w-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Expense recorded</p>
                <p className="text-xs text-muted-foreground">$45 office supplies • 2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Smart recommendations for your business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Revenue Growth</p>
                  <p className="text-xs text-blue-700">You're 28% ahead of last month! Keep up the great work.</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Payment Reminder</p>
                  <p className="text-xs text-orange-700">2 invoices are overdue. Consider sending follow-up emails.</p>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-900">Tax Preparation</p>
                  <p className="text-xs text-emerald-700">Your expenses are well-categorized for tax season!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
