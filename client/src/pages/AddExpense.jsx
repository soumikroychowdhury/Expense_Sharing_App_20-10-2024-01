import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddExpense = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    splitMethod: 'equal',
    participants: [],
  });

  const { description, amount, splitMethod, participants } = formData;

  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch users to select participants
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        alert('Failed to fetch users');
      }
    };
    fetchUsers();
  }, [token]);

  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value });

  const onParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participants: [...participants, { user: '', amount: '', percentage: '' }],
    });
  };

  const removeParticipant = (index) => {
    const updatedParticipants = [...participants];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participants: updatedParticipants });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/expenses', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Expense added successfully');
      // Redirect or reset form
    } catch (error) {
      alert(error.response.data.message || 'Failed to add expense');
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      <form onSubmit={onSubmit}>
        <input 
          name="description" 
          value={description} 
          onChange={onChange} 
          placeholder="Description" 
          required 
        />
        <input 
          type="number" 
          name="amount" 
          value={amount} 
          onChange={onChange} 
          placeholder="Amount" 
          required 
        />
        <select name="splitMethod" value={splitMethod} onChange={onChange}>
          <option value="equal">Equal</option>
          <option value="exact">Exact</option>
          <option value="percentage">Percentage</option>
        </select>
        
        <h3>Participants</h3>
        {participants.map((participant, index) => (
          <div key={index}>
            <select 
              value={participant.user} 
              onChange={(e) => onParticipantChange(index, 'user', e.target.value)} 
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>{user.name}</option>
              ))}
            </select>
            {splitMethod === 'exact' && (
              <input 
                type="number" 
                placeholder="Amount" 
                value={participant.amount} 
                onChange={(e) => onParticipantChange(index, 'amount', e.target.value)} 
                required 
              />
            )}
            {splitMethod === 'percentage' && (
              <input 
                type="number" 
                placeholder="Percentage" 
                value={participant.percentage} 
                onChange={(e) => onParticipantChange(index, 'percentage', e.target.value)} 
                required 
              />
            )}
            <button type="button" onClick={() => removeParticipant(index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={addParticipant}>Add Participant</button>
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default AddExpense;
