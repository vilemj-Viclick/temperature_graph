import {
  useEffect,
  useRef,
} from 'react';

export interface AlertSoundProps {
  readonly play: boolean;
}

export const AlertSoundPlayer: React.FC<AlertSoundProps> = ({ play }) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = ref.current;
    if (audioElement && play) {
      audioElement.play();

      return () => audioElement.pause();
    }

    return undefined;
  }, [play]);

  return (
    <audio
      ref={ref}
      src="/assets/alarm.wav"
      loop
    />
  );
};
