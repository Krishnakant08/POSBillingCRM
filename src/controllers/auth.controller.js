import ApiResponse from "../utils/apiResponse.js";
import { loginService, registerService } from "../services/auth.service.js";

/* ============ LOGIN ============ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    return res.status(200).json(ApiResponse.success("Login successful", user));
  } catch (error) {
    return res.status(401).json(ApiResponse.error(error.message));
  }
};

/* ============ REGISTER ============ */
export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);

    return res
      .status(201)
      .json(ApiResponse.success("User registered successfully", user));
  } catch (error) {
    return res.status(400).json(ApiResponse.error(error.message));
  }
};
