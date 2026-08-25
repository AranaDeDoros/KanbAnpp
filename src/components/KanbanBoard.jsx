import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTasks } from "../api/useTasks";
import { useTokenContext } from "../hooks/useTokenContext";
import { CreateTaskForm } from "./TaskForm";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import api from "../api/client";
import { Task } from "./Task";
import { BoltIcon, FunnelIcon, PlusIcon } from "@heroicons/react/24/solid";

export default function KanbanBoard({ user, projectId }) {
  const { token } = useTokenContext();
  const { data: tasks, isLoading } = useTasks(projectId, token);
  const [showCreateForm, setshowCreateForm] = useState(false);
  const [status, setStatus] = useState("connecting");
  const [search, setSearch] = useState({ backlog: "", wip: "", done: "" });

  useEffect(() => {
    const socket = new WebSocket(`${import.meta.env.VITE_WS_URL}`);
    console.log('WS_URL:', import.meta.env.VITE_WS_URL);
    socket.onmessage = (event) => {
      handleOnMessage(event);
    };

    socket.onopen = () => setStatus("online");
    socket.onerror = () => setStatus("error");
    socket.onclose = () => {
      console.log("Socket closed");
      setStatus("offline");
    };
    return () => socket.close();
  }, []);

  const handleOnMessage = (event) => {
    const updatedTask = JSON.parse(event.data);
    console.log(" Task update received:", updatedTask);

    setColumns((prev) => {
      const newCols = { ...prev };
      Object.keys(newCols).forEach((key) => {
        newCols[key] = newCols[key].filter((t) => t.id !== updatedTask.id);
      });
      newCols[updatedTask.status].push(updatedTask);
      return newCols;
    });
  };

  const handleTaskCreated = (newTask) => {
    console.log("Task created:", newTask);
    setColumns({
      ...columns,
      backlog: [...columns.backlog, newTask],
    });
  };

  const [columns, setColumns] = useState({
    backlog: [],
    wip: [],
    done: [],
  });

  useEffect(() => {
    if (tasks) {
      setColumns({
        backlog: tasks.filter((t) => t.status === "backlog"),
        wip: tasks.filter((t) => t.status === "wip"),
        done: tasks.filter((t) => t.status === "done"),
      });
    }
  }, [tasks]);

  if (isLoading) return <p>Loading board...</p>;
  if (!tasks) return <p>No tasks found.</p>;

  const handleDragEnd = (result) => {
    console.log(result);
    const { source, destination } = result;

    if (!destination) return; // dropped outside

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      // same column reorder
      const newTasks = Array.from(columns[sourceCol]);
      const [moved] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [sourceCol]: newTasks });
    } else {
      // moving between columns
      const sourceTasks = Array.from(columns[sourceCol]);
      const destTasks = Array.from(columns[destCol]);
      const [moved] = sourceTasks.splice(source.index, 1);
      moved.status = destCol; // update status
      destTasks.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [sourceCol]: sourceTasks,
        [destCol]: destTasks,
      });

      api.patch(
        `/tasks/${moved.id}/`,
        { status: destCol, assigned_to: user.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  const handleSearch = (value, key) => {
    setSearch((prev) => ({ ...prev, [key]: value.toLowerCase() }));
  };

  return (
    <>
      <div className="flex gap-4 mb-6">
        {user.isAdmin && (
          <button
            onClick={() => setshowCreateForm(!showCreateForm)}
            className="px-3 py-1 rounded bg-indigo-600 rounded-md font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-cyan-500
            hover:from-indigo-600 hover:to-cyan-600
            transition-all shadow-md hover:shadow-lg
            active:scale-[0.98]"
          >
            <PlusIcon className="size-5 inline-block mr-1" />
            task
            {/* add task */}
          </button>
        )}
      </div>

      <Transition appear show={showCreateForm} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setshowCreateForm(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4 sm:flex sm:items-center sm:justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="my-4 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl sm:my-0">
                <div className="flex items-center justify-between bg-sky-600 px-3 py-2 text-white">
                  <Dialog.Title className="text-lg font-semibold">
                    Create Task
                  </Dialog.Title>

                  <button
                    type="button"
                    aria-label="Close create task dialog"
                    className="text-white hover:text-sky-200"
                    onClick={() => setshowCreateForm(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto py-4">
                  <CreateTaskForm
                    token={token}
                    onTaskCreated={handleTaskCreated}
                    projectId={projectId}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="p-2 grid grid-flow-col auto-cols-max items-center justify-end gap-2">
        {status === "online" && (
          <BoltIcon className="size-5 text-green-500 animate-pulse" />
        )}
        {status === "offline" && (
          <BoltIcon className="size-5 text-gray-400 animate-pulse" />
        )}
        <span>{status}</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="min-h-screen overflow-x-auto bg-gray-100 p-4">
          <div className="flex min-w-max gap-4">
          {Object.entries(columns).map(([key, items]) => (
            <Droppable droppableId={key} key={key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`
                            w-[80vw] min-w-72 max-w-sm shrink-0 overflow-hidden rounded-xl
                            sm:w-80 lg:min-w-0 lg:max-w-none lg:flex-1
                            shadow-md
                            border border-gray-200
                            bg-white
                            transition-shadow duration-200 ease-out

                            ${
                              snapshot.isDraggingOver
                                ? "shadow-xl"
                                : ""
                            }
      `}
                >
                  <div className="p-4 border-b font-bold text-gray-700 uppercase text-center bg-white sticky top-0 z-10">
                    {key}
                  </div>
                  <div className="relative w-full p-2">
                    <FunnelIcon
                      className="
                                size-4 text-gray-400
                                absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none
                              "
                    />

                    <input
                      type="text"
                      placeholder="search"
                      onChange={(v) => handleSearch(v.target.value, key)}
                      className="
                                block w-full border border-gray-200 rounded-md p-2 pl-9
                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                bg-[#ddeeff]
                              "
                    />
                  </div>

                  {/* scroll*/}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {items
                      .filter((task) => {
                        const s = search[key];
                        if (!s) return true;
                        const t = task.title.toLowerCase();
                        const d = stripHtml(task.description).toLowerCase();
                        return t.includes(s) || d.includes(s);
                      })
                      .map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                          isDragDisabled={task.status === "done"}
                        >
                          {(provided, snapshot) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                              style={{
                                ...provided.draggableProps.style,
                                transition: snapshot.isDropAnimating
                                  ? "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 180ms ease-out"
                                  : provided.draggableProps.style?.transition,
                              }}
                              className={`
                                    rounded-xl overflow-hidden
                                    shadow-md
                                    border border-gray-200
                                    bg-white

                                    transition-shadow duration-200 ease-out
                                    ${
                                      snapshot.isDragging
                                        ? "shadow-xl"
                                        : "shadow-md"
                                    }
                                    ${
                                      snapshot.isDragging
                                        ? "shadow-xl ring-2 ring-sky-300"
                                        : ""
                                    }
      `}
                            >
                              {/* task */}
                              <Task
                                task={task}
                                user={task.assigned_to_user}
                                stripHtml={stripHtml}
                              />
                              {/* task */}
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
          </div>
        </div>
      </DragDropContext>
    </>
  );
}
