import React, { useState, useEffect } from 'react';

function Filter({ fields, onFilterChange, clearFilter }) {
  const [selectedField, setSelectedField] = useState('');
  const [fieldValue, setFieldValue] = useState('');


  const handleFieldChange = (field) => {
    setSelectedField(field);
    console.log('Выбран фильтр ', field);

    setFieldValue('');
  };

  const handleValueChange = (value) => {
    setFieldValue(value);
    console.log('Значение фильтра ', value);
  };

  const handleFilter = () => {
    onFilterChange(selectedField, fieldValue);
  };
  const onClearFilter = () => {
    setSelectedField('');
    setFieldValue('');

    clearFilter();
  };

  return (
    <div className="w-3/12 mb-5 filter-container">
      <h2 className=' text-2xl mb-8'>Фильтры</h2>
      <div className=' flex flex-wrap items-center gap-4 mb-5'>
        <label htmlFor="field">Выберите поле для фильтрации:</label>
        <select className="px-5 py-2 border border-solid border-slate-600 rounded" id="field" onChange={(e) => handleFieldChange(e.target.value)} value={selectedField}>
          <option value="" disabled>
            Выберите поле
          </option>
          {fields.map((field, index) => (
            <option key={index} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      {selectedField && (
        <div className=' flex flex-wrap gap-4 mb-5'>
          <label htmlFor="value">Введите значение для фильтрации:</label>
          <input
            className="px-5 py-2 border border-solid border-slate-600 rounded"
            type="text"
            id="value"
            value={fieldValue}
            onChange={(e) => handleValueChange(e.target.value)}
          />

          <button onClick={handleFilter} className="bg-indigo-800 px-5 py-2 rounded text-white">Применить фильтр</button>

          <button onClick={onClearFilter} className="bg-slate-500 px-5 py-2 rounded text-white">Очистить фильтры</button>
        </div>
      )}
    </div>
  );
}

export default Filter;