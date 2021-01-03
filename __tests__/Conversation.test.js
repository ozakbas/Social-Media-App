import { ConversationLogic } from "../screens/ConversationScreen";

test("just an example", () => {
  ConversationLogic.getUserInfo("ffghu", "u").then((result) => {
    expect(result).toBe("This is a dummy function");
  });
});
