import React from "react";

const AuthForm = ({ onSubmit, fields, buttonText }) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="auth-form">
      {fields.map((field) => (
        <div key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={field.value} // Asegura que usa el estado del componente padre
            onChange={field.onChange} // Usa la función del componente padre
            required={field.required}
          />
        </div>
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default AuthForm;
