import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PlayCircle, Check, Star } from 'lucide-react';

const IntroducaoCurso = () => {
  return (
    <div className="animate-fade-in p-6">
      {/* Breadcrumbs */}
    

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1">
          {/* Course Header */}
          <h1 className="text-4xl font-bold text-white mb-2">
            Curso: Introdução ao Windows 11
          </h1>

          <div className="flex items-center text-gray-400 text-sm mb-8">
            <span className="flex items-center mr-4">
              <PlayCircle size={16} className="mr-1" /> Última atualização em 05/2025
            </span>
            <span className="flex items-center mr-4">
              <PlayCircle size={16} className="mr-1" /> Português
            </span>
          </div>

          {/* What you'll learn section */}
          <Card className="bg-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">O que você aprenderá</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-2 mt-1" />
                <span>Poderão montar qualquer tipo de site estático, seja ele o seu próprio portfólio, seu site pessoal ou a apresentação de sua empresa na internet</span>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-2 mt-1" />
                <span>Criar sites responsivos de verdade</span>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-2 mt-1" />
                <span>Criar layouts complexos com flexbox e CSS grid</span>
              </div>
              <div className="flex items-start">
                <Check size={20} className="text-green-400 mr-2 mt-1" />
                <span>Criar efeitos super interessantes com CSS3</span>
              </div>
            </div>
          </Card>

          {/* Explore related topics */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Explorar temas relacionados</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-gray-600 text-gray-300 px-3 py-1">HTML</Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300 px-3 py-1">Desenvolvimento Web</Badge>
              <Badge variant="outline" className="border-gray-600 text-gray-300 px-3 py-1">Desenvolvimento</Badge>
            </div>
          </div>

          {/* This course includes */}
          <Card className="bg-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Este curso inclui:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
              <div className="flex items-center">
                <PlayCircle size={20} className="text-gray-400 mr-2" />
                <span>131,5 horas de vídeo sob demanda</span>
              </div>
              <div className="flex items-center">
                <PlayCircle size={20} className="text-gray-400 mr-2" />
                <span>Acesso no dispositivo móvel e na TV</span>
              </div>
              {/* Add more items as needed */}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <Card className="flex flex-col items-center justify-center w-full lg:w-96 bg-gray-800 p-6 flex-shrink-0">
          <img src="/images/informatica_basica.jpg" alt="Curso" className="w-full h-48 object-cover rounded-md mb-4" />
          <Separator className="bg-gray-700 mb-4" />

          <div className="text-center text-white text-2xl font-bold mb-4 line-through">
            R$ 99,99
          </div>
          <div className="text-center text-white text-4xl font-bold mb-4">
            R$ 00,00
          </div>
          <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 mb-2 rounded-md">
            Ir para o curso
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default IntroducaoCurso;
