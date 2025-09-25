"use client";

"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import icon from "../assets/images/icon.png";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { authSchema } from "@/validations/auth.validations";
import backgroundAuth from "../assets/images/background-auth.jpg";

interface AuthFormData {
  email: string;
  password: string;
}

export default function Auth() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AuthFormData>({
    resolver: yupResolver(authSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      console.log('Form data:', data);
      // Aqui você pode implementar a lógica de autenticação
      // Por exemplo: await signIn(data.email, data.password);
    } catch (error) {
      console.error('Erro na autenticação:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B6C4D] via-[#4a7c5d] to-[#3B6C4D] flex items-center justify-center p-4"  >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FDD401] rounded-full opacity-10 blur-xl"></div>
        <div className="absolute top-1/4 right-10 w-24 h-24 bg-[#FDD401] rounded-full opacity-15 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#FDD401] rounded-full opacity-10 blur-lg"></div>
        <div className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-white rounded-full opacity-5 blur-md"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login form */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Logo and welcome section */}
          <div className="text-center mb-8">
            <div className="mb-4 bg-[#457758]/20 rounded-full p-4 w-20 h-20 mx-auto border border-white/20 items-center flex justify-center">
              <Image
                src={icon}
                alt="Jomorais Logo"
                width={68}
                height={48}
                className="mx-auto"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Acessa a tua conta
            </h1>
            <p className="text-gray-600 text-sm">
              Preencha os campos para entrar na sua conta Jomorais
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email input */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="Digite teu email"
                      className={`pl-10 h-12 border-gray-200 focus:border-[#3B6C4D] focus:ring-[#3B6C4D]/20 ${
                        errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password input */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite tua senha"
                      className={`pl-10 pr-10 h-12 border-gray-200 focus:border-[#3B6C4D] focus:ring-[#3B6C4D]/20 ${
                        errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
                      }`}
                    />
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Remember me and forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#3B6C4D] border-gray-300 rounded focus:ring-[#3B6C4D] focus:ring-2"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#3B6C4D] hover:text-[#4a7c5d] font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 mb-8 bg-gradient-to-r from-[#3B6C4D] to-[#4a7c5d] hover:from-[#4a7c5d] hover:to-[#3B6C4D] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

          </form>
        </div>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <p className="text-white/80 text-sm">
            Não tem uma conta?{" "}
            <Button
              variant="link"
              className="text-[#FDD401] hover:text-yellow-300 font-semibold p-0 h-auto underline-offset-4 transition-colors cursor-pointer"
            >
               Criar Conta
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
