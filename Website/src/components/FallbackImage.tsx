import { useEffect, useState } from "react";

export const PROVIDER_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1579684453423-f84349ef60b0?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1559135197-8a45ea74d367?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&w=1400&q=80",
] as const;

interface FallbackImageProps {
  src?: string | null;
  alt: string;
  seed: string;
  className: string;
}

const getStartIndex = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }
  return hash % PROVIDER_FALLBACK_IMAGES.length;
};

export default function FallbackImage({
  src,
  alt,
  seed,
  className,
}: FallbackImageProps) {
  const [primaryFailed, setPrimaryFailed] = useState(!src);
  const [fallbackAttempt, setFallbackAttempt] = useState(0);
  const [allImagesFailed, setAllImagesFailed] = useState(false);
  const startIndex = getStartIndex(seed);
  const isFallback = primaryFailed;
  const fallbackSrc =
    PROVIDER_FALLBACK_IMAGES[
      (startIndex + fallbackAttempt) % PROVIDER_FALLBACK_IMAGES.length
    ];

  useEffect(() => {
    setPrimaryFailed(!src);
    setFallbackAttempt(0);
    setAllImagesFailed(false);
  }, [src, seed]);

  const handleError = () => {
    if (!primaryFailed && src) {
      setPrimaryFailed(true);
      return;
    }

    if (fallbackAttempt + 1 >= PROVIDER_FALLBACK_IMAGES.length) {
      setAllImagesFailed(true);
      return;
    }

    setFallbackAttempt((attempt) => attempt + 1);
  };

  return (
    <>
      {!allImagesFailed && (
        <img
          src={isFallback ? fallbackSrc : src ?? fallbackSrc}
          alt={isFallback ? "Illustrative healthcare facility image" : alt}
          referrerPolicy="no-referrer"
          onError={handleError}
          className={className}
        />
      )}
    </>
  );
}
