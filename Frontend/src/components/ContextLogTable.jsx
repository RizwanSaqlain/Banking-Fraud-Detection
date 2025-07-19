const ContextLogTable = ({ logs }) => {
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-gradient bg-gradient-to-r from-blue-400 to-violet-500 text-transparent bg-clip-text">
        Contextual Login Logs
      </h2>
      <table className="min-w-full rounded-xl shadow-lg bg-gray-800 text-white">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-violet-500 text-white">
            <th className="py-3 px-4 border-b border-gray-700 font-semibold">
              IP
            </th>
            <th className="py-3 px-4 border-b border-gray-700 font-semibold">
              Device
            </th>
            <th className="py-3 px-4 border-b border-gray-700 font-semibold">
              Timestamp
            </th>
            <th className="py-3 px-4 border-b border-gray-700 font-semibold">
              Location
            </th>
            <th className="py-3 px-4 border-b border-gray-700 font-semibold">
              Risk Score
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log._id}
              className={
                log.riskScore >= 10
                  ? "bg-red-900 bg-opacity-70 text-red-200 font-semibold"
                  : "bg-gray-900 bg-opacity-60"
              }
            >
              <td className="py-2 px-4 border-b border-gray-700">{log.ip}</td>
              <td className="py-2 px-4 border-b border-gray-700">
                {log.device}
              </td>
              <td className="py-2 px-4 border-b border-gray-700">
                {formatDate(log.timestamp?.$date || log.timestamp)}
              </td>
              <td className="py-2 px-4 border-b border-gray-700">
                {log.location?.locationName || "Unknown"}
              </td>
              <td className="py-2 px-4 border-b border-gray-700 text-center">
                <span
                  className={
                    log.riskScore >= 7
                      ? "px-2 py-1 rounded bg-red-600 text-white font-bold"
                      : "px-2 py-1 rounded bg-green-600 text-white font-bold"
                  }
                >
                  {log.riskScore}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContextLogTable;
