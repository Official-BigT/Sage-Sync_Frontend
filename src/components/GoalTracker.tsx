import React, { useState } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";
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
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Award,
  Zap,
} from "lucide-react";

interface GoalTrackerProps {
  user: {
    name: string;
    business: string;
    monthlyGoal: number;
    currentEarnings: number;
    totalInvoices: number;
    paidInvoices: number;
    plan?: "free" | "pro";
  };
  isPro?: boolean;
}

interface Goal {
  id: number;
  title: string;
  target: number;
  current: number;
  deadline: string;
  type: "revenue" | "clients" | "invoices";
  status: "active" | "completed" | "overdue";
}

const GoalTracker: React.FC<GoalTrackerProps> = ({ user, isPro = false }) => {
  const { formatCurrency } = useCurrency();

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Monthly Revenue Target",
      target: user.monthlyGoal,
      current: user.currentEarnings,
      deadline: "2024-01-31",
      type: "revenue",
      status: "active",
    },
    {
      id: 2,
      title: "New Clients This Quarter",
      target: 10,
      current: 7,
      deadline: "2024-03-31",
      type: "clients",
      status: "active",
    },
    {
      id: 3,
      title: "Invoices Sent This Month",
      target: 15,
      current: user.totalInvoices,
      deadline: "2024-01-31",
      type: "invoices",
      status: "active",
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    deadline: "",
    type: "revenue" as "revenue" | "clients" | "invoices",
  });

  const addGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now(),
        title: newGoal.title,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline,
        type: newGoal.type,
        status: "active",
      };
      setGoals([...goals, goal]);
      setNewGoal({
        title: "",
        target: "",
        deadline: "",
        type: "revenue",
      });
    }
  };

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return <DollarSign className="h-4 w-4" />;
      case "clients":
        return <Target className="h-4 w-4" />;
      case "invoices":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500";
      case "overdue":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 100) return "🎉 Goal achieved! You're crushing it!";
    if (progress >= 80) return "🔥 So close! Keep pushing!";
    if (progress >= 60) return "💪 Great progress! You're on track!";
    if (progress >= 40) return "📈 Steady progress! Keep it up!";
    if (progress >= 20) return "🚀 Good start! Build that momentum!";
    return "🎯 Let's get started! Every step counts!";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Goal Tracker</h2>
          <p className="text-gray-500">
            Set and track your business milestones
          </p>
        </div>
        <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Target className="h-4 w-4" />
          Set New Goal
        </Button>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isPro && (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4">
              <p className="text-sm">
                AI Performance Insights are available on the Pro plan. Upgrade
                to unlock predictive analytics and suggestions.
              </p>
            </div>
          )}
          {isPro && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">28%</div>
                  <p className="text-sm text-gray-600">Above last month</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    12 days
                  </div>
                  <p className="text-sm text-gray-600">To monthly goal</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    $1,800
                  </div>
                  <p className="text-sm text-gray-600">Still needed</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <p className="text-sm text-blue-900">
                  💡 <strong>Smart Suggestion:</strong> Based on your current
                  pace, you'll exceed your monthly goal by 5%. Consider
                  increasing your target for next month!
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goals List */}
        <div className="lg:col-span-2 space-y-4">
          {goals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const daysRemaining = getDaysRemaining(goal.deadline);

            return (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${getStatusColor(
                          goal.status
                        )} text-white`}
                      >
                        {getGoalIcon(goal.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{goal.title}</CardTitle>
                        <CardDescription>
                          {goal.type === "revenue"
                            ? formatCurrency(goal.current)
                            : (goal.current ?? 0).toLocaleString()}{" "}
                          of{" "}
                          {goal.type === "revenue"
                            ? formatCurrency(goal.target)
                            : (goal.target ?? 0).toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          daysRemaining > 7
                            ? "default"
                            : daysRemaining > 0
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {daysRemaining > 0
                          ? `${daysRemaining} days left`
                          : "Overdue"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">
                        {(progress || 0).toFixed(0)}%
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-3" />
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      {getMotivationalMessage(progress)}
                    </p>
                  </div>

                  {progress >= 100 && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Goal Completed!
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Goal & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set New Goal</CardTitle>
              <CardDescription>Create a new milestone to track</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="goalTitle">Goal Title</Label>
                <Input
                  id="goalTitle"
                  placeholder="e.g., Reach $10k revenue"
                  value={newGoal.title}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, title: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="goalTarget">Target Value</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  placeholder="e.g., 10000"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="goalDeadline">Deadline</Label>
                <Input
                  id="goalDeadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, deadline: e.target.value })
                  }
                />
              </div>

              <Button onClick={addGoal} className="w-full">
                Create Goal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Achievement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Goals Completed</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Goals</span>
                <Badge>
                  {goals.filter((g) => g.status === "active").length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <Badge variant="outline" className="text-emerald-600">
                  85%
                </Badge>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">🏆</div>
                  <p className="text-sm font-medium mt-1">Goal Crusher</p>
                  <p className="text-xs text-gray-500">
                    Keep up the great work!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalTracker;
