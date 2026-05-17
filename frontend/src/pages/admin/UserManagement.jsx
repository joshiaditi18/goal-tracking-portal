import { useEffect, useState } from 'react';
import { createUser, listUsers, updateUser, deleteUser } from '../../api/admin.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner.jsx';

const initialForm = {
  name: '',
  email: '',
  role: 'employee',
  departmentId: '',
  managerId: '',
  phone: '',
  jobTitle: '',
  password: '',
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await listUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const resetForm = () => {
    setSelectedUser(null);
    setForm(initialForm);
    setNotification('');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelect = (user) => {
    setSelectedUser(user);
    setForm({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'employee',
      departmentId: user.departmentId || '',
      managerId: user.managerId || '',
      phone: user.phone || '',
      jobTitle: user.jobTitle || '',
      password: '',
    });
    setNotification('Editing selected user. Save to update or clear selection to add new.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (selectedUser) {
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        const updated = await updateUser(selectedUser._id, payload);
        setUsers((prev) => prev.map((user) => (user._id === updated._id ? updated : user)));
        setNotification('User updated successfully.');
      } else {
        const created = await createUser(form);
        setUsers((prev) => [created, ...prev]);
        setNotification('User created successfully.');
      }
      resetForm();
    } catch (error) {
      setNotification(error.response?.data?.message || 'Unable to save user.');
      console.error(error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user._id !== userId));
      if (selectedUser?._id === userId) resetForm();
      setNotification('User removed.');
    } catch (error) {
      setNotification(error.response?.data?.message || 'Unable to delete user.');
      console.error(error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Card title="User Management">
        <p className="text-sm text-slate-500 dark:text-slate-400">Create and manage employees, managers, and admin accounts.</p>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card title={selectedUser ? 'Edit User' : 'Create User'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Name</span>
                <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Email</span>
                <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Role</span>
                <select value={form.role} onChange={(e) => handleChange('role', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>User Password</span>
                <input value={form.password} onChange={(e) => handleChange('password', e.target.value)} type="password" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder={selectedUser ? 'Leave blank to keep current' : 'Set password'} />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Manager ID</span>
                <input value={form.managerId} onChange={(e) => handleChange('managerId', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Department ID</span>
                <input value={form.departmentId} onChange={(e) => handleChange('departmentId', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Job Title</span>
                <input value={form.jobTitle} onChange={(e) => handleChange('jobTitle', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
              <label className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                <span>Phone</span>
                <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit">{selectedUser ? 'Update User' : 'Create User'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Clear</Button>
            </div>
            {notification && <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notification}</p>}
          </form>
        </Card>

        <Card title="All Users">
          <div className="space-y-4">
            {users.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No users found.</p>
            ) : (
              users.map((user) => (
                <div key={user._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => handleSelect(user)}>Edit</Button>
                      <Button type="button" variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <span>Role: {user.role}</span>
                    <span>Job: {user.jobTitle || 'N/A'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
