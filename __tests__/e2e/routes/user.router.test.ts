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
});
