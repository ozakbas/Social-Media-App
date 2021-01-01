import React from "react";
const { SignIn } = require("../screens/SignInScreen");

test("just an example", () => {
  expect(SignIn.handleSubmit("u", "u")).toEqual("x");
});
