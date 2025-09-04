import React, { useState, useEffect } from 'react';
import { Play, Square, Download } from 'lucide-react';
import { Game } from '../types';

interface GameProcessorProps {
  games: Game[];
  onProcessComplete: (processed: Game[]) => void;
  onLog: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export default function GameProcessor({
  games,
  onProcessComplete,
  onLog,
  isProcessing,
  setIsProcessing
}: GameProcessorProps) {
  const [progress, setProgress] = useState(0);
  const [currentGame, setCurrentGame] = useState<string>('');
  const [processedGames, setProcessedGames] = useState<Game[]>([]);

  const processGames = async () => {
    if (games.length === 0) {
      onLog('No games to process');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessedGames([]);
    onLog(`Starting to process ${games.length} games...`);

    const results: Game[] = [];

    for (let i = 0; i < games.length; i++) {
      const game = games[i];
      setCurrentGame(game.name);
      onLog(`Processing: ${game.name}`);

      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For now, just mark as completed with placeholder data
        const updatedGame = {
          ...game,
          status: 'completed' as const,
          portada: game.portada || 'https://via.placeholder.com/300x400?text=No+Cover',
          año: game.año || '2024',
          descripción: game.descripción || 'Game description not available'
        };
        results.push(updatedGame);
        onLog(`✓ Processed: ${game.name}`);

      } catch (error) {
        results.push({ ...game, status: 'error' as const });
        onLog(`✗ Error processing: ${game.name}`);
      }

      setProgress(((i + 1) / games.length) * 100);
    }

    setProcessedGames(results);
    setIsProcessing(false);
    setCurrentGame('');
    onProcessComplete(results);
    onLog(`Processing completed: ${results.length} games processed`);
  };

  const handleStart = () => {
    processGames();
  };

  const handleStop = () => {
    setIsProcessing(false);
    setCurrentGame('');
    onLog('Processing stopped by user');
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Download className="w-5 h-5 mr-2 text-green-500" />
          Process Games
        </h3>

        <div className="space-y-4">
          <div className="flex space-x-3">
            {!isProcessing ? (
              <button
                onClick={handleStart}
                disabled={games.length === 0}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Processing ({games.length} games)
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Processing
              </button>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentGame && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  Processing: {currentGame}
                </p>
              )}
            </div>
          )}

          {!isProcessing && processedGames.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ✅ Processing completed! {processedGames.filter(g => g.status === 'completed').length} games processed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
