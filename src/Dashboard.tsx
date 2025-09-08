function Dashboard() {
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome to your Dashboard!</h1>
        <p className="text-gray-600 mb-6">You have successfully logged in.</p>
        <button
          onClick={logout}
          className="mt-2 bg-yellow-400 hover:bg-yellow-500 py-2 px-4 rounded-full font-semibold"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
