import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "@/server";
import request from "supertest";
import { emptyDatabase } from "__tests__/helpers/emptyDatabase";
import { logger } from "@/utils";

beforeEach(() => {
  logger.level = "silent";
});

afterEach(async () => {
  await emptyDatabase();
});

describe("UserRouter", () => {
  const spyOnLoggerError = vi.spyOn(logger, "error");

  it("should create a user", async () => {
    const response = await request(app).post("/api/v1/user/sign-up").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      confirmPassword: "123456789",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    expect(response.body.success).toBe(true);
  });

  it("should return a 400 error if the request body is invalid", async () => {
    const response = await request(app).post("/api/v1/user/sign-up").send({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_REQUEST");
    expect(response.body.error.message).toBe("Invalid request input");
    expect(response.body.error.fields).toHaveProperty("confirmPassword");
    expect(response.body.error.fields.confirmPassword).toBe(
      "confirmPassword is a required field",
    );
    expect(spyOnLoggerError).toHaveBeenCalledOnce();
  });

  it("should return 409 if the user already exists", async () => {
    const user = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "123456789",
      confirmPassword: "123456789",
    };

    await request(app).post("/api/v1/user/sign-up").send(user);
    const response = await request(app).post("/api/v1/user/sign-up").send(user);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("error");
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("DUPLICATE_ENTRY");
    expect(response.body.error.message).toBe(
      "A record with this information already exists",
    );
    expect(spyOnLoggerError).toHaveBeenCalledOnce();
  });
});
