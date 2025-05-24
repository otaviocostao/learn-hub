// src/components/LessonPlayer.tsx

import React from 'react';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';

interface LessonPlayerProps {
  videoId: string;
  onVideoEnd?: () => void;
  // Adicione outras props que precisar
}

const LessonPlayer: React.FC<LessonPlayerProps> = ({ videoId, onVideoEnd }) => {
  const playerRef = React.useRef<YouTubePlayer | null>(null);

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    // console.log('Player is ready:', event.target);
  };

  const onStateChange: YouTubeProps['onStateChange'] = (event) => {
    // console.log('Player state changed:', event.data);
    if (event.data === 0 && onVideoEnd) { // 0 = YT.PlayerState.ENDED
      onVideoEnd();
    }
  };

  const onError: YouTubeProps['onError'] = (event) => {
    console.error('YouTube Player Error:', event.data);
  };

  const opts: YouTubeProps['opts'] = {
    // Remova completamente height e width daqui para controle total via CSS
    // height: '100%', // NÃO FAÇA ISSO AQUI
    // width: '100%',  // NEM ISSO
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0,
      showinfo: 0,
      modestbranding: 1,
      fs: 1,
      iv_load_policy: 3,
      // 'origin': window.location.origin, // Descomente se necessário para o deploy
    },
  };

  return (
    // Este div é o container principal do player.
    // `aspect-video` define a proporção.
    // `w-full` faz ele ocupar a largura disponível do seu pai em `Lesson.tsx`.
    // `max-w-4xl` limita a largura máxima (opcional, mas bom para layouts grandes).
    // `mx-auto` centraliza se a largura for menor que a disponível.
    // `rounded-lg overflow-hidden` para bordas arredondadas e garantir que o iframe não vaze.
    <div className="relative w-full aspect-video max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
        onError={onError}
        // className aplica-se ao container que o react-youtube pode criar
        className="absolute top-0 left-0 w-full h-full"
        // iframeClassName aplica-se diretamente ao elemento <iframe>
        iframeClassName="absolute top-0 left-0 w-full h-full"
      />
    </div>
  );
};

export default LessonPlayer;