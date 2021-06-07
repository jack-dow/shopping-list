import DarkModeToggle from '../components/DarkModeToggle';
import Toast from '../components/Toast';

export default function Home() {
  return (
    <div>
      <div>New Project!</div>
      <button
        type="button"
        onClick={() => {
          Toast({
            text: 'An unexpected error occured. Please try again later',
            duration: 2000,
          });
        }}
      >
        Click for toast!
      </button>
      <DarkModeToggle />
    </div>
  );
}
