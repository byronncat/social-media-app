import { Form } from "../../components/index";
import { Link } from "react-router-dom";
import { SubmitHandler } from "react-hook-form";
import axios, { AxiosResponse } from "axios";
import { AuthenticationInformation } from "@types";

const defaultValues: AuthenticationInformation = {
  email: "",
};

function ForgotPasswordPage() {
  const submitHandler: SubmitHandler<AuthenticationInformation> = async (data) => {
    axios.post("/api/auth/send-email", data).then((res: AxiosResponse) => {
      console.log(res.data);
    });
  };

  return (
    <>
      <h2 className="mb-3 fs-1 fw-bolder text-light text-capitalize">forgot password</h2>
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
        ]}
        defaultValues={defaultValues}
        submitHandler={submitHandler}
      >
        <input type="submit" value="Send" className="submit-btn pt-2 my-2 btn w-100" />
        <p className="text-center mt-1 mb-0">--- or ---</p>
        <Link
          to="/login"
          className="link text-reset text-decoration-none d-block text-center fs-6"
        >
          Turn back
        </Link>
      </Form>
    </>
  );
}

export default ForgotPasswordPage;
