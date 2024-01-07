'use client';
import { useState } from 'react';
import styles from './styles/page.module.css';
import { Game } from './components/Game';
import { Proof } from './zk/types';

export default function Page() {
  const [proof, setProof] = useState<Proof>();

  return (
    <div>
      <Game />
      <div className={styles.footer}>
        <h4>
          Blocks Left
          <br />
          <span>100</span>
        </h4>
        <h4>
          Score <br />
          <span>5</span>
        </h4>
      </div>
    </div>
  );
}
