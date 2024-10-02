import React from 'react'

const DropDown = ({ value, onChange, options, label, scrollable = false }) => {
  return (
    <div className="relative">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`
          block w-full bg-gray-800 text-white border border-gray-700 rounded-md py-2 px-3 
          focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500
          ${scrollable ? 'scrollable-select' : ''}
        `}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DropDown
