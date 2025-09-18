import { placeholder } from "./placeholder";

export const main = () => {
  const result = placeholder();

  const response = `Hello, world! ${result}`;

  console.log(response);

  return response;
};

main();
