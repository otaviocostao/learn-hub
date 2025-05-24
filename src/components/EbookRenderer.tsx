// src/components/EbookRenderer.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'; // Cuidado ao usar: permite HTML no markdown, pode ser um risco de XSS se o markdown vier de fontes não confiáveis.

interface EbookRendererProps {
  markdownContent: string;
}

const EbookRenderer: React.FC<EbookRendererProps> = ({ markdownContent }) => {
  return (
    <div className="prose prose-invert lg:prose-xl max-w-none bg-white/5 p-6 sm:p-8 rounded-lg shadow-md text-white">
      {/*
        'prose' é uma classe do plugin @tailwindcss/typography para estilizar conteúdo gerado
        'prose-invert' para modo escuro (texto claro em fundo escuro)
        'lg:prose-xl' para texto maior em telas grandes
        'max-w-none' para remover a restrição de largura padrão do prose, se o container já controla.
        As classes bg-white/5, p-6, etc são para o container do ebook.
      */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        // Descomente rehypeRaw se você PRECISA renderizar HTML dentro do seu markdown
        // e confia na fonte do markdown.
        // rehypePlugins={[rehypeRaw]}
        // Você pode customizar como cada elemento Markdown é renderizado usando o 'components' prop.
        // Exemplo:
        // components={{
        //   h1: ({node, ...props}) => <h1 className="text-3xl font-bold my-4 text-sky-400" {...props} />,
        //   p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
        //   // ... outros elementos
        // }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
};

export default EbookRenderer;