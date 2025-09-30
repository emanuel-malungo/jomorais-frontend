import api from "@/utils/api.utils";

export default class UsersService {

  /**
   * Busca todos os usuários legados com paginação
   * @param {number} page - número da página (default: 1)
   * @param {number} limit - quantidade por página (default: 10)
   * @returns {Promise<{success: boolean, message: string, meta: object, data: Array}>}
   */
  static async getAllUsersLegacy(page = 1, limit = 10) {
    try {
      const response = await api.get("/api/users/legacy", {
        params: { page, limit }, // manda paginação via query
      });

      return response.data; // já vem estruturado conforme o backend
    } catch (error) {
      console.error("Erro ao buscar usuários legados:", error);
      throw error;
    }
  }

  static async getUserLegacyById(id: number) {
    try {
      const response = await api.get(`/api/users/legacy/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar usuário legado com ID ${id}:`, error);
      throw error;
    }
  }

  



}
