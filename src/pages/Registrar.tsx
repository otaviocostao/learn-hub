import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Registrar: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    console.log('Tentativa de cadastro com:', { name, email, password });
    alert('Funcionalidade de cadastro ainda não implementada.');
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
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="João da Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Cadastrar
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
