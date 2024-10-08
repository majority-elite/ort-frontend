import * as styles from './LoginModal.css';

const LoginModal = () => (
  <div className={styles.background}>
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <svg
          className={styles.logo}
          // width="480"
          // height="200"
          viewBox="0 0 480 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5">
            <path
              d="M6.31567 100C6.31567 48.2233 48.289 6.25 100.066 6.25H102.039C153.816 6.25 195.789 48.2233 195.789 100V100C195.789 151.777 153.816 193.75 102.039 193.75H100.066C48.289 193.75 6.31567 151.777 6.31567 100V100Z"
              fill="#F07F2E"
            />
          </g>
          <g opacity="0.5">
            <path
              d="M156.856 105.25C156.856 50.5738 201.18 6.25 255.856 6.25H342.987C343.4 6.25 343.735 6.58696 343.735 6.99956V6.99956C343.735 109.798 260.4 193.75 157.601 193.75V193.75C157.19 193.75 156.856 193.417 156.856 193.005V105.25Z"
              fill="#F07F2E"
            />
          </g>
          <g opacity="0.5">
            <path
              d="M284.21 13.4685C284.21 9.48182 287.442 6.25 291.429 6.25H466.466C470.452 6.25 473.684 9.48182 473.684 13.4685V99.0132C473.684 151.335 431.269 193.75 378.947 193.75V193.75C326.626 193.75 284.21 151.335 284.21 99.0132V13.4685Z"
              fill="#F07F2E"
            />
          </g>
        </svg>
        <p className={styles.text}>
          로그인하고 더 편리한
          <br />
          동아리 활동을 즐겨 보세요.
        </p>
        <button className={styles.loginButton}>
          <div className={styles.kakaoIcon}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.9934 5.83334C8.83044 5.83334 4.66675 9.16426 4.66675 13.208C4.66675 15.8328 6.39884 18.1312 8.99699 19.4436L8.11762 22.7279C8.10104 22.7772 8.09849 22.83 8.11025 22.8806C8.12202 22.9312 8.14763 22.9775 8.18424 23.0144C8.2376 23.0614 8.30627 23.0875 8.37743 23.0876C8.43643 23.0829 8.49241 23.0596 8.53732 23.021L12.3213 20.4695C12.8798 20.5466 13.4429 20.5866 14.0067 20.5894C19.1631 20.5894 23.3334 17.2585 23.3334 13.208C23.3334 9.1576 19.1497 5.83334 13.9934 5.83334Z"
                fill="#191919"
              />
            </svg>
          </div>
          <p className={styles.kakaoText}>카카오로 계속하기</p>
        </button>
      </div>
    </div>
  </div>
);

export default LoginModal;
