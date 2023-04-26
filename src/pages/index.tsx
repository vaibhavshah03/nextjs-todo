import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
import clsx from "clsx";

type ITodo = {
  id: string;
  text: string;
  completed: boolean;
  edit: boolean;
};

type Filters = {
  showCompleted: boolean;
  showRemaining: boolean;
  search: string;
};
const mockTodo = [
  {
    id: "2023-03-30T14:37:00.595Z",
    text: "helllllo",
    completed: false,
    edit: false,
  },
  {
    id: "2023-03-30T14:37:01.795Z",
    text: "guuu",
    completed: false,
    edit: false,
  },
  {
    id: "2023-03-30T14:37:02.874Z",
    text: "gdgsyfgud",
    completed: false,
    edit: false,
  },
  {
    id: "2023-03-30T14:37:03.833Z",
    text: "jfsdgtt",
    completed: false,
    edit: false,
  },
];
export default function Home() {
  const [todo, setTodo] = useState<ITodo[]>(mockTodo);
  const [todoText, setTodoText] = useState("");
  const [editTodoText, setEditTodoText] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    showCompleted: false,
    showRemaining: false,
    search: "",
  });

  const handleAddTodo = useCallback(() => {
    const data = todo.find(
      (item) => item.text.toLowerCase() === todoText.toLowerCase()
    );
    if (!data) {
      setTodo((prev) => [
        ...prev,
        {
          id: new Date().toISOString(),
          text: todoText,
          completed: false,
          edit: false,
        },
      ]);
      setTodoText("");
    } else {
      window.alert("Todo Added already!");
    }
  }, [todoText]);

  const handleUpdateTodoText = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Enter") {
      handleAddTodo();
    } else if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Escape") {
      setTodoText("");
    } else {
      setTodoText((e as React.ChangeEvent<HTMLInputElement>).target.value);
    }
  };

  const handleToggle = (id: string) => {
    setTodo((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: string) => {
    setTodo((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleFilter = (key: keyof Filters, value: boolean | string) => {
    switch (key) {
      case "showCompleted":
        setFilters((prev) => ({ ...prev, [key]: value as boolean }));
        break;
      case "showRemaining":
        setFilters((prev) => ({ ...prev, [key]: value as boolean }));
        break;
      case "search":
        setFilters((prev) => ({ ...prev, [key]: value as string }));
        break;
      default:
        break;
    }
  };

  const displayTodo = useMemo(() => {
    if (filters.showCompleted) {
      return todo.filter((todo) => todo.completed);
    }
    if (filters.showRemaining) {
      return todo.filter((todo) => !todo.completed);
    }
    if (filters.search) {
      return todo.filter((todo) =>
        todo.text.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    return todo;
  }, [filters, todo]);

  const editTodo = (id: string) => {
    const data = todo.find((item) => {
      if (item.id !== id) {
        return item.text.toLowerCase() === editTodoText.toLowerCase();
      }
    });
    console.log({ editTodoText, todo });
    if (!data) {
      setTodo((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, text: editTodoText, edit: false } : todo
        )
      );
      setEditTodoText("");
    } else {
      window.alert("Todo Added already!");
    }
  };

  const handleEditMode = (id: string, text: string) => {
    setTodo((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, edit: !todo.edit } : todo
      )
    );
    setEditTodoText(text);
  };

  const handleEditTodoText = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLInputElement>,
    id: string
  ) => {
    if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Enter") {
      editTodo(id);
    } else if ((e as React.KeyboardEvent<HTMLInputElement>).key === "Escape") {
      setEditTodoText("");
    } else {
      setEditTodoText((e as React.ChangeEvent<HTMLInputElement>).target.value);
    }
  };

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <header className="p-4 bg-blue-500 flex justify-center">
          <h1 className="text-2xl font-bold text-white">Todo App</h1>
        </header>

        <section className="mt-10">
          <div className="flex w-full justify-center items-center">
            <section
              className={clsx(
                "border w-full max-w-7xl py-4 px-6 border-gray-200 rounded-lg shadow-md",
                "flex items-center justify-between flex-row "
              )}
            >
              <input
                className="w-full max-w-4xl outline-none"
                type="text"
                value={todoText}
                onKeyDown={handleUpdateTodoText}
                onChange={handleUpdateTodoText}
                placeholder="Enter Your Todo Here!"
              />
              <button
                className={clsx(
                  "py-1 px-2.5 border rounded-full text-white bg-blue-600",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={!todoText}
                onClick={handleAddTodo}
              >
                +
              </button>
            </section>
          </div>
          {!!todo.length && (
            <section className="mt-14 w-full flex justify-center items-center ">
              <div className="w-full max-w-5xl flex flex-row justify-between space-x-6">
                <input
                  className="text outline-none border w-64 border-gray-200 shadow-md p-1"
                  value={filters.search}
                  placeholder="Search..."
                  onChange={(e) => handleFilter("search", e.target.value)}
                />
                <div>
                  <div className="flex flex-row space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={filters.showRemaining}
                      onChange={(e) =>
                        handleFilter("showRemaining", e.target.checked)
                      }
                    />
                    <span>Show remaining</span>
                  </div>
                  <div className="flex flex-row space-x-3">
                    <input
                      type="checkbox"
                      defaultChecked={filters.showCompleted}
                      onChange={(e) =>
                        handleFilter("showCompleted", e.target.checked)
                      }
                    />
                    <span>Show Completed</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="mt-4 flex flex-col space-y-2 justify-center items-center">
            {todo.length ? (
              displayTodo.map((item, idx) => (
                <div
                  key={item.id}
                  className={clsx(
                    "border w-full max-w-5xl border-gray-200 shadow-lg p-2",
                    "flex flex-row  items-center space-x-4 justify-between"
                  )}
                >
                  <div>
                    <input
                      className="m-2"
                      type="checkbox"
                      onChange={() => handleToggle(item.id)}
                      checked={item.completed}
                    ></input>
                    <span>{idx + 1}.</span>
                    {item.edit ? (
                      <input
                        autoFocus
                        onKeyDown={(e) => handleEditTodoText(e, item.id)}
                        onChange={(e) => handleEditTodoText(e, item.id)}
                        className={clsx(
                          "font-semibold text-xl m-2 outline-none"
                        )}
                        value={editTodoText}
                      />
                    ) : (
                      <span
                        className={clsx(
                          "font-semibold text-xl m-2 outline-none",
                          { "line-through": item.completed }
                        )}
                      >
                        {item.text}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    {item.edit ? (
                      <button
                        className={clsx(
                          "py-1 px-2.5 border rounded-full text-white bg-yellow-400"
                        )}
                        onClick={() => editTodo(item.id)}
                      >
                        +
                      </button>
                    ) : (
                      <button
                        className={clsx(
                          "py-1 px-2.5 border rounded-full text-white bg-yellow-400"
                        )}
                        onClick={(e) => handleEditMode(item.id, item.text)}
                      >
                        -
                      </button>
                    )}

                    <button
                      disabled={!item.completed}
                      className={clsx(
                        "py-1 px-2.5 border rounded-full text-white bg-blue-600",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                      onClick={() => removeTodo(item.id)}
                    >
                      X
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-3xl mt-10 text-gray-800 font-bold">
                Nothing to do Today!!
              </div>
            )}
          </section>
          <br></br>
          <div></div>
        </section>
      </main>
    </>
  );
}
