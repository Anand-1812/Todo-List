const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-neutral-600 flex justify-center">
        <div>Text Div</div>
        <div>
          <h2>Let's get you onboard</h2>
          <form className="flex flex-col">
            <label htmlFor="email">Name</label>
            <input name="email" id="email" placeholder="example@gmail.com" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
