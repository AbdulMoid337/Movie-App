import React, { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/solid'

const DropDown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleToggle = () => setIsOpen(!isOpen)

  const handleOptionClick = (optionValue) => {
    onChange({ target: { value: optionValue } })
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="bg-gray-800 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center justify-between min-w-[120px]"
      >
        <span>{selectedOption ? selectedOption.label : 'Select'}</span>
        <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-gray-700 rounded-lg shadow-lg overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-600 transition-colors duration-150"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropDown
