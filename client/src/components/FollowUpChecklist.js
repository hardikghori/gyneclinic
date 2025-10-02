// src/components/FollowUpChecklist.js
import React, { useState, useEffect } from 'react';
import { addFollowUp, getFollowUpsByPatient, toggleFollowUpDone } from '../firebase/followups';

const FollowUpChecklist = ({ patientId }) => {
  const [followUps, setFollowUps] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowUps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFollowUpsByPatient(patientId);
      setFollowUps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchFollowUps();
    }
  }, [patientId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      await addFollowUp({ patientId, task: newTask.trim(), done: false });
      setNewTask('');
      fetchFollowUps();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleDone = async (id, done) => {
    try {
      await toggleFollowUpDone(id, !done);
      fetchFollowUps();
    } catch (err) {
      alert(err.message);
    }
  };

  if (!patientId) return <p>Select a patient to see follow-ups.</p>;
  if (loading) return <p>Loading follow-ups...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h3>Follow-up Checklist</h3>
      <form onSubmit={handleAdd}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add new follow-up task"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {followUps.length === 0 && <li>No follow-ups yet.</li>}
        {followUps.map(fu => (
          <li key={fu.id}>
            <label>
              <input
                type="checkbox"
                checked={fu.done}
                onChange={() => handleToggleDone(fu.id, fu.done)}
              />
              {fu.task}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FollowUpChecklist;
