import { beforeEach, describe, expect, it, vi } from "vitest";
import { app } from "@/server";
import request from "supertest";
import { emptyDatabase } from "__tests__/helpers/empty-database";
import { logger } from "@/utils";
import { SIGN_UP_INPUT } from "__tests__/helpers/test-data";

beforeEach(async () => {
  await emptyDatabase();
  logger.level = "silent";
});

describe("UserRouter", () => {
  const spyOnLoggerError = vi.spyOn(logger, "error");
  const input = SIGN_UP_INPUT;

  describe("Sign up", () => {
    it("should create a user", async () => {
      const response = await request(app).post("/api/v1/user/sign-up").send({
        name: input.name,
        email: input.email,
        password: input.password,
        confirmPassword: input.confirmPassword,
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        name: input.name,
        email: input.email,
      });
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.success).toBe(true);
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const response = await request(app).post("/api/v1/user/sign-up").send({
        name: input.name,
        email: input.email,
        password: input.password,
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
        name: input.name,
        email: input.email,
        password: input.password,
        confirmPassword: input.confirmPassword,
      };

      await request(app).post("/api/v1/user/sign-up").send(user);
      const response = await request(app)
        .post("/api/v1/user/sign-up")
        .send(user);

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

  describe("Sign in", () => {
    beforeEach(async () => {
      await request(app).post("/api/v1/user/sign-up").send({
        name: input.name,
        email: input.email,
        password: input.password,
        confirmPassword: input.confirmPassword,
      });
    });

    it("should sign in a user", async () => {
      const response = await request(app).post("/api/v1/user/sign-in").send({
        email: input.email,
        password: input.password,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data).toHaveProperty("refreshToken");
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.success).toBe(true);
    });

    it("should return a 400 error if the request body is invalid", async () => {
      const response = await request(app).post("/api/v1/user/sign-in").send({
        name: input.name,
        password: input.password,
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_REQUEST");
      expect(response.body.error.message).toBe("Invalid request input");
    });

    it("should return a 401 error if the password is incorrect", async () => {
      const response = await request(app).post("/api/v1/user/sign-in").send({
        email: input.email,
        password: "incorrect",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("INVALID_PASSWORD");
      expect(response.body.error.message).toBe("Invalid password");
    });

    it("should return a 404 error if the user does not exist", async () => {
      const response = await request(app).post("/api/v1/user/sign-in").send({
        email: "incorrect@example.com",
        password: input.password,
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe("USER_NOT_FOUND");
      expect(response.body.error.message).toBe("User not found");
    });
  });

  describe("Profile", () => {
    let token: string;
    beforeEach(async () => {
      await request(app).post("/api/v1/user/sign-up").send({
        name: input.name,
        email: input.email,
        password: input.password,
        confirmPassword: input.confirmPassword,
      });

      const response = await request(app).post("/api/v1/user/sign-in").send({
        email: input.email,
        password: input.password,
      });

      token = response.body.data.token;
    });

    it("should return a user", async () => {
      const response = await request(app)
        .post("/api/v1/user/profile")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("name");
      expect(response.body.data).toHaveProperty("email");
      expect(response.body.data).not.toHaveProperty("password");
      expect(response.body.success).toBe(true);
    });

    it("should return a 401 error if the token is invalid", async () => {
      const response = await request(app)
        .post("/api/v1/user/profile")
        .set("Authorization", "Bearer invalid")
        .send();

      expect(response.status).toBe(401);
    });

    it("should return a 401 error if the token is not provided", async () => {
      const response = await request(app).post("/api/v1/user/profile").send();

      expect(response.status).toBe(401);
    });
  });
});
