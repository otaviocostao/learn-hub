# Tarefas

- [x] Identificar os arquivos e o código CSS/JS relevantes para a sidebar e o header.
- [x] Analisar o mecanismo de colapso da sidebar.
- [x] Analisar como o header está sendo estilizado e posicionado.
- [x] Determinar por que o header não está se ajustando quando a sidebar é colapsada.
- [x] Propor e aplicar uma correção (CSS ou JS) para que o header se ajuste corretamente.
- [x] Marcar esta tarefa como concluída.

## Persistir estado da Sidebar

**Descrição:** Implementar a persistência do estado (colapsada/expandida) da barra lateral (sidebar) ao navegar entre as páginas da aplicação.

**Status:** Concluída

**Alterações realizadas:**

1.  Criação do `SidebarContext` em `src/context/SidebarContext.tsx` para gerenciar o estado globalmente.
2.  Envolvimento do componente principal (`BrowserRouter`) em `src/App.tsx` com o `SidebarProvider`.
3.  Modificação dos componentes `Navbar.tsx` e `AppSidebar.tsx` para utilizarem o `useSidebar` hook para acessar e modificar o estado de colapso da sidebar.

O estado da sidebar agora é mantido ao trocar de página. 

## Ajustar Conteúdo da Página ao Colapso da Sidebar

**Descrição:** Fazer com que o conteúdo principal da página se ajuste dinamicamente quando a sidebar é colapsada ou expandida.

**Status:** Concluída

**Alterações realizadas:**

1.  Criação do componente `src/components/MainLayout.tsx`:
    *   Inclui `AppSidebar` e `Navbar`.
    *   Utiliza o hook `useSidebar` para obter o estado de colapso.
    *   Renderiza o conteúdo da página (via `<Outlet />`) dentro de um elemento `<main>`.
    *   Aplica margem esquerda e preenchimento superior dinâmicos ao `<main>` para acomodar a sidebar e a navbar.
2.  Modificação de `src/App.tsx`:
    *   As rotas principais foram aninhadas sob uma rota que utiliza `MainLayout`.
    *   Isso garante que as páginas sejam renderizadas dentro do novo layout e que o conteúdo se ajuste ao estado da sidebar.

O conteúdo da página agora se redimensiona corretamente com a sidebar. 

## Corrigir Espaçamento Duplicado em Páginas Internas

**Descrição:** As páginas internas (`MyCourses`, `Discover`, `Schedule`, `Progress`, `Certificates`) estavam renderizando suas próprias sidebars/navbars e aplicando margens/preenchimentos que conflitavam com o `MainLayout`, causando espaçamento incorreto.

**Status:** Concluída

**Alterações realizadas:**

1.  Para cada uma das seguintes páginas:
    *   `src/pages/MyCourses.tsx`
    *   `src/pages/Discover.tsx`
    *   `src/pages/Schedule.tsx`
    *   `src/pages/Progress.tsx`
    *   `src/pages/Certificates.tsx`
2.  Foram removidas:
    *   Importações e renderizações locais de `AppSidebar` e `Navbar`.
    *   Estado local e lógica para controle do colapso da sidebar.
    *   Elementos `div` externos que aplicavam margens (`ml-20`/`ml-60`).
    *   Preenchimentos excessivos (como `pt-24`, `px-6`) nos elementos `<main>` internos ou wrappers principais, para evitar conflito com o `p-4` já aplicado pelo `MainLayout.tsx`.

**Resultado:** Todas as páginas agora dependem do `MainLayout.tsx` para a estrutura de layout e espaçamento, resultando em uma aparência consistente em toda a aplicação. 