import withErrorHandler from "./error-handler.middleware";
import withInputValidation from "./validation.middleware";
import withAuthenticationMiddleware from "./authentication.middleware";

export default {
  withErrorHandler,
  withInputValidation,
  withAuthenticationMiddleware,
};
