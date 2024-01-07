import styles from './page.module.scss';

async function getLobbies() {
  const MockLobbies = [
    {
      id: 1,
      player1: '0x84526CB0b3A0765FbD24E9CBb7d08B0FC2216B7a',
      puzzles: '0x84526CB0b3A0765FbD24E9CBb7d08B0FC2216B7a',
      interval: 100,
      stake: 1,
    },
    {
      id: 2,
      player1: '0x84526CB0b3A0765FbD24E9CBb7d08B0FC2216B7a',
      puzzles: '0x84526CB0b3A0765FbD24E9CBb7d08B0FC2216B7a',
      interval: 100,
      stake: 1,
    },
  ];
  const lobbiesElements = await Promise.all(
    MockLobbies.map((lobby) => (
      <tr key={lobby.id} className={styles.lobby}>
        <td>{lobby.id}</td>
        <td>{lobby.player1}</td>
        <td>{lobby.puzzles}</td>
        <td>{lobby.interval}</td>
        <td>{1}</td>
        <td>
          <button>join</button>
        </td>
      </tr>
    ))
  );
  return lobbiesElements;
}

export default async function Page() {
  const lobbiesElements = await getLobbies();

  return (
    <div className={styles.lobbies}>
      <h1>Lobbies</h1>
      <div className={styles.createLobby}>
        <button>Create a game</button>
      </div>

      <table className={styles.availableLobbies}>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Player 1</th>
            <th>Puzzles</th>
            <th>Interval (blocks)</th>
            <th>Stake</th>
            <th></th>
          </tr>
          {lobbiesElements}
        </tbody>
      </table>
    </div>
  );
}
