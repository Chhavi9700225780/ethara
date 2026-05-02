import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2, Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  dueDate?: string;
  assignedTo: { _id: string; name: string }[]; // ✅ MULTI USER
  project: { _id: string; title: string };
}

interface User {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  title: string;
}

export function Tasks() {
  const { user, isAdmin } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[], // ✅ ARRAY
    project: '',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tasksData, usersData, projectsData] = await Promise.all([
        api.getTasks(),
        isAdmin ? api.getUsers() : Promise.resolve([]),
        api.getProjects(),
      ]);

      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD USER
  const handleAddUser = (id: string) => {
    if (!newTask.assignedTo.includes(id)) {
      setNewTask({
        ...newTask,
        assignedTo: [...newTask.assignedTo, id],
      });
    }
  };

  // ✅ REMOVE USER
  const removeUser = (id: string) => {
    setNewTask({
      ...newTask,
      assignedTo: newTask.assignedTo.filter((u) => u !== id),
    });
  };

  // ✅ CREATE
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.project || newTask.assignedTo.length === 0) {
      toast.error('Select users & project');
      return;
    }

    try {
      await api.createTask(newTask);
      toast.success('Task created');

      setDialogOpen(false);
      setNewTask({
        title: '',
        description: '',
        assignedTo: [],
        project: '',
        priority: 'medium',
        dueDate: '',
      });

      loadData();
    } catch {
      toast.error('Failed');
    }
  };

  // ✅ DELETE
  const handleDelete = async (id: string) => {
    if (!confirm('Delete task?')) return;
    await api.deleteTask(id);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  // ✅ STATUS UPDATE
  const handleStatus = async (id: string, status: string) => {
    await api.updateTask(id, { status });
    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status } : t))
    );
  };

  // ✅ FILTER
  const filteredTasks = tasks
    .filter((t) =>
      isAdmin
        ? true
        : t.assignedTo.some((u) => u._id === user?.id)
    )
    .filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((t) =>
      filterStatus === 'all' ? true : t.status === filterStatus
    );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Tasks</h2>

        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} /> Create Task
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateTask} className="space-y-3">

                <Input
                  placeholder="Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />

                <Textarea
                  placeholder="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />

                {/* MULTI USER */}
                <Select onValueChange={handleAddUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add users" />
                  </SelectTrigger>

                  <SelectContent>
                    {users.map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex gap-2 flex-wrap">
                  {newTask.assignedTo.map((id) => {
                    const u = users.find((x) => x._id === id);
                    return (
                      <Badge key={id} onClick={() => removeUser(id)}>
                        {u?.name} ✕
                      </Badge>
                    );
                  })}
                </div>

                {/* PROJECT */}
                <Select
                  value={newTask.project}
                  onValueChange={(v) =>
                    setNewTask({ ...newTask, project: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Project" />
                  </SelectTrigger>

                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* PRIORITY */}
                <Select
                  value={newTask.priority}
                  onValueChange={(v) =>
                    setNewTask({ ...newTask, priority: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                {/* DUE DATE */}
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />

                <Button type="submit">Create</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* FILTER */}
      <div className="flex gap-2">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => {
          setSearchQuery('');
          setFilterStatus('all');
        }}>
          <X size={14} />
        </Button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        filteredTasks.map((task) => (
          <Card key={task._id}>
            <CardHeader className="flex justify-between">
              <CardTitle>{task.title}</CardTitle>

              <div className="flex gap-2">
                <Badge>{task.status}</Badge>
                {task.priority && <Badge>{task.priority}</Badge>}

                {isAdmin && (
                  <Button onClick={() => handleDelete(task._id)}>
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent>
              <p>{task.description}</p>

              <p className="text-sm">
                Assigned: {task.assignedTo.map(u => u.name).join(', ')}
              </p>

              <p className="text-sm">
                Project: {task.project.title}
              </p>

              {task.dueDate && (
                <p className="text-sm">
                  Due: {format(new Date(task.dueDate), 'dd MMM yyyy')}
                </p>
              )}

              <Select
                value={task.status}
                onValueChange={(v) => handleStatus(task._id, v)}
              >
                <SelectTrigger className="w-40 mt-2">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}