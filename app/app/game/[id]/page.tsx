'use client';
import { useEffect, useState } from 'react';
import { hasGameStarted, isGameFinished } from '@utils/game';
import { zeroAddress } from 'viem';
import QrInvite from '@components/lobbies/QrInvite';
import { JoinGameModal } from '@components/lobbies/modals/JoinGameModal';
import { PuzzleMemoized } from '@components/game/puzzle/Puzzle';
import { Footer } from '@components/game/Footer';
import { useBlockNumber } from '@hooks/useBlockNumber';
import { usePrivyWalletAddress } from '@hooks/usePrivyWalletAddress';
import { LoginCTA } from '@components/wallet/LoginCTA';
import { useGameAndPuzzleData } from '@hooks/fetching/useGameAndPuzzleData';
import { useDeepCompareMemo } from '@hooks/useDeepCompareMemo';
import { LoadingState } from '@components/zk/LoadingState';

export default function Page({ params: { id } }: { params: { id: string } }) {
  const blockNumber = useBlockNumber();
  const address = usePrivyWalletAddress();
  const [shouldPoll, setShouldPoll] = useState(true);
  const { data, loading, error } = useGameAndPuzzleData(id, shouldPoll);
  const [joinModalShowing, setJoinModalShowing] = useState<boolean>(true);
  const [yourScore, setYourScore] = useState<number>(0);
  const [opponentScore, setOpponentScore] = useState<number>(0);
  const stableInitConfig = useDeepCompareMemo(data?.initConfig);
  const gameFinished =
    data?.onChainGame &&
    blockNumber &&
    isGameFinished(blockNumber, data?.onChainGame);

  useEffect(() => {
    if (gameFinished) setShouldPoll(false);
  }, [gameFinished]);

  useEffect(() => {
    if (!data?.onChainGame || !address) return;

    const { onChainGame } = data;

    if (address == onChainGame.player1.address_) {
      setYourScore(onChainGame.player1.score);
      setOpponentScore(onChainGame.player2!.score);
    } else if (address == onChainGame.player2!.address_) {
      setYourScore(onChainGame.player2!.score);
      setOpponentScore(onChainGame.player1.score);
    }
  }, [data?.onChainGame, address]);

  if (!address && blockNumber) {
    return <LoginCTA />;
  }

  if (loading) {
    return LoadingState({ textMain: 'Loading game...' });
  }

  if (error !== undefined) {
    return LoadingState({ textMain: error });
  }

  const { onChainGame } = data;

  if (!data.onChainGame) {
    return LoadingState({ textMain: 'Game not found' });
  }

  if (
    onChainGame?.player1.address_ &&
    onChainGame?.player2?.address_ !== zeroAddress &&
    !hasGameStarted(blockNumber!, onChainGame)
  ) {
    return LoadingState({
      textMain: `Game starting in ${
        Number(onChainGame.startingBlock) - Number(blockNumber)
      } blocks`,
    });
  }

  if (isGameFinished(blockNumber!, onChainGame)) {
    return LoadingState({
      textMain: 'Game is finished',
      textSub:
        'Result: ' +
        (yourScore > opponentScore
          ? 'You Won'
          : yourScore === opponentScore
            ? 'Draw'
            : 'You Lost'),
    });
  }

  const displayQrInvite =
    address &&
    onChainGame.player1.address_ === address &&
    onChainGame.player2?.address_ === zeroAddress;

  const displayJoinModal =
    address &&
    onChainGame.player1.address_ !== address &&
    onChainGame.player1.address_ !== address &&
    onChainGame.player2?.address_ === zeroAddress;

  return (
    <div className="flex-grow">
      {displayQrInvite && !displayJoinModal && <QrInvite />}
      {!displayQrInvite && displayJoinModal && (
        <JoinGameModal
          game={onChainGame}
          setInputsShowing={setJoinModalShowing}
          gameId={id}
        />
      )}
      {stableInitConfig && (
        <PuzzleMemoized
          initConfig={stableInitConfig}
          id={id}
          gameMode="multiplayer"
        />
      )}
      {onChainGame && (
        <Footer
          gameId={id}
          yourScore={yourScore}
          opponentScore={opponentScore}
          data={data}
        />
      )}
    </div>
  );
}
