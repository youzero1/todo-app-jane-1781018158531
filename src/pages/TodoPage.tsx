import styles from './TodoPage.module.css';
import { useTodos } from '@/hooks/useTodos';
import TodoInput from '@/components/TodoInput';
import TodoList from '@/components/TodoList';
import TodoFooter from '@/components/TodoFooter';
import { CheckSquare } from 'lucide-react';

export default function TodoPage() {
  const {
    filteredTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    toggleAll,
    activeCount,
    completedCount,
  } = useTodos();

  const hasTodos = filteredTodos.length > 0 || activeCount > 0 || completedCount > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <CheckSquare size={32} />
          </div>
          <h1 className={styles.title}>My Todos</h1>
          <p className={styles.subtitle}>Stay organised, get things done.</p>
        </header>

        <main className={styles.main}>
          <TodoInput
            onAdd={addTodo}
            onToggleAll={toggleAll}
            hasTodos={hasTodos}
          />

          {filteredTodos.length > 0 ? (
            <TodoList
              todos={filteredTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✓</span>
              <p className={styles.emptyText}>
                {filter === 'completed'
                  ? 'No completed todos yet.'
                  : filter === 'active'
                  ? 'No active todos — all done!'
                  : 'No todos yet. Add one above!'}
              </p>
            </div>
          )}

          {(activeCount > 0 || completedCount > 0) && (
            <TodoFooter
              activeCount={activeCount}
              completedCount={completedCount}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={clearCompleted}
            />
          )}
        </main>
      </div>
    </div>
  );
}
