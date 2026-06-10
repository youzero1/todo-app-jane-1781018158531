import { useState, useRef, useEffect } from 'react';
import styles from './TodoItem.module.css';
import { Todo } from '@/types';
import { Trash2, Pencil, Check, X, Calendar } from 'lucide-react';
import clsx from 'clsx';

type TodoItemProps = {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
};

function formatDueDate(dateStr: string): { label: string; overdue: boolean; today: boolean } {
  const [year, month, day] = dateStr.split('-').map(Number);
  const due = new Date(year, month - 1, day);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((due.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

  if (diff < 0) {
    return { label: `${Math.abs(diff)}d overdue`, overdue: true, today: false };
  } else if (diff === 0) {
    return { label: 'Due today', overdue: false, today: true };
  } else if (diff === 1) {
    return { label: 'Due tomorrow', overdue: false, today: false };
  } else {
    return {
      label: due.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      overdue: false,
      today: false,
    };
  }
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function handleEditSubmit(): void {
    onEdit(todo.id, editValue);
    setEditing(false);
  }

  function handleEditKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(todo.text);
      setEditing(false);
    }
  }

  function handleStartEdit(): void {
    setEditValue(todo.text);
    setEditing(true);
  }

  function handleCancelEdit(): void {
    setEditValue(todo.text);
    setEditing(false);
  }

  const dueDateInfo = todo.dueDate ? formatDueDate(todo.dueDate) : null;

  return (
    <li className={clsx(styles.item, todo.completed && styles.completed, editing && styles.editing)}>
      {!editing ? (
        <>
          <button
            className={styles.checkbox}
            onClick={() => onToggle(todo.id)}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            <span className={clsx(styles.checkCircle, todo.completed && styles.checkCircleActive)}>
              {todo.completed && <Check size={13} strokeWidth={3} />}
            </span>
          </button>
          <div className={styles.content}>
            <span className={styles.text}>{todo.text}</span>
            {dueDateInfo && (
              <span
                className={clsx(
                  styles.dueDate,
                  dueDateInfo.overdue && !todo.completed && styles.dueDateOverdue,
                  dueDateInfo.today && !todo.completed && styles.dueDateToday
                )}
              >
                <Calendar size={11} />
                {dueDateInfo.label}
              </span>
            )}
          </div>
          <div className={styles.actions}>
            <button
              className={styles.editBtn}
              onClick={handleStartEdit}
              aria-label="Edit todo"
            >
              <Pencil size={15} />
            </button>
            <button
              className={styles.deleteBtn}
              onClick={() => onDelete(todo.id)}
              aria-label="Delete todo"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            ref={inputRef}
            className={styles.editInput}
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
            onKeyDown={handleEditKeyDown}
            onBlur={handleEditSubmit}
          />
          <div className={styles.actions}>
            <button
              className={styles.confirmBtn}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
              onClick={handleEditSubmit}
              aria-label="Confirm edit"
            >
              <Check size={15} />
            </button>
            <button
              className={styles.cancelBtn}
              onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
              onClick={handleCancelEdit}
              aria-label="Cancel edit"
            >
              <X size={15} />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
