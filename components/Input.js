// /components/Input.js
export default function Input({ type = 'text', placeholder, value, onChange, error }) {
    return (
      <div className="mb-4">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full p-3 border rounded focus:ring-2 focus:ring-highlight focus:outline-none ${
            error ? 'border-danger' : 'border-lightGray'
          }`}
        />
        {error && <p className="text-danger text-sm mt-1">{error}</p>}
      </div>
    );
  }
  