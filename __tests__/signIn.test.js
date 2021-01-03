import { SignInLogic } from "../screens/SignInScreen";

test("just an example", () => {
  SignInLogic("ffghu", "u").then((result) => {
    expect(result).toBe("This is a dummy function");
  });
});
