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
import { useToast, ToastContainer } from '@/components/ui/toast';
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers';
import authService from '@/services/auth.service';

// Tipos para usuários
interface IUser {
  codigo: number
  nome: string
  user: string
  passe?: string
  codigo_Tipo_Utilizador: number
  estadoActual: string
  dataCadastro: string
  loginStatus: string
  tb_tipos_utilizador?: {
    codigo: number
    designacao: string
  }
}

interface IUserInput {
  nome: string
  user: string
  passe: string
  codigo_Tipo_Utilizador: number
  estadoActual: string
}

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: IUser | null
  onSuccess?: () => void
}

export function UserModal({
  open,
  onOpenChange,
  user,
  onSuccess
}: UserModalProps) {
  const [formData, setFormData] = useState<IUserInput>({
    nome: '',
    user: '',
    passe: '',
    codigo_Tipo_Utilizador: 1,
    estadoActual: 'ATIVO',
  })

  const [userTypes, setUserTypes] = useState<Array<{codigo: number, designacao: string}>>([])
  const { success, error: showError } = useToast()
  
  // Hooks para CRUD
  const { createUser, loading: creating, error: createError } = useCreateUser()
  const { updateUser, loading: updating, error: updateError } = useUpdateUser()
  
  const loading = creating || updating
  const isEditing = !!user

  // Resetar formulário quando o modal abrir/fechar ou usuário mudar
  useEffect(() => {
    if (open && user) {
      setFormData({
        nome: user.nome || '',
        user: user.user || '',
        passe: '', // Não preencher senha por segurança
        codigo_Tipo_Utilizador: user.codigo_Tipo_Utilizador || 1,
        estadoActual: user.estadoActual || 'ATIVO',
      })
    } else if (open && !user) {
      setFormData({
        nome: '',
        user: '',
        passe: '',
        codigo_Tipo_Utilizador: 1,
        estadoActual: 'ATIVO',
      })
    }
  }, [open, user])

  // Carregar tipos de usuário
  useEffect(() => {
    const loadUserTypes = async () => {
      try {
        const response = await authService.getUserTypes()
        const data = response.data
        setUserTypes(data)
      } catch (error) {
        console.error('Erro ao carregar tipos de usuário:', error)
      }
    }

    if (open) {
      loadUserTypes()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && user) {
        await updateUser(user.codigo, formData)
      } else {
        await createUser(formData)
      }

      success(
        isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!',
        'As informações foram salvas no sistema.'
      )
      onOpenChange(false)
      onSuccess?.()
      
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        user: '',
        passe: '',
        codigo_Tipo_Utilizador: 1,
        estadoActual: 'ATIVO',
      })
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      showError('Erro ao salvar usuário', error instanceof Error ? error.message : 'Ocorreu um erro inesperado.')
    }
  }

  const handleChange = (field: keyof IUserInput, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCancel = () => {
    onOpenChange(false)
    setFormData({
      nome: '',
      user: '',
      passe: '',
      codigo_Tipo_Utilizador: 1,
      estadoActual: 'ATIVO',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Edite as informações do usuário abaixo.'
              : 'Preencha as informações para criar um novo usuário.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Digite o nome completo do usuário"
              required
              maxLength={45}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user">
                Nome de Usuário <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user"
                value={formData.user}
                onChange={(e) => handleChange('user', e.target.value)}
                placeholder="Digite o nome de usuário"
                required
                maxLength={45}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passe">
                Senha {!isEditing && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="passe"
                type="password"
                value={formData.passe}
                onChange={(e) => handleChange('passe', e.target.value)}
                placeholder={isEditing ? "Deixe em branco para manter a atual" : "Digite a senha"}
                required={!isEditing}
                maxLength={45}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo_Tipo_Utilizador">
                Tipo de Usuário <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.codigo_Tipo_Utilizador?.toString() || "1"}
                onValueChange={(value) => handleChange('codigo_Tipo_Utilizador', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {userTypes.map((type) => (
                    <SelectItem key={type.codigo} value={type.codigo.toString()}>
                      {type.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estadoActual">
                Estado
              </Label>
              <Select
                value={formData.estadoActual || "ATIVO"}
                onValueChange={(value) => handleChange('estadoActual', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                  <SelectItem value="SUSPENSO">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

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
              disabled={loading || !formData.nome.trim() || !formData.user.trim() || (!isEditing && !formData.passe.trim())}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEditing ? 'Salvando...' : 'Criando...'}</span>
                </div>
              ) : (
                isEditing ? 'Salvar Alterações' : 'Criar Usuário'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <ToastContainer toasts={[]} onRemove={() => {}} />
    </Dialog>
  )
}