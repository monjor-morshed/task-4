const Home = () => {
  return (
    <div className="px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-slate-800">
        Welcome to my Auth-App!
      </h1>
      <p className="mb-4 text-slate-700">
        This is a Full-Stack Web Application. It includes authentication
        features that allows users to SignUp, SignIn, SignOut, and Delete the
        Account.
      </p>
      <p className="mb-4 text-slate-700">
        The frontend is built with React and Tailwind CSS. The backend is built
        with Node.js, Express, and MySQL. Authentication is done using JWT.
      </p>
    </div>
  );
};

export default Home;
