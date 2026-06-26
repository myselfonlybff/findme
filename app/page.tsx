"use client";

import { useState, useEffect, useRef } from 'react';

// Interface pour définir la structure d'une carte
interface CardObject {
  emoji: string;
  id: number;
}

const THEMES: Record<string, string[]> = {
  Fruits: ['🍎','🍌','🥝','🍇','🍋','🍉','🍓','🥭','🍊','🥥'],
  Fleurs: ['🌸','🌼','🌺','🌹','🌻','🌷','🍁','🍂','🥀','🪻'],
  Animaux: ['🐶','🐱','🐵','🦊','🐼','🦁','🐸','🦉','🐢','🐎'],
  Nourriture: ['🍔','🍕','🍣','🍩','🍪','🍰','🍜','🌮','🍗','🍱'],
  Smileys: ['😀','😂','😅','😊','😎','😇','😜','🤔','🥳','😌']
};

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [cards, setCards] = useState<CardObject[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [shakeCards, setShakeCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Gestion du thème sombre persistant au premier rendu
  useEffect(() => {
    const savedTheme = localStorage.getItem('mf_theme') || 'light';
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const nextTheme = !isDarkMode;
    setIsDarkMode(nextTheme);
    localStorage.setItem('mf_theme', nextTheme ? 'dark' : 'light');
  };

useEffect(() => {
  if (isDarkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark-theme');
  }
}, [isDarkMode]);
  // Chronomètre du jeu
  useEffect(() => {
    if (selectedTheme && !isLocked && !showVictory) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedTheme, isLocked, showVictory]);

  // Initialisation du plateau
  const startGame = (themeName: string) => {
    setSelectedTheme(themeName);
    const themeItems = THEMES[themeName];
    const duplicatedDeck = [...themeItems, ...themeItems];
    
    // Mélange Fisher-Yates
    const shuffledDeck = duplicatedDeck
      .map((emoji, index) => ({ emoji, id: index + Math.random() }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffledDeck);
    setFlippedCards([]);
    setMatchedCards([]);
    setShakeCards([]);
    setMoves(0);
    setTimeLeft(0);
    setShowVictory(false);
    
   // Remplace la fin de startGame par :
setIsLocked(true);
setIsFlashing(true); // C'est ça qui va retourner tout le plateau au départ
setTimeout(() => {
  setIsLocked(false);
  setIsFlashing(false); // Cache tout le plateau après 3 secondes
}, 3000);
  };

  const handleCardClick = (index: number) => {
    if (isLocked || flippedCards.includes(index) || matchedCards.includes(index) || flippedCards.length === 2) {
      return;
    }

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        // Paire trouvée
        setTimeout(() => {
          const updatedMatches = [...matchedCards, firstIndex, secondIndex];
          setMatchedCards(updatedMatches);
          setFlippedCards([]);
          setIsLocked(false);

          if (updatedMatches.length === cards.length) {
            setShowVictory(true);
          }
        }, 600);
      } else {
        // Échec : Secouer puis retourner
        setTimeout(() => {
          setShakeCards([firstIndex, secondIndex]);
        }, 180);

        setTimeout(() => {
          setFlippedCards([]);
          setShakeCards([]);
          setIsLocked(false);
        }, 800);
      }
    }
  };

  // Bonus Flash (Révèle l'ensemble des cartes pendant 1 seconde)
  const triggerFlashBonus = () => {
  if (isLocked || showVictory) return;
  setIsLocked(true);
  setIsFlashing(true); // Révèle tout

  setTimeout(() => {
    setIsFlashing(false); // Cache tout
    setIsLocked(false);
  }, 1000);
};
  const resetMenu = () => {
    setSelectedTheme(null);
    setCards([]);
    setShowVictory(false);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-theme' : ''}`} data-theme={isDarkMode ? 'dark' : 'light'}>
      <header className="header">
        <div className="brand">
          <div className="logo">🧠</div>
          <div>
            <div className="title">Mémory Flash</div>
            <div className="subtitle">Choisis un thème et retrouve les paires correspondantes</div>
          </div>
        </div>

        <div className="controls">
          <button className="btn" onClick={resetMenu}>Accueil</button>
          {selectedTheme && (
            <button className="btn" onClick={() => startGame(selectedTheme)}>Rejouer</button>
          )}
          <button className="icon-btn" onClick={toggleTheme}>
            {isDarkMode ? '☀️' : '🌚'}
          </button>
        </div>
      </header>

      <main style={{ width: '100%' }}>
        {!selectedTheme ? (
          <section className="panel">
            <h2 style={{ margin: '0 0 12px 0' }}>Choisis un thème</h2>
            <div className="home-grid">
              {Object.keys(THEMES).map((name) => (
                <button key={name} className="theme-card" onClick={() => startGame(name)}>
                  <div className="theme-emoji">{THEMES[name][0]}</div>
                  <div className="theme-name">{name}</div>
                  <div className="theme-desc">{THEMES[name].slice(0, 4).join(' ')} ...</div>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="panel">
            <div className="game-top">
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div className="badge">{selectedTheme}</div>
                  <div className="small">{THEMES[selectedTheme].slice(0, 5).join(' ')}</div>
                </div>
                <div className="stats">
                  <div className="stat">Temps : {timeLeft}s</div>
                  <div className="stat">Coups : {moves}</div>
                  <div className="stat">Paires : {matchedCards.length / 2}/10</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button className="btn" onClick={triggerFlashBonus}>✴️ Flash</button>
                <button className="btn" onClick={resetMenu}>⬅️ Retour</button>
              </div>
            </div>

            <div className="board-wrap">
              <div className="board">
                {cards.map((card, index) => {

                  const isFlipped = isFlashing || flippedCards.includes(index) || matchedCards.includes(index);
                  const hasMatched = matchedCards.includes(index);
                  const isShaking = shakeCards.includes(index);

                  return (
                    <div
                      key={card.id}
                      className={`card ${isFlipped ? 'flipped' : ''} ${hasMatched ? 'matched' : ''} ${isShaking ? 'shake' : ''}`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="card-inner">
                        <div className="face front">{card.emoji}</div>
                        <div className="face back">♤</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      {showVictory && (
        <div id="victory">
          <div className="victory-card">
            <h2>🎉 Victoire !</h2>
            <p>Temps final : {timeLeft} s</p>
            <p>Coups : {moves}</p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <button className="btn" onClick={() => startGame(selectedTheme!)}>Rejouer</button>
              <button className="btn" onClick={resetMenu}>Accueil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}