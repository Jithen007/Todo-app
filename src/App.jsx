import { useState, useRef, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const palette = {
  bg: "#F7F5F0",
  surface: "#FFFFFF",
  ink: "#2B2622",
  muted: "#8A8378",
  border: "#E2DDD3",
  accent: "#3F6C51",
  accentSoft: "#E7EFE9",
  danger: "#A13D2C",
};

let nextId = 4;

export default function TodoApp() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Sketch the layout on paper", done: true },
    { id: 2, text: "Wire up add / edit / delete", done: false },
    { id: 3, text: "Ship it and write notes", done: false },
  ]);

  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const remaining = tasks.filter((t) => !t.done).length;

  function addTask() {
    const text = draft.trim();

    if (!text) return;

    setTasks((prev) => [
      ...prev,
      {
        id: nextId++,
        text,
        done: false,
      },
    ]);

    setDraft("");
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, done: !t.done }
          : t
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) =>
      prev.filter((t) => t.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditDraft(task.text);
  }

  function commitEdit() {
    const text = editDraft.trim();

    if (!text) {
      deleteTask(editingId);
      return;
    }

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingId
          ? { ...t, text }
          : t
      )
    );

    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
  }

  function clearCompleted() {
    setTasks((prev) =>
      prev.filter((t) => !t.done)
    );
  }

  const today = new Date().toLocaleDateString(
    undefined,
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: palette.bg,
        color: palette.ink,
        fontFamily:
          "Georgia, 'Iowan Old Style', 'Palatino Linotype', serif",
        display: "flex",
        justifyContent: "center",
        padding: "48px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
        }}
      >
        <header style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 30,
              fontWeight: 400,
              letterSpacing: "0.01em",
              margin: 0,
            }}
          >
            Field log
          </h1>

          <p
            style={{
              margin: "4px 0 0",
              color: palette.muted,
              fontSize: 14,
              fontFamily:
                "ui-monospace, 'SF Mono', Menlo, monospace",
            }}
          >
            {today} · {remaining} open
          </p>
        </header>

        {/* Add Task */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <input
            value={draft}
            onChange={(e) =>
              setDraft(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask();
              }
            }}
            placeholder="Log a new task..."
            style={{
              flex: 1,
              padding: "10px 12px",
              fontSize: 15,
              fontFamily: "inherit",
              border: `1px solid ${palette.border}`,
              borderRadius: 4,
              background: palette.surface,
              color: palette.ink,
              outline: "none",
            }}
          />

          <button
            onClick={addTask}
            aria-label="Add task"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 16px",
              fontSize: 14,
              fontFamily: "inherit",
              border: `1px solid ${palette.accent}`,
              borderRadius: 4,
              background: palette.accent,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        {/* Task List */}
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            border: `1px solid ${palette.border}`,
            borderRadius: 6,
            background: palette.surface,
            overflow: "hidden",
          }}
        >
          {tasks.length === 0 && (
            <li
              style={{
                padding: "28px 16px",
                textAlign: "center",
                color: palette.muted,
                fontSize: 14,
              }}
            >
              Nothing logged. Add your first task above.
            </li>
          )}

          {tasks.map((task, i) => {
            const isEditing = editingId === task.id;

            return (
              <li
                key={task.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderTop:
                    i === 0
                      ? "none"
                      : `1px solid ${palette.border}`,
                }}
              >
                <span
                  style={{
                    fontFamily:
                      "ui-monospace, 'SF Mono', Menlo, monospace",
                    fontSize: 12,
                    color: palette.muted,
                    width: 20,
                    flexShrink: 0,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Complete Button */}
                <button
                  onClick={() =>
                    toggleTask(task.id)
                  }
                  aria-label={
                    task.done
                      ? "Mark as not done"
                      : "Mark as done"
                  }
                  style={{
                    width: 20,
                    height: 20,
                    flexShrink: 0,
                    borderRadius: 4,
                    border: `1px solid ${
                      task.done
                        ? palette.accent
                        : palette.border
                    }`,
                    background: task.done
                      ? palette.accent
                      : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {task.done && (
                    <Check
                      size={13}
                      color="#fff"
                    />
                  )}
                </button>

                {/* Edit Input / Task Text */}
                {isEditing ? (
                  <input
                    ref={editInputRef}
                    value={editDraft}
                    onChange={(e) =>
                      setEditDraft(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        commitEdit();
                      }

                      if (e.key === "Escape") {
                        cancelEdit();
                      }
                    }}
                    onBlur={commitEdit}
                    style={{
                      flex: 1,
                      fontSize: 15,
                      fontFamily: "inherit",
                      border: `1px solid ${palette.accent}`,
                      borderRadius: 4,
                      padding: "6px 8px",
                      outline: "none",
                    }}
                  />
                ) : (
                  <span
                    onDoubleClick={() =>
                      startEdit(task)
                    }
                    style={{
                      flex: 1,
                      fontSize: 15,
                      color: task.done
                        ? palette.muted
                        : palette.ink,
                      textDecoration: task.done
                        ? "line-through"
                        : "none",
                      cursor: "text",
                    }}
                  >
                    {task.text}
                  </span>
                )}

                {/* Edit / Cancel */}
                {isEditing ? (
                  <button
                    onClick={cancelEdit}
                    aria-label="Cancel edit"
                    style={iconButtonStyle}
                  >
                    <X
                      size={16}
                      color={palette.muted}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      startEdit(task)
                    }
                    aria-label="Edit task"
                    style={iconButtonStyle}
                  >
                    <Pencil
                      size={15}
                      color={palette.muted}
                    />
                  </button>
                )}

                {/* Delete */}
                <button
                  onClick={() =>
                    deleteTask(task.id)
                  }
                  aria-label="Delete task"
                  style={iconButtonStyle}
                >
                  <Trash2
                    size={15}
                    color={palette.danger}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Clear Completed */}
        {tasks.some((t) => t.done) && (
          <div
            style={{
              textAlign: "right",
              marginTop: 12,
            }}
          >
            <button
              onClick={clearCompleted}
              style={{
                border: "none",
                background: "none",
                color: palette.muted,
                fontSize: 13,
                fontFamily: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
              }}
            >
              Clear completed
            </button>
          </div>
        )}

        <p
          style={{
            marginTop: 24,
            fontSize: 12,
            color: palette.muted,
            fontFamily:
              "ui-monospace, 'SF Mono', Menlo, monospace",
          }}
        >
          Double-click a task to edit · Enter to save · Esc to cancel
        </p>
      </div>
    </div>
  );
}

const iconButtonStyle = {
  border: "none",
  background: "none",
  cursor: "pointer",
  padding: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};