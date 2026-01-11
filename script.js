class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderTasks();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Форма добавления
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        // Фильтры
        document.querySelectorAll('.filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderTasks();
            });
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const priority = document.getElementById('prioritySelect').value;
        
        if (input.value.trim()) {
            const task = {
                id: Date.now(),
                text: input.value.trim(),
                priority: priority,
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            this.tasks.push(task);
            this.saveTasks();
            this.renderTasks();
            input.value = '';
        }
    }

    toggleTask(id) {
        this.tasks = this.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(id) {
        if (confirm('Удалить задачу?')) {
            this.tasks = this.tasks.filter(task => task.id !== id);
            this.saveTasks();
            this.renderTasks();
        }
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    renderTasks() {
        const container = document.getElementById('tasksContainer');
        
        let filteredTasks = this.tasks;
        if (this.currentFilter === 'active') {
            filteredTasks = this.tasks.filter(t => !t.completed);
        } else if (this.currentFilter === 'completed') {
            filteredTasks = this.tasks.filter(t => t.completed);
        }

        if (filteredTasks.length === 0) {
            container.innerHTML = '<li class="task placeholder">Задачи не найдены</li>';
            return;
        }

        container.innerHTML = filteredTasks.map(task => `
            <li class="task ${task.completed ? 'completed' : ''} ${task.priority}">
                <div>
                    <span class="task-text">${task.text}</span>
                    <small>Приоритет: ${task.priority}</small>
                </div>
                <div class="actions">
                    <button onclick="taskManager.toggleTask(${task.id})">
                        ${task.completed ? '↩️ Возобновить' : '✅ Выполнить'}
                    </button>
                    <button onclick="taskManager.deleteTask(${task.id})">🗑️ Удалить</button>
                </div>
            </li>
        `).join('');
    }
}

// Инициализация при загрузке
let taskManager;
document.addEventListener('DOMContentLoaded', () => {
    taskManager = new TaskManager();
});
