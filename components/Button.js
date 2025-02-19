// /components/Button.js
export default function Button({ children, onClick, type = 'button', variant = 'primary' }) {
  const baseClass =
    'py-2 px-4 rounded font-medium transition duration-200 focus:outline-none';
  const variants = {
    primary: 'bg-highlight text-white hover:bg-secondary',
    danger: 'bg-danger text-white hover:bg-red-700',
    success: 'bg-success text-white hover:bg-green-700',
    outline: 'border border-highlight text-highlight hover:bg-highlight hover:text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}