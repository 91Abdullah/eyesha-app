// /components/Form.js
import Input from './Input';
import Button from './Button';

export default function Form({ fields, onSubmit, submitText, errorMessage, successMessage }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-lg p-6 rounded">
      {fields.map(({ type, placeholder, value, onChange, error }, index) => (
        <Input
          key={index}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          error={error}
        />
      ))}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <Button type="submit" variant="primary">
        {submitText}
      </Button>
    </form>
  );
}
