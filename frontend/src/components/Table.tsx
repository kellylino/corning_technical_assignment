import React, { useState } from 'react';
import { Inclusion, EditableInclusion } from '../types';
import TableRow from './TableRow';
import AddRowForm from './AddRowForm';
import { v4 as uuidv4 } from 'uuid';

type SortField = 'name' | 'radius' | 'type';
type SortDirection = 'asc' | 'desc';

interface TableProps {
  initialData: Inclusion[];
}

const Table = ({ initialData }: TableProps) => {
  const [items, setItems] = useState<EditableInclusion[]>(
    initialData.map(item => ({ ...item, isEditing: false }))
  );
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'radius':
        comparison = a.radius - b.radius;
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handleSelect = (id: string) => {
    setSelectedRowId(id);
  };

  const handleEdit = (id: string) => {
    const itemToEdit = items.find(item => item.id === id);
    if (!itemToEdit) return;

    setItems(items.map(item =>
      item.id === id
        ? {
            ...item,
            isEditing: true,
            originalData: { ...item }
          }
        : item
    ));
  };

  const handleSave = (id: string, updatedItem: Inclusion) => {
    setItems(items.map(item =>
      item.id === id
        ? { ...updatedItem, isEditing: false, originalData: undefined }
        : item
    ));
  };

  const handleCancel = (id: string) => {
    setItems(items.map(item =>
      item.id === id && item.originalData
        ? { ...item.originalData, isEditing: false, originalData: undefined }
        : item
    ));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
      if (selectedRowId === id) {
        setSelectedRowId(null);
      }
    }
  };

  const handleAdd = (newItem: Omit<Inclusion, 'id'>) => {
    const itemWithId: EditableInclusion = {
      id: uuidv4(),
      ...newItem,
      isEditing: false
    };
    setItems([...items, itemWithId]);
  };

  return (
    <div style={styles.container}>
      <h2>Corning Data Table Assignment</h2>

      <div style={styles.sortInfo}>
        Sorted by: {sortField} {sortDirection === 'asc' ? '↑' : '↓'}
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th
              style={styles.headerCell}
              onClick={() => handleSort('name')}
            >
              <span style={styles.headerContent}>
                Name {getSortIcon('name')}
              </span>
            </th>
            <th
              style={styles.headerCell}
              onClick={() => handleSort('radius')}
            >
              <span style={styles.headerContent}>
                Radius {getSortIcon('radius')}
              </span>
            </th>
            <th
              style={styles.headerCell}
              onClick={() => handleSort('type')}
            >
              <span style={styles.headerContent}>
                Type {getSortIcon('type')}
              </span>
            </th>
            <th style={styles.headerCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map(item => (
            <TableRow
              key={item.id}
              item={item}
              isSelected={selectedRowId === item.id}
              onSelect={handleSelect}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </tbody>
      </table>

      {sortedItems.length === 0 && (
        <div style={styles.emptyState}>
          No items to display
        </div>
      )}

      <AddRowForm onAdd={handleAdd} />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sortInfo: {
    marginBottom: '10px',
    color: '#666',
    fontSize: '0.9em'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    border: '1px solid #ddd'
  },
  headerRow: {
    backgroundColor: '#f2f2f2'
  },
  headerCell: {
    padding: '12px',
    textAlign: 'left' as const,
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    cursor: 'pointer',
    userSelect: 'none' as const
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  emptyState: {
    padding: '20px',
    textAlign: 'center' as const,
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '4px',
    marginTop: '10px',
    color: '#666'
  }
};

export default Table;