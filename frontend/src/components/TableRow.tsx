import React, { useState } from 'react';
import { EditableInclusion, Inclusion, ValidationErrors } from '../types';
import { validateInclusion } from '../utils/validation';
import ValidationMessage from './ValidationMessage';
import { Save, X, Edit2, Trash2 } from 'lucide-react';

interface TableRowProps {
  item: EditableInclusion;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onSave: (id: string, updatedItem: Inclusion) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const TableRow = ({
  item,
  isSelected,
  onSelect,
  onSave,
  onCancel,
  onDelete,
  onEdit
}: TableRowProps) => {
  const [editForm, setEditForm] = useState<Partial<Inclusion>>({
    name: item.name,
    radius: item.radius,
    type: item.type
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleInputChange = (field: keyof Inclusion, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    const validationErrors = validateInclusion(editForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave(item.id, {
      id: item.id,
      parent_id: item.parent_id,
      name: editForm.name || '',
      radius: editForm.radius || 0,
      type: editForm.type as any || 'bubble'
    });
    setErrors({});
  };

  const handleCancel = () => {
    setEditForm({
      name: item.originalData?.name || item.name,
      radius: item.originalData?.radius || item.radius,
      type: item.originalData?.type || item.type
    });
    setErrors({});
    onCancel(item.id);
  };

  if (item.isEditing) {
    return (
      <tr style={{ backgroundColor: isSelected ? '#f0f8ff' : 'white' }}>
        <td style={styles.cell}>
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            style={styles.input}
          />
          <ValidationMessage message={errors.name} />
        </td>
        <td style={styles.cell}>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={editForm.radius}
            onChange={(e) => handleInputChange('radius', e.target.value)}
            style={styles.input}
          />
          <ValidationMessage message={errors.radius} />
        </td>
        <td style={styles.cell}>
          <select
            value={editForm.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            style={styles.select}
          >
            <option value="bubble">Bubble</option>
            <option value="crack">Crack</option>
            <option value="scratch">Scratch</option>
          </select>
          <ValidationMessage message={errors.type} />
        </td>
        <td style={styles.cell}>
          <div style={styles.actions}>
            <button onClick={handleSave} style={styles.iconButton} title="Save">
              <Save size={16} color="#28a745" />
            </button>
            <button onClick={handleCancel} style={styles.iconButton} title="Cancel">
              <X size={16} color="#dc3545" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      onClick={() => onSelect(item.id)}
      style={{
        backgroundColor: isSelected ? '#f0f8ff' : 'white',
        cursor: 'pointer'
      }}
    >
      <td style={styles.cell}>{item.name}</td>
      <td style={styles.cell}>{item.radius}</td>
      <td style={styles.cell}>{item.type}</td>
      <td style={styles.cell}>
        <div style={styles.actions}>
          <button onClick={() => onEdit(item.id)} style={styles.iconButton} title="Edit">
            <Edit2 size={16} color="#007bff" />
          </button>
          <button onClick={() => onDelete(item.id)} style={styles.iconButton} title="Delete">
            <Trash2 size={16} color="#dc3545" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const styles = {
  cell: {
    padding: '8px',
    borderBottom: '1px solid #ddd'
  },
  input: {
    width: '100%',
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  select: {
    width: '100%',
    padding: '4px',
    border: '1px solid #ccc',
    borderRadius: '4px'
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  iconButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  }
};

export default TableRow;