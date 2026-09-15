import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', educationLevel: '', fieldOfStudy: '', skillLevel: 'BEGINNER' });
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (user) setForm({ name: user.name, educationLevel: user.educationLevel || '', fieldOfStudy: user.fieldOfStudy || '', skillLevel: user.skillLevel }); }, [user]);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error('Name is required');
    try { setSaving(true); const response = await authService.updateProfile(form); updateUser(response.data); toast.success('Profile updated'); }
    catch { toast.error('Could not update your profile'); }
    finally { setSaving(false); }
  };
  return <div className="max-w-2xl"><h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1><p className="text-gray-600 mb-6">Keep your learning details up to date.</p><form onSubmit={save} className="card p-6 space-y-5"><div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label><input className="input bg-gray-50" value={user?.email || ''} disabled /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-700 mb-1">Education level</label><input className="input" value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value })} /></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Field of study</label><input className="input" value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} /></div></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Skill level</label><select className="input" value={form.skillLevel} onChange={(e) => setForm({ ...form, skillLevel: e.target.value })}><option value="BEGINNER">Beginner</option><option value="INTERMEDIATE">Intermediate</option><option value="ADVANCED">Advanced</option></select></div><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button></form></div>;
};

export default ProfilePage;
