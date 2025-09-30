import api from "@/utils/api.utils";
import {
  IDocumentType,
  IDocumentNumbering,
  IApiResponse,
} from "@/types/document.types";

export default class DocumentService {
  // ---------------------------------------------
  // SERVICES PARA TIPOS DE DOCUMENTO
  // ----------------------------------------------

  static async getAllDocumentTypes(): Promise<IDocumentType[]> {
    try {
      const response = await api.get("/api/institutional/tipos-documento");
      const apiResponse: IApiResponse<IDocumentType[]> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao buscar tipos de documento");
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de documento:", error);
      throw error;
    }
  }

  static async getDocumentTypeById(id: number): Promise<IDocumentType> {
    try {
      const response = await api.get(`/api/institutional/tipos-documento/${id}`);
      const apiResponse: IApiResponse<IDocumentType> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao buscar tipo de documento");
      }
    } catch (error) {
      console.error("Erro ao buscar tipo de documento:", error);
      throw error;
    }
  }

  // ---------------------------------------------
  // SERVICES PARA NUMERAÇÃO DOCUMENTOS
  // ----------------------------------------------

  static async getDocumentNumbering(): Promise<IDocumentNumbering[]> {
    try {
      const response = await api.get("/api/institutional-management/numeracao-documentos");
      const apiResponse: IApiResponse<IDocumentNumbering[]> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao buscar numeração de documentos");
      }
    } catch (error) {
      console.error("Erro ao buscar numeração de documentos:", error);
      throw error;
    }
  }

  static async getDocumentNumberingById(id: number): Promise<IDocumentNumbering> {
    try {
      const response = await api.get(`/api/institutional-management/numeracao-documentos/${id}`);
      const apiResponse: IApiResponse<IDocumentNumbering> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao buscar numeração de documento");
      }
    } catch (error) {
      console.error("Erro ao buscar numeração de documento:", error);
      throw error;
    }
  }

  static async updateDocumentNumbering(
    id: number,
    numberingData: IDocumentNumbering
  ): Promise<IDocumentNumbering> {
    try {
      const response = await api.put(
        `/api/institutional-management/numeracao-documentos/${id}`,
        numberingData
      );
      const apiResponse: IApiResponse<IDocumentNumbering> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao atualizar numeração de documento");
      }
    } catch (error) {
      console.error("Erro ao atualizar numeração de documento:", error);
      throw error;
    }
  }

  static async createDocumentNumbering(
    numberingData: IDocumentNumbering
  ): Promise<IDocumentNumbering> {
    try {
      const response = await api.post(
        "/api/institutional-management/numeracao-documentos",
        numberingData
      );
      const apiResponse: IApiResponse<IDocumentNumbering> = response.data;

      if (apiResponse.success) {
        return apiResponse.data;
      } else {
        throw new Error(apiResponse.message || "Erro ao criar numeração de documento");
      }
    } catch (error) {
      console.error("Erro ao criar numeração de documento:", error);
      throw error;
    }
  }

  static async deleteDocumentNumbering(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/institutional-management/numeracao-documentos/${id}`);
      const apiResponse: IApiResponse<null> = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Erro ao deletar numeração de documento");
      }
    } catch (error) {
      console.error("Erro ao deletar numeração de documento:", error);
      throw error;
    }
  }
}
