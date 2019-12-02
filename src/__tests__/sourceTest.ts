import { serializeFilter } from "../utils/source";

it("should serialze array in filter", () => {
  const filter = {
    name: "test",
    myTestArray: ["arrayTest1", "arrayTest2", "arrayTest3"]
  };

  const result = serializeFilter(filter);

  expect(result.includes("myTestArray")).toBe(true);

  const countMyTestAray = result.split("myTestArray").length;

  expect(countMyTestAray).toBe(4);
});
