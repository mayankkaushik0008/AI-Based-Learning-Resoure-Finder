import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const resourceTypes = ['VIDEO', 'ARTICLE', 'TUTORIAL', 'PAPER', 'GITHUB', 'DOCUMENTATION', 'COURSE'];
const SettingsPage = () => {
  const { user, updateUser } = useAuthStore();
  const [interests, setInterests] = useState('');
  const [preferredResources, setPreferredResources] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (user) { setInterests(user.interests.join(', ')); setPreferredResources(user.preferredResources); } }, [user]);
  const toggleType = (type: string) => setPreferredResources((types) => types.includes(type) ? types.filter((item) => item !== type) : [...types, type]);
  const save = async (event: FormEvent) => {
    event.preventDefault();
    try { setSaving(true); const response = await authService.updateProfile({ interests: interests.split(',').map((item) => item.trim()).filter(Boolean), preferredResources }); updateUser(response.data); toast.success('Learning preferences updated'); }
    catch { toast.error('Could not update preferences'); }
    finally { setSaving(false); }
  };
  return <div className="max-w-2xl"><h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1><p className="text-gray-600 mb-6">Personalize the resources shown to you.</p><form onSubmit={save} className="card p-6 space-y-6"><div><label className="block text-sm font-medium text-gray-700 mb-1">Interests</label><input className="input" value={interests} onChange={(e) => setInterests(e.target.value)} placeholder="e.g. web development, data science" /><p className="text-xs text-gray-500 mt-1">Separate interests with commas.</p></div><fieldset><legend className="text-sm font-medium text-gray-700 mb-3">Preferred resource types</legend><div className="grid grid-cols-2 md:grid-cols-3 gap-3">{resourceTypes.map((type) => <label key={type} className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={preferredResources.includes(type)} onChange={() => toggleType(type)} />{type}</label>)}</div></fieldset><button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button></form></div>;
};

export default SettingsPage;
