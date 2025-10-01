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
import { Checkbox } from '@/components/ui/checkbox'

import { useCreateClass, useUpdateClass } from '@/hooks/useClass'
import { IClass, IClassInput } from '@/types/class.types'

interface ClassModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classItem?: IClass | null
  onSuccess?: () => void
}

export function ClassModal({
  open,
  onOpenChange,
  classItem,
  onSuccess
}: ClassModalProps) {
  const [formData, setFormData] = useState<IClassInput>({
    designacao: '',
    status: 1,
    notaMaxima: 20,
    exame: false,
  })

  const isEditing = !!classItem
  const { createClass, isLoading: creating, error: createError } = useCreateClass()
  const { updateClass, isLoading: updating, error: updateError } = useUpdateClass()

  const loading = creating || updating
  const error = createError || updateError

  // Resetar formulário quando o modal abrir/fechar ou classe mudar
  useEffect(() => {
    if (open && classItem) {
      setFormData({
        designacao: classItem.designacao || '',
        status: classItem.status || 1,
        notaMaxima: classItem.notaMaxima || 20,
        exame: classItem.exame || false,
      })
    } else if (open && !classItem) {
      setFormData({
        designacao: '',
        status: 1,
        notaMaxima: 20,
        exame: false,
      })
    }
  }, [open, classItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && classItem) {
        await updateClass(classItem.codigo, formData)
      } else {
        await createClass(formData)
      }

      onOpenChange(false)
      onSuccess?.()

      // Limpar formulário após sucesso
      setFormData({
        designacao: '',
        status: 1,
        notaMaxima: 20,
        exame: false,
      })
    } catch (error) {
      console.error('Erro ao salvar classe:', error)
    }
  }

  const handleChange = (field: keyof IClassInput, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      designacao: '',
      status: 1,
      notaMaxima: 20,
      exame: false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Classe' : 'Nova Classe'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações da classe abaixo.'
              : 'Preencha as informações para criar uma nova classe.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="designacao">
              Nome da Classe <span className="text-red-500">*</span>
            </Label>
            <Input
              id="designacao"
              value={formData.designacao}
              onChange={(e) => handleChange('designacao', e.target.value)}
              placeholder="Digite o nome da classe (ex: 1ª Classe, 7ª Classe)"
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notaMaxima">
                Nota Máxima
              </Label>
              <Input
                id="notaMaxima"
                type="number"
                min="1"
                max="100"
                value={formData.notaMaxima}
                onChange={(e) => handleChange('notaMaxima', parseInt(e.target.value) || 20)}
                placeholder="20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status
              </Label>
              <Select
                value={formData.status?.toString() || "1"}
                onValueChange={(value) => handleChange('status', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ativa</SelectItem>
                  <SelectItem value="0">Inativa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="exame"
              checked={formData.exame}
              onCheckedChange={(checked: boolean) => handleChange('exame', checked)}
            />
            <Label htmlFor="exame" className="text-sm font-medium">
              Classe com exame final
            </Label>
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
              disabled={loading || !formData.designacao.trim()}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Classe'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}