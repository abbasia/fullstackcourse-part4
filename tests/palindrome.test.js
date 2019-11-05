const palindrome = require("../utils/for_testing").palindrome;
describe("palindrome test", () => {
  test.skip("palindrome of a ", () => {
    const result = palindrome("a");
    expect(result).toBe("a");
  });

  test.skip("palindrome of react", () => {
    const result = palindrome("react");
    expect(result).toBe("tcaer");
  });

  test.skip("palindrome of releveler", () => {
    const result = palindrome("releveler");

    expect(result).toBe("releveler");
  });
});
