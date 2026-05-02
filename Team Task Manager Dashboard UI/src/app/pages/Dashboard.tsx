import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { StatCard } from '../components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  PieChart, Pie, Cell,
  ResponsiveContainer,
  BarChart, Bar,
  XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
  assignedTo: { _id: string; name: string }[]; // ✅ FIXED
  project: { _id: string; title: string };
}

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    await api.updateTask(taskId, { status });

    setTasks(prev =>
      prev.map(t => t._id === taskId ? { ...t, status } : t)
    );
  };

  // ✅ FILTER FIX (MULTI USER)
  const filteredTasks = isAdmin
    ? tasks
    : tasks.filter(task =>
        task.assignedTo.some(u => u._id === user?.id)
      );

  // ✅ STATS (FIX CASE)
  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(t => t.status === 'Completed').length;
  const pendingTasks = filteredTasks.filter(t => t.status === 'Pending').length;
  const overdueTasks = filteredTasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  // ✅ PIE DATA
  const statusData = [
    { name: 'Pending', value: pendingTasks, color: '#fbbf24' },
    { name: 'In Progress', value: filteredTasks.filter(t => t.status === 'In Progress').length, color: '#3b82f6' },
    { name: 'Completed', value: completedTasks, color: '#10b981' },
  ];

  // ✅ PROJECT DATA
  const projectMap: Record<string, number> = {};
  filteredTasks.forEach(t => {
    projectMap[t.project.title] = (projectMap[t.project.title] || 0) + 1;
  });

  const projectData = Object.entries(projectMap).map(([name, tasks]) => ({
    name,
    tasks,
  }));

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-green-100 text-green-800';
    if (status === 'In Progress') return 'bg-blue-100 text-blue-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total Tasks" value={totalTasks} icon={ListTodo} color="bg-blue-500" />
        <StatCard title="Completed" value={completedTasks} icon={CheckCircle2} color="bg-green-500" />
        <StatCard title="Pending" value={pendingTasks} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Overdue" value={overdueTasks} icon={AlertTriangle} color="bg-red-500" />
      </div>

      {/* CHARTS */}
      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-2">

          {/* PIE */}
          <Card>
            <CardHeader>
              <CardTitle>Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value">
                    {statusData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* BAR */}
          <Card>
            <CardHeader>
              <CardTitle>Tasks by Project</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={projectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tasks" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      )}

      {/* RECENT TASKS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : filteredTasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            filteredTasks.slice(0, 5).map(task => (
              <Card key={task._id}>
                <CardContent className="p-4 flex justify-between">

                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600">
                      Assigned: {task.assignedTo.map(u => u.name).join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>

                    <Select
                      value={task.status}
                      onValueChange={(v) => handleStatusChange(task._id, v)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

    </div>
  );
}