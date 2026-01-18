const Signup = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-neutral-600 flex justify-center">
        <div>Text Div</div>

        <div className="flex flex-col">
          <h2>Let's get you onboard</h2>

          <form className="flex flex-col">
            <p>
              <label htmlFor="email">Name</label>
              <input
                type="text"
                name="email"
                id="email"
                placeholder="example@gmail.com"
                className="rounded-xl border border-neutral-700 px-4 text-white
                placeholder:text-neutral-400 focus:outline-none focus:ring-1
                focus:ring-sky-400 transition duration-200"
              />
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
