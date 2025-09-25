import { PropsWithChildren } from 'react';
import styles from './Pocetna.module.css';


export function PocetnaOkvir({ children }: PropsWithChildren) {
  return <section className={styles.root}>{children}</section>;
}

export function Stack({ children }: PropsWithChildren) {
  return <div className={styles.stack}>{children}</div>;
}

export function TitleRow({ children }: PropsWithChildren) {
  return <div className={styles.titleRow}>{children}</div>;
}

export function RoleBadge({ children }: PropsWithChildren) {
  return <span className={styles.roleBadge}>{children}</span>;
}

export function Description({ children }: PropsWithChildren) {
  return <p className={styles.description}>{children}</p>;
}

export function Actions({ children }: PropsWithChildren) {
  return <div className={styles.actions}>{children}</div>;
}

/* Skeleton “okviri” (div oko Kostura) da bismo primenili dimenzije bez className u strani */
export function SkelTitle({ children }: PropsWithChildren) {
  return <div className={styles.skelTitle}>{children}</div>;
}
export function SkelWide({ children }: PropsWithChildren) {
  return <div className={styles.skelWide}>{children}</div>;
}
export function SkelHalf({ children }: PropsWithChildren) {
  return <div className={styles.skelHalf}>{children}</div>;
}
