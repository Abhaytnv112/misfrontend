import React, { useState } from "react";
import { toast } from "react-toastify";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Checkbox from "@/components/ui/Checkbox";
import { useDispatch } from "react-redux";
import { registerReducer } from "./store";
import { useRouter } from "next/navigation";
import Select from "@/components/ui/Select";

const schema = yup.object({
  name: yup.string().required("Name is Required"),
  email: yup.string().email("Invalid email").required("Email is Required"),
  password: yup
    .string()
    .min(6, "Password must be at least 8 characters")
    .max(20, "Password shouldn't be more than 20 characters")
    .required("Please enter password"),
  // confirm password
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const RegForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await dispatch(registerReducer(data));
      console.log(response);
      if (response?.payload?.token) {
        toast.success("Registration successful!");
        router.push("/");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Textinput
        name="name"
        label="Name"
        type="text"
        placeholder="Enter your name"
        register={register}
        error={errors.name}
      />
      <Textinput
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register}
        error={errors.email}
      />
      <Textinput
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        register={register}
        error={errors.password}
      />
      <Textinput
        name="confirmpassword"
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        register={register}
        error={errors.confirmpassword}
      />
      <Select
          options={["Admin", "User"]}
          label="Select Option's"
          register={register}
          name="role"
        />
      <Checkbox
        label="You accept our Terms and Conditions and Privacy Policy"
        value={checked}
        onChange={() => setChecked(!checked)}
      />
      <button type="submit" className="btn btn-dark block w-full text-center">
        Create an account
      </button>
    </form>
  );
};

export default RegForm;
