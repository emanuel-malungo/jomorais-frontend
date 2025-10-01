"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { useCreateDiscipline, useUpdateDiscipline } from '@/hooks/useDiscipline'
import { IDiscipline, IDisciplineInput } from '@/types/discipline.types'
import { ICourse } from '@/types/course.types'

interface DisciplineModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  discipline?: IDiscipline | null
  courses: ICourse[]
  onSuccess?: () => void
}

export function DisciplineModal({
  open,
  onOpenChange,
  discipline,
  courses,
  onSuccess
}: DisciplineModalProps) {
  const [formData, setFormData] = useState<IDisciplineInput>({
    designacao: '',
    codigo_Curso: 0,
  })

  const isEditing = !!discipline
  const { createDiscipline, loading: creating, error: createError } = useCreateDiscipline()
  const { updateDiscipline, loading: updating, error: updateError } = useUpdateDiscipline(discipline?.codigo || 0)

  const loading = creating || updating
  const error = createError || updateError

  // Resetar formulário quando o modal abrir/fechar ou disciplina mudar
  useEffect(() => {
    if (open && discipline) {
      setFormData({
        designacao: discipline.designacao || '',
        codigo_Curso: discipline.codigo_Curso || 0,
      })
    } else if (open && !discipline) {
      setFormData({
        designacao: '',
        codigo_Curso: 0,
      })
    }
  }, [open, discipline])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && discipline) {
        await updateDiscipline(formData)
      } else {
        await createDiscipline(formData)
      }

      onOpenChange(false)
      onSuccess?.()

      // Limpar formulário após sucesso
      setFormData({
        designacao: '',
        codigo_Curso: 0,
      })
    } catch (error) {
      console.error('Erro ao salvar disciplina:', error)
    }
  }

  const handleChange = (field: keyof IDisciplineInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      designacao: '',
      codigo_Curso: 0,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Disciplina' : 'Nova Disciplina'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da disciplina abaixo.'
              : 'Preencha as informações para criar uma nova disciplina.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designacao">
              Nome da Disciplina <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleChange('designacao', e.target.value)}
              placeholder="Digite o nome da disciplina"
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo_Curso">
              Curso <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.codigo_Curso.toString()}
              onValueChange={(value) => handleChange('codigo_Curso', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um curso" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.codigo} value={course.codigo.toString()}>
                    {course.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.designacao.trim() || formData.codigo_Curso === 0}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Disciplina'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}