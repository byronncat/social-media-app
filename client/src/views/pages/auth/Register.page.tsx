import { Form } from "../../../common/components/index";
import { Link } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import { AuthenticationInformation } from "@/types";

function RegisterPage() {
  const defaultValues: AuthenticationInformation = {
    username: "",
    password: "",
    email: "",
  };
  
  const submitHandler: SubmitHandler<AuthenticationInformation> = (data) => console.log(data);

  return (
    <>
      <h2 className="mb-3 fs-1 fw-bolder text-light text-capitalize">register</h2>
      <Form
        fieldList={[
          {
            name: "email",
            type: "email",
            placeholder: "Email",
            validation: {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            },
          },
          {
            name: "username",
            type: "text",
            placeholder: "Username",
            validation: {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            },
          },
          {
            name: "password",
            type: "password",
            placeholder: "Password",
            validation: {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            },
          },
        ]}
        defaultValues={defaultValues}
        submitHandler={submitHandler}
      >
        <input type="submit" value="Register" className="submit-btn mt-4 pt-2 my-2 btn w-100" />
        <p className="text-center mt-1 mb-0">--- or ---</p>
        <Link
          to="/auth/login"
          className="link text-reset text-decoration-none d-block text-center fs-6"
        >
          Login here
        </Link>
      </Form>
    </>
  );
}

export default RegisterPage;
