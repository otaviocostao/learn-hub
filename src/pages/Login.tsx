import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth'; // Importar de firebase/auth
import { auth } from '@/services/firebase_config'; // Importar sua instância do auth
import { FirebaseError } from 'firebase/app'; // Para tipagem de erro do Firebase

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores
    setIsLoading(true);

    try {
      // 1. Tentar fazer login do usuário no Firebase Authentication
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Usuário logado com sucesso:', user);
      setIsLoading(false);

      // 2. Redirecionar para a página inicial ou dashboard
      // O Firebase Auth já define o estado de autenticação globalmente.
      // Se você tiver um listener onAuthStateChanged no seu App.tsx ou em um contexto,
      // ele detectará a mudança e poderá atualizar o estado global do usuário.
      navigate('/'); // Redireciona para a página inicial após o login

    } catch (err) {
      setIsLoading(false);
      console.error('Erro no login:', err);
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password': // O Firebase pode retornar 'auth/invalid-credential' para ambos
          case 'auth/invalid-credential': // Erro mais genérico para email/senha inválidos
            setError('E-mail ou senha inválidos.');
            break;
          case 'auth/invalid-email':
            setError('O formato do e-mail é inválido.');
            break;
          case 'auth/user-disabled':
            setError('Esta conta de usuário foi desabilitada.');
            break;
          default:
            setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
        }
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
          <CardTitle className="text-2xl">Entrar no LearnHub</CardTitle>
          <CardDescription>Digite seu e-mail abaixo para entrar na sua conta</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="grid gap-4">
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
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {/* Link para recuperação de senha (opcional) */}
          <div className="text-sm">
            <Link
              to="/recuperar-senha" // Crie esta rota e componente se desejar
              className="underline text-muted-foreground hover:text-primary"
            >
              Esqueceu sua senha?
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link to="/registrar" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;