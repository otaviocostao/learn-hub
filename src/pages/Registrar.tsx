// src/pages/Registrar.tsx (ou onde estiver seu componente)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Importar useNavigate
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, UserCredential, updateProfile } from 'firebase/auth'; // Importar de firebase/auth
import { auth } from '@/services/firebase_config'; // Importar sua instância do auth
import { createUserProfile } from '@/services/user_service'; // Importar seu serviço de usuário
import { FirebaseError } from 'firebase/app'; // Para tipagem de erro do Firebase

const Registrar: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook para navegação

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criar usuário no Firebase Authentication
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Usuário criado no Firebase Auth:', user);

      // 2. (Opcional, mas recomendado) Atualizar o nome de exibição no Firebase Auth
      if (user) {
        await updateProfile(user, {
          displayName: name,
          // photoURL: "URL_DA_FOTO_PADRAO_SE_TIVER"
        });
      }

      // 3. Criar perfil do usuário no Firestore
      // Certifique-se que 'auth.currentUser' não é null, ou use user.uid diretamente
      if (user && user.uid) {
        await createUserProfile(user.uid, {
          email: user.email || email, // user.email deve existir
          name: name,
          roles: ['user'], // Define a role padrão
          // enrolledCourseIds: [] // Pode ser inicializado no createUserProfile
        });
        console.log('Perfil do usuário criado no Firestore para UID:', user.uid);
      } else {
        throw new Error("UID do usuário não encontrado após o registro.");
      }

      setIsLoading(false);
      alert('Cadastro realizado com sucesso! Você será redirecionado.');
      // 4. Redirecionar para a página de login ou dashboard
      navigate('/'); // ou '/dashboard' ou '/login' para ele fazer login
      // Se você quiser que ele já entre logado, o Firebase Auth já cuida disso.
      // Apenas redirecione para uma página protegida.

    } catch (err) {
      setIsLoading(false);
      console.error('Erro no cadastro:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('Este e-mail já está em uso.');
            break;
          case 'auth/invalid-email':
            setError('O formato do e-mail é inválido.');
            break;
          case 'auth/weak-password':
            setError('A senha é muito fraca. Use pelo menos 6 caracteres.');
            break;
          default:
            setError('Ocorreu um erro ao tentar cadastrar. Tente novamente.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 15%, rgba(59, 130, 246, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 85% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 60%),
          radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)
        `,
        backgroundAttachment: 'fixed',
        backgroundColor: 'hsl(var(--background))'
      }}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Cadastrar no LearnHub</CardTitle>
          <CardDescription>Digite seus dados para criar uma conta</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seuemail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Repita sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground">
            Já tem uma conta?{' '}
            <Link to="/login" className="underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Registrar;