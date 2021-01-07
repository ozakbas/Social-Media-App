import { SignInLogic } from "../screens/SignInScreen";

global.fetch = require("jest-fetch-mock");

test("just an example", async () => {
  SignInLogic("eren@g", "1").then((result) => {
    expect(result).toBe("k");
  });
});

/* 
test("the fetch fails with an error", () => {
  return expect(SignInLogic("eren@g", "1")).rejects.toMatch("rejected");
});

*/

test("just an example", () => {
  fetch.mockResponseOnce(JSON.stringify([{ id: 1 }]));
  return expect(SignInLogic("eren@g", "1")).toMatch("Error");
});
