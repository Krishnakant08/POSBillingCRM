import { loginService } from "../services/auth.service.js";
import ApiResponse from "../utils/apiResponse.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginService(email, password);

    return res.status(200).json(ApiResponse.success("Login successful", user));
  } catch (error) {
    return res.status(401).json(ApiResponse.error(error.message));
  }
};
