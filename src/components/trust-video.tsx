"use client";

import { useEffect, useRef, useState } from "react";

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

export function TrustVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
          setPlaying(true);
        } else {
          video.pause();
          setPlaying(false);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);

    if (!nextMuted) {
      video.play().catch(() => undefined);
      setPlaying(true);
    }
  }

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  async function enterFullscreen() {
    const frame = frameRef.current;
    const video = videoRef.current as WebkitVideo | null;

    try {
      if (frame?.requestFullscreen) {
        await frame.requestFullscreen();
        return;
      }

      video?.webkitEnterFullscreen?.();
    } catch {
      video?.webkitEnterFullscreen?.();
    }
  }

  return (
    <div className="trust-video-frame" ref={frameRef}>
      <video
        ref={videoRef}
        className="trust-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="trust-video-shade" />

      <div className="trust-video-topline">
        <span className="video-live-dot" />
        Mensagem da equipe · reproduzindo automaticamente
      </div>

      <div className="trust-video-controls">
        <button
          type="button"
          className="video-control"
          onClick={togglePlayback}
          aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
        >
          {playing ? "❚❚" : "▶"}
          <span>{playing ? "Pausar" : "Reproduzir"}</span>
        </button>

        <button
          type="button"
          className={muted ? "video-control video-control-accent" : "video-control"}
          onClick={toggleSound}
          aria-label={muted ? "Ativar som" : "Desativar som"}
        >
          {muted ? "🔇" : "🔊"}
          <span>{muted ? "Ativar som" : "Som ligado"}</span>
        </button>

        <button
          type="button"
          className="video-control"
          onClick={enterFullscreen}
          aria-label="Abrir vídeo em tela cheia"
        >
          ⛶
          <span>Tela cheia</span>
        </button>
      </div>
    </div>
  );
}
