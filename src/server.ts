import { sum } from "./sum";

export const main = () => {
  const result = sum(1, 2);

  const response = `Hello, world! ${result}`;

  console.log(response);

  return response;
};

main();
