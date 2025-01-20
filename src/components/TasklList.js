import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";
import dayjs from "dayjs";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", priority: "", status: "pending", startTime: "", endTime: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data?.tasks || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    }
  };

  const formatDateTime = (dateTime) => {
    return dayjs(dateTime).format("DD MMM YYYY hh:mm A");
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSaveTask = async () => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask._id, newTask);
      } else {
        await createTask(newTask);
      }
      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setNewTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">
        + Add Task
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-lg p-4 shadow w-72">
            <p className="text-gray-500 text-sm">Task ID: {task._id}</p>
            <h2 className="text-lg font-bold text-blue-600 mb-2">{task.title}</h2>
            <p className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${task.status === 'Pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
              {task.status}
            </p>
            <span className="float-right text-gray-600">Priority: {task.priority}</span>
            <p className="mt-2"><strong>Start:</strong> {formatDateTime(task.startTime)}</p>
            <p><strong>End:</strong> {formatDateTime(task.endTime)}</p>
            <div className="border-t mt-4 pt-2 flex justify-between">
              <button className="text-blue-500" onClick={() => handleEditTask(task)}>Edit</button>
              <button className="text-red-500" onClick={() => handleDeleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">{selectedTask ? "Edit Task" : "Add Task"}</h2>
            <input type="text" name="title" placeholder="Title" value={newTask.title} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <input type="datetime-local" name="startTime" value={newTask.startTime} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <input type="datetime-local" name="endTime" value={newTask.endTime} onChange={handleInputChange} className="border p-2 rounded w-full mb-2" />
            <select name="priority" value={newTask.priority} onChange={handleInputChange} className="border p-2 rounded w-full mb-2">
              <option value="">Select Priority</option>
              <option value="1">Priority 1</option>
              <option value="2">Priority 2</option>
              <option value="3">Priority 3</option>
              <option value="4">Priority 4</option>
              <option value="5">Priority 5</option>
            </select>
            <select name="status" value={newTask.status} onChange={handleInputChange} className="border p-2 rounded w-full mb-4">
              <option value="pending">Pending</option>
              <option value="finished">Finished</option>
            </select>
            <button onClick={handleSaveTask} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;