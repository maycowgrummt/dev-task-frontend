import { useState, useEffect } from 'react';
import { Trash2, PlusCircle, CheckCircle2, Circle, ListTodo, ShoppingCart, Calendar, Plane, CheckSquare, Briefcase, GraduationCap } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface CategoriesData {
  [key: string]: Task[];
}

const TABS = [
  { id: 'compras', label: 'Lista de Compras', icon: ShoppingCart },
  { id: 'rotina', label: 'Rotina Diária', icon: Calendar },
  { id: 'viagem', label: 'Checklist de Viagem', icon: Plane },
  { id: 'tarefas', label: 'Checklist de Tarefas', icon: CheckSquare },
  { id: 'trabalho', label: 'Checklist de Trabalho', icon: Briefcase },
  { id: 'estudo', label: 'Checklist de Estudo', icon: GraduationCap },
];

export default function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  // Estado para armazenar as tarefas separadas por cada aba/categoria
  const [tasksByTab, setTasksByTab] = useState<CategoriesData>(() => {
    const saved = localStorage.getItem('@DevTaskManager:tabs_v1');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      compras: [{ id: '1', title: 'Comprar café e leite', completed: false }],
      rotina: [{ id: '2', title: 'Meditar por 10 minutos', completed: true }],
      viagem: [],
      tarefas: [{ id: '3', title: 'Organizar a área de trabalho', completed: false }],
      trabalho: [{ id: '4', title: 'Atualizar relatório de turnos', completed: false }],
      estudo: [{ id: '5', title: 'Praticar conceitos de React e TypeScript', completed: false }],
    };
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('@DevTaskManager:tabs_v1', JSON.stringify(tasksByTab));
  }, [tasksByTab]);

  const currentTasks = tasksByTab[activeTab] || [];

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: String(new Date().getTime()),
      title: newTaskTitle,
      completed: false,
    };

    setTasksByTab({
      ...tasksByTab,
      [activeTab]: [...currentTasks, newTask]
    });
    setNewTaskTitle('');
  }

  function handleToggleTask(id: string) {
    const updated = currentTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasksByTab({
      ...tasksByTab,
      [activeTab]: updated
    });
  }

  function handleDeleteTask(id: string) {
    const updated = currentTasks.filter(task => task.id !== id);
    setTasksByTab({
      ...tasksByTab,
      [activeTab]: updated
    });
  }

  const totalTasks = currentTasks.length;
  const completedTasks = currentTasks.filter(task => task.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTasks = currentTasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const activeTabData = TABS.find(t => t.id === activeTab);
  const ActiveIcon = activeTabData ? activeTabData.icon : ListTodo;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700">
        
        {/* Cabeçalho */}
        <header className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
          <ListTodo className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="text-2xl font-bold tracking-wide">Organizador de Tarefas 🗓️</h1>
            <p className="text-xs text-slate-400">Sistema Multi-Módulos de Produtividade</p>
          </div>
        </header>

        {/* Barra de Abas (Navegação Superior) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {TABS.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;
            const count = (tasksByTab[tab.id] || []).length;
            const completedCount = (tasksByTab[tab.id] || []).filter(t => t.completed).length;

            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setFilter('all'); }}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg' 
                    : 'bg-slate-900/50 border-slate-700/60 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-medium truncate">{tab.label}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${isSelected ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>
                  {completedCount}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Área Ativa da Aba */}
        <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-5">
          
          <div className="flex items-center gap-2 mb-4">
            <ActiveIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">{activeTabData?.label}</h2>
          </div>

          {/* Barra de Progresso Dinâmica da Aba */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg p-3.5 mb-5">
            <div className="flex justify-between items-center mb-1.5 text-xs">
              <span className="text-slate-300 font-medium">Progresso do Módulo</span>
              <span className="text-emerald-400 font-bold">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
              <span>{completedTasks} de {totalTasks} concluídas</span>
            </div>
          </div>

          {/* Formulário de Criação para a Aba Atual */}
          <form onSubmit={handleCreateTask} className="flex gap-2 mb-5">
            <input
              type="text"
              placeholder={`Adicionar nova tarefa em ${activeTabData?.label}...`}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition flex items-center justify-center cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </form>

          {/* Abas de Filtro por Status (Todas, Pendentes, Concluídas) */}
          <div className="flex gap-1 bg-slate-950 p-1 rounded-lg mb-4 border border-slate-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Todas ({totalTasks})
            </button>
            <button
              type="button"
              onClick={() => setFilter('pending')}
              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${filter === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Pendentes ({totalTasks - completedTasks})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${filter === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Concluídas ({completedTasks})
            </button>
          </div>

          {/* Lista de Tarefas da Aba */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {filteredTasks.length === 0 ? (
              <p className="text-center text-slate-500 text-sm py-6">Nenhuma tarefa encontrada nesta aba.</p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-lg hover:border-slate-700 transition"
                >
                  <div 
                    onClick={() => handleToggleTask(task.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 mr-2 overflow-hidden"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                    <span className={`text-sm truncate ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}