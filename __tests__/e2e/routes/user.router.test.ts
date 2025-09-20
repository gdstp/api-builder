import { afterEach, describe, expect, it } from "vitest";
import { app } from "@/server";
import request from "supertest";
import { emptyDatabase } from "__tests__/helpers/emptyDatabase";

afterEach(async () => {
  await emptyDatabase();
});

describe("UserRouter", () => {
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
  });
});
