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
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AuthFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const router = useRouter();

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
	setLoginError('');
	
	try {
	  // Simulação de autenticação - substitua pela sua lógica real
	  // Credenciais de exemplo para demonstração
	  const validEmail = 'admin@jomorais.com';
	  const validPassword = 'admin123';
	  
	  // Simula delay de autenticação
	  await new Promise(resolve => setTimeout(resolve, 1500));
	  
	  if (data.email === validEmail && data.password === validPassword) {
		// Login bem-sucedido - redireciona para admin
		console.log('Login bem-sucedido!');
		router.push('/admin');
	  } else {
		// Credenciais inválidas
		setLoginError('Email ou senha incorretos. Tente: admin@jomorais.com / admin123');
	  }
	} catch (error) {
	  console.error('Erro na autenticação:', error);
	  setLoginError('Erro interno. Tente novamente.');
	}
  };

  return (
	<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
	  {/* Decorative background elements */}
	  <div className="absolute inset-0 overflow-hidden">
		<div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FFD700]/10 rounded-full"></div>
		<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#2d5016]/10 rounded-full"></div>
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#FFD700]/5 to-[#2d5016]/5 rounded-full"></div>
	  </div>

	  <div className="relative w-full max-w-md">
		{/* Back to landing page */}
		<div className="mb-6">
		  <Link href="/landing" className="text-gray-600 hover:text-[#2d5016] flex items-center space-x-2 transition-colors font-medium">
			<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
			</svg>
			<span>Voltar ao site</span>
		  </Link>
		</div>

		{/* Login form */}
		<div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
		  <div className="relative z-10">
		  {/* Logo and welcome section */}
		  <div className="text-center mb-8">
			<div className="mb-6 bg-gradient-to-br from-[#FFD700]/20 via-[#FFC107]/15 to-[#FFD700]/10 rounded-2xl p-4 w-24 h-24 mx-auto border-2 border-[#FFD700]/30 items-center flex justify-center shadow-lg ring-1 ring-[#FFD700]/20">
			  <Image
				src={icon}
				alt="Jomorais Logo"
				width={60}
				height={55}
				className="mx-auto"
			  />
			</div>
			<h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
			  Portal Escolar
			</h1>
			<p className="text-gray-600 text-base">
			  Entre com suas credenciais para acessar o sistema <span className="text-[#2d5016] font-semibold">JOMORAIS</span>
			</p>
			
			{/* Demo credentials info */}
			<div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
			  <p className="font-semibold mb-1">Credenciais de demonstração:</p>
			  <p><strong>Email:</strong> admin@jomorais.com</p>
			  <p><strong>Senha:</strong> admin123</p>
			</div>
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
					  className={`pl-10 h-12 border-gray-200 focus:border-[#2d5016] focus:ring-[#2d5016]/20 ${
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
					  className={`pl-10 pr-10 h-12 border-gray-200 focus:border-[#2d5016] focus:ring-[#2d5016]/20 ${
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
				  className="w-4 h-4 text-[#2d5016] border-gray-300 rounded focus:ring-[#2d5016] focus:ring-2"
				/>
				<span className="text-sm text-gray-600">Remember me</span>
			  </label>
			  <button
				type="button"
				className="text-sm text-[#2d5016] hover:text-[#3d6b1f] font-medium transition-colors"
			  >
				Forgot password?
			  </button>
			</div>

			{/* Error message */}
			{loginError && (
			  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
				{loginError}
			  </div>
			)}

			{/* Login button */}
			<Button
			  type="submit"
			  disabled={isSubmitting}
			  className="w-full h-12 mb-8 bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] hover:from-[#3d6b1f] hover:to-[#2d5016] text-white font-semibold rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
			>
			  {isSubmitting ? 'Entrando...' : 'Entrar'}
			</Button>

		  </form>
		  </div>
		</div>

		{/* Help section */}
		<div className="text-center mt-6">
		  <p className="text-gray-600 text-sm">
			Problemas para acessar?{" "}
			<Button
			  variant="link"
			  className="text-[#2d5016] hover:text-[#3d6b1f] font-medium p-0 h-auto underline-offset-4 transition-colors cursor-pointer"
			>
			   Entre em contato
			</Button>
		  </p>
		</div>
	  </div>
	</div>
  );
}
