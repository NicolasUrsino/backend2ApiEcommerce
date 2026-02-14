import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";



export default class UsersService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  getAllUsers = async () => {
    return await this.userRepository.getAll();
  };

  getUserById = async (id) => {
    return await this.userRepository.getById(id);
  };

  deleteUser = async (id) => {
    return await this.userRepository.delete(id);
  };
}
requestPasswordReset = async (email, mailService) => {
  const user = await this.userRepository.getByEmail(email);

  if (!user) throw new Error("Usuario no encontrado");

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_RESET_SECRET,
    { expiresIn: "1h" }
  );

  const expiration = new Date(Date.now() + 3600000);

  await this.userRepository.update(user._id, {
    resetToken: token,
    resetTokenExpires: expiration,
  });

  await mailService.sendResetEmail(user.email, token);

  return { message: "Email enviado" };
};
resetPassword = async (token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    const user = await this.userRepository.getByEmail(decoded.email);

    if (!user) throw new Error("Usuario inválido");

    if (
      !user.resetToken ||
      user.resetToken !== token ||
      user.resetTokenExpires < new Date()
    ) {
      throw new Error("Token inválido o expirado");
    }

    const isSamePassword = bcrypt.compareSync(newPassword, user.password);

    if (isSamePassword) {
      throw new Error("No puede usar la misma contraseña anterior");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    await this.userRepository.update(user._id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    return { message: "Contraseña actualizada correctamente" };
  } catch (error) {
    throw new Error("Token inválido o expirado");
  }
};
