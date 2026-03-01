import React, { useState } from 'react';
import { Inclusion, ValidationErrors } from '../types';
import { validateInclusion } from '../utils/validation';
import ValidationMessage from './ValidationMessage';
import { Plus } from 'lucide-react';

interface AddRowFormProps {
  onAdd: (newItem: Omit<Inclusion, 'id'>) => void;
}

const AddRowForm = ({ onAdd }: AddRowFormProps) => {
  const [formData, setFormData] = useState({
    parent_id: '',
    name: '',
    radius: '',
    type: 'bubble' as const
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'radius') {
      if (value === '') {
        setErrors(prev => ({ ...prev, radius: undefined }));
        return;
      }

      const decimalCount = (value.match(/\./g) || []).length;
      if (decimalCount > 1) {
        setErrors(prev => ({ ...prev, radius: 'Invalid number format' }));
        return;
      }

      if (value.endsWith('.')) {
        setErrors(prev => ({ ...prev, radius: 'Please enter digits after decimal point' }));
        return;
      }

      if (!/^\d+(\.\d*)?$/.test(value)) {
        setErrors(prev => ({ ...prev, radius: 'Please enter a valid number' }));
        return;
      }

      setErrors(prev => ({ ...prev, radius: undefined }));
      return;
    }
    else if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validateInclusion({
      name: formData.name,
      radius: formData.radius ? parseFloat(formData.radius) : undefined,
      type: formData.type
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onAdd({
      parent_id: formData.parent_id || 'default-parent',
      name: formData.name,
      radius: parseFloat(formData.radius),
      type: formData.type
    });

    // Reset form
    setFormData({
      parent_id: '',
      name: '',
      radius: '',
      type: 'bubble'
    });
    setErrors({});
  };

  return (
    <div style={styles.container}>
      <h3>Add New Item</h3>
      <div style={styles.form}>
        <div style={styles.field}>
          <input
            type="text"
            placeholder="Parent ID"
            value={formData.parent_id}
            onChange={(e) => handleInputChange('parent_id', e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.field}>
          <input
            type="text"
            placeholder="Name *"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={{...styles.input, borderColor: errors.name ? '#dc3545' : '#ccc'}}
          />
          <ValidationMessage message={errors.name} />
        </div>
        <div style={styles.field}>
          <input
            type="text"
            // step="0.1"
            // min="0.1"
            placeholder="Radius *"
            value={formData.radius}
            onChange={(e) => handleInputChange('radius', e.target.value)}
            style={{...styles.input, borderColor: errors.radius ? '#dc3545' : '#ccc'}}
          />
          <ValidationMessage message={errors.radius} />
        </div>
        <div style={styles.field}>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            style={{...styles.select, borderColor: errors.type ? '#dc3545' : '#ccc'}}
          >
            <option value="bubble">Bubble</option>
            <option value="crack">Crack</option>
            <option value="scratch">Scratch</option>
          </select>
          <ValidationMessage message={errors.type} />
        </div>
        <button onClick={handleSubmit} style={styles.addButton}>
          <Plus size={16} />
          Add Item
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9'
  },
  form: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-start'
  },
  field: {
    flex: '1 1 150px'
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    whiteSpace: 'nowrap' as const
  }
};

export default AddRowForm;