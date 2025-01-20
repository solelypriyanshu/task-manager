import { useEffect, useState } from "react";
import { getStatistics } from "../services/api"; // Import your API call function

const Dashboard = () => {
  const [stats, setStats] = useState(null); // State to hold statistics
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors

  // Fetch statistics on component mount
  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await getStatistics();
        if (data && typeof data === "object") {
            console.log(data)
          setStats(data);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>; // Display loading indicator
  if (error) return <div className="text-red-500">Error: {error}</div>; // Display error message

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

      {/* Overall statistics */}
      <div className="grid gap-4 mb-6">
        <div>Total Tasks: {stats.totalTasks ?? 0}</div>
        <div>Completed: {stats.completedPercentage ?? 0}%</div>
        <div>Pending: {stats.pendingPercentage ?? 0}%</div>
        <div>Average Completion Time: {stats.averageCompletionTime ?? 0} hours</div>
      </div>

      {/* Pending tasks summary */}
      <h2 className="text-xl font-bold mt-6">Pending Task Summary</h2>
      <table className="table-auto border-collapse border border-gray-400 mt-4 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Priority</th>
            <th className="border border-gray-300 px-4 py-2">Pending Tasks</th>
            <th className="border border-gray-300 px-4 py-2">Time Lapsed (hrs)</th>
            <th className="border border-gray-300 px-4 py-2">Time to Finish (hrs)</th>
          </tr>
        </thead>
        <tbody>
          {(stats.pendingSummary || []).map((row) => (
            <tr key={row.priority}>
              <td className="border border-gray-300 px-4 py-2 text-center">{row.priority}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{row.pendingTasks}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{row.timeLapsed}</td>
              <td className="border border-gray-300 px-4 py-2 text-center">{row.balanceTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
