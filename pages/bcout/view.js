import styles from '../../styles/404.module.css';

export const NotFoundPage = () => {
  return (
    <>
      <div className={styles.container}>
        <h1>404 - Page Not Found</h1>
        <p>Sorry, there is nothing to see here</p>
      </div>
    </>
  );
};