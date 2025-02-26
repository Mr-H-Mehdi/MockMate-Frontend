import LoginComponent from "../components/auth/LoginComponent";

const Home = () => {
  const handleSubmit = () => {
    console.log("Form Submitted");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://unsplash.it/1366/768?image=568')" }}>
      <LoginComponent  />
    </div>
  );
};

export default Home;