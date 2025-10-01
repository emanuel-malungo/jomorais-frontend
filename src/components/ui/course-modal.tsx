"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ICourse, ICourseInput } from '@/types/course.types'
import { useCreateCourse, useUpdateCourse } from '@/hooks/useCourse'

interface CourseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: ICourse | null
  onSuccess?: () => void
}

export function CourseModal({ open, onOpenChange, course, onSuccess }: CourseModalProps) {
  const [formData, setFormData] = useState<ICourseInput>({
    designacao: '',
    observacoes: ''
  })

  const { createCourse, loading: creating, error: createError } = useCreateCourse()
  const { updateCourse, loading: updating, error: updateError } = useUpdateCourse(course?.codigo || 0)

  const loading = creating || updating
  const error = createError || updateError
  const isEditing = !!course

  // Reset form when modal opens/closes or course changes
  useEffect(() => {
    if (open) {
      if (course) {
        setFormData({
          designacao: course.designacao || '',
          observacoes: course.observacoes || ''
        })
      } else {
        setFormData({
          designacao: '',
          observacoes: ''
        })
      }
    }
  }, [open, course])

  const handleInputChange = (field: keyof ICourseInput, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (isEditing) {
        await updateCourse(formData)
      } else {
        await createCourse(formData)
      }
      
      onOpenChange(false)
      onSuccess?.()
    } catch (err) {
      // Error is handled by the hooks
      console.error('Erro ao salvar curso:', err)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Curso' : 'Novo Curso'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize as informações do curso abaixo.' 
              : 'Preencha os dados do novo curso abaixo.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome do Curso */}
          <div className="space-y-2">
            <Label htmlFor="designacao">
              Nome do Curso <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleInputChange('designacao', e.target.value)}
              placeholder="Ex: Engenharia Informática"
              required
              disabled={loading}
            />
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Informações adicionais sobre o curso..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
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
              disabled={loading || !formData.designacao.trim()}
              className="bg-[#182F59] hover:bg-[#1a3260]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditing ? 'Atualizando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Atualizar Curso' : 'Criar Curso'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}