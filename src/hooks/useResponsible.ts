import { useState, useCallback } from "react";
import ResponsibleService from "@/services/responsible.service";

export function useResponsibleService() {
    const [responsibles, setResponsibles] = useState<any[]>([]);
    const [responsible, setResponsible] = useState<any | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Buscar lista com paginação e busca
    const fetchResponsibles = useCallback(async (params?: { page?: number; limit?: number; search?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ResponsibleService.getResponsibles(params);
            setResponsibles(data);
        } catch (err: any) {
            setError(err.message || "Erro ao buscar responsáveis");
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar por ID
    const fetchResponsibleById = useCallback(async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await ResponsibleService.getResponsibleById(id);
            setResponsible(data);
        } catch (err: any) {
            setError(err.message || "Erro ao buscar responsável");
        } finally {
            setLoading(false);
        }
    }, []);

    // Criar
    const createResponsible = useCallback(async (responsibleData: any) => {
        try {
            const newResponsible = await ResponsibleService.createResponsible(responsibleData);
            setResponsibles((prev) => [...prev, newResponsible]);
            return newResponsible;
        } catch (err: any) {
            throw new Error(err.message || "Erro ao criar responsável");
        }
    }, []);

    // Atualizar
    const updateResponsible = useCallback(async (id: number, responsibleData: any) => {
        try {
            const updated = await ResponsibleService.updateResponsible(id, responsibleData);
            setResponsibles((prev) => prev.map((r) => (r.id === id ? updated : r)));
            return updated;
        } catch (err: any) {
            throw new Error(err.message || "Erro ao atualizar responsável");
        }
    }, []);

    // Deletar
    const deleteResponsible = useCallback(async (id: number) => {
        try {
            await ResponsibleService.deleteResponsible(id);
            setResponsibles((prev) => prev.filter((r) => r.id !== id));
        } catch (err: any) {
            throw new Error(err.message || "Erro ao deletar responsável");
        }
    }, []);

    return {
        responsibles,
        responsible,
        loading,
        error,
        fetchResponsibles,
        fetchResponsibleById,
        createResponsible,
        updateResponsible,
        deleteResponsible,
    };
}
