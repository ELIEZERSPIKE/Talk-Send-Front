import React from 'react'
import './Input.css'

export default function Input({
    value,
    onChange,
    placeholder,
    type,
    label,
    reference

}) {
  return (
    <div>
        <label htmlFor="{reference}">{label}</label>
        <input type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        id={reference}
        
        />
      
    </div>
  )
}
