import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Componente Accordion da Shadcn UI
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Mail, LifeBuoy } from 'lucide-react';

// Interface para um item de FAQ
interface FAQItem {
  id: string;
  question: string;
  answer: string | JSX.Element; // A resposta pode ser texto simples ou JSX mais complexo
  category: string;
}

// Dados mockados para as FAQs (substitua pelos seus)
const faqData: FAQItem[] = [
  {
    id: 'q1',
    question: "Como me inscrevo em um curso?",
    answer: "Para se inscrever em um curso, navegue até a página 'Descobrir Novos Cursos' na página inicial, encontre o curso desejado e clique no botão de inscrição ou 'Acessar Curso'. Se o curso for pago, você será direcionado para a página de pagamento.",
    category: 'Geral',
  },
  {
    id: 'q2',
    question: "Onde posso ver meu progresso nos cursos?",
    answer: "Você pode ver o progresso de todos os seus cursos na página 'Meus Cursos'. O progresso individual de cada aula também é exibido na página da aula.",
    category: 'Cursos',
  },
  
  {
    id: 'q3',
    question: "Os cursos possuem certificado?",
    answer: "Alguns cursos podem oferecer um certificado de conclusão. Essa informação geralmente está disponível na página de detalhes do curso. Após concluir todas as aulas, se um certificado estiver disponível, você encontrará instruções sobre como acessá-lo.",
    category: 'Cursos',
  },
  {
    id: 'q4',
    question: "Como funciona o modelo de e-book?",
    answer: "Aulas no formato e-book apresentam o conteúdo em formato de texto, similar a um capítulo de livro digital. Você pode ler no seu próprio ritmo e, ao final, marcar como concluído para avançar no curso.",
    category: 'Geral',
  },
  {
    id: 'q5',
    question: "Como funciona o modelo de vídeo?",
    answer: "Aulas no formato de vídeo apresentam o conteúdo em um player do YouTube, onde você pode assistir alterar suas preferências de exibição. Você pode assistir no seu próprio ritmo e, ao final, a aula será marcada como assistida automáticamente.",
    category: 'Geral',
  },
  // Adicione mais perguntas e respostas aqui
];

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>(faqData);

  // Filtrar FAQs com base no termo de busca
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFaqs(faqData);
      return;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    const results = faqData.filter(faq =>
      faq.question.toLowerCase().includes(lowercasedFilter) ||
      (typeof faq.answer === 'string' && faq.answer.toLowerCase().includes(lowercasedFilter)) ||
      faq.category.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredFaqs(results);
  }, [searchTerm]);

  // Agrupar FAQs por categoria
  const faqsByCategory: Record<string, FAQItem[]> = filteredFaqs.reduce((acc, faq) => {
    acc[faq.category] = [...(acc[faq.category] || []), faq];
    return acc;
  }, {} as Record<string, FAQItem[]>);


  return (
    <div className="animate-fade-in p-4 md:p-6 lg:p-8 max-w-4xl mx-auto text-white">
      <header className="text-center mb-10">
        <LifeBuoy size={48} className="mx-auto text-sky-400 mb-4" />
        <h1 className="text-4xl font-bold text-gradient mb-2">Central de Ajuda</h1>
        <p className="text-lg text-white/70">Encontre respostas para suas dúvidas ou entre em contato conosco.</p>
      </header>

      {/* Barra de Busca (Opcional) */}
      <div className="mb-8 relative">
        <Input
          type="search"
          placeholder="Buscar por palavras-chave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/20 border-white/10 placeholder:text-white/40 focus:border-sky-500 h-12"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
      </div>

      {/* Seção de FAQs */}
      {Object.keys(faqsByCategory).length > 0 ? (
        Object.entries(faqsByCategory).map(([category, faqs]) => (
          <section key={category} className="mb-8">
            <h2 className="text-2xl font-semibold text-sky-400 mb-4 border-b border-white/10 pb-2">{category}</h2>
            {faqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-2">
                {faqs.map((faq) => (
                    <AccordionItem 
                        key={faq.id} 
                        value={faq.id} 
                        className="bg-black/20 border border-white/10 rounded-lg px-4 hover:border-white/20 transition-colors"
                    >
                    <AccordionTrigger className="text-left hover:no-underline text-base py-4 font-medium text-white">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 pb-4 text-sm leading-relaxed">
                        {typeof faq.answer === 'string' ? <p>{faq.answer}</p> : faq.answer}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            ) : (
                <p className="text-white/60 italic">Nenhuma pergunta encontrada nesta categoria para sua busca.</p>
            )}
          </section>
        ))
      ) : (
        <p className="text-white/70 text-center py-6">
          Nenhuma FAQ encontrada para "{searchTerm}". Tente outros termos de busca.
        </p>
      )}


      {/* Seção de Contato (Exemplo) */}
      <Card className="mt-12 bg-black/20 border-white/10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Ainda precisa de ajuda?</CardTitle>
          <CardDescription className="text-white/70">
            Se não encontrou a resposta que procurava, entre em contato conosco.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-white mb-1">Suporte por E-mail</h3>
            <p className="text-sm text-white/70">
              Envie um e-mail para <a href="mailto:suporte@learnhub.com" className="text-sky-400 hover:underline">suporte@learnhub.com</a> e responderemos o mais breve possível.
            </p>
          </div>
          {/* Você pode adicionar um formulário de contato aqui se preferir */}
          {/* Exemplo de formulário simples:
          <form onSubmit={(e) => { e.preventDefault(); toast.info("Formulário de contato enviado (simulação)."); }}>
            <div className="grid gap-2 mb-3">
              <Label htmlFor="contact-name" className="text-white/90">Seu Nome</Label>
              <Input id="contact-name" placeholder="João Silva" className="bg-slate-700 border-slate-600" required/>
            </div>
            <div className="grid gap-2 mb-3">
              <Label htmlFor="contact-email" className="text-white/90">Seu E-mail</Label>
              <Input id="contact-email" type="email" placeholder="joao@example.com" className="bg-slate-700 border-slate-600" required/>
            </div>
            <div className="grid gap-2 mb-4">
              <Label htmlFor="contact-message" className="text-white/90">Sua Mensagem</Label>
              <Textarea id="contact-message" placeholder="Descreva sua dúvida ou problema..." className="bg-slate-700 border-slate-600 min-h-[100px]" required/>
            </div>
            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">Enviar Mensagem</Button>
          </form>
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;