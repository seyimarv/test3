import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Settings, User, Bell, Palette, Database, Download, Upload, Trash2 } from 'lucide-react';

export function SettingsPage() {
  const [userName, setUserName] = useState(localStorage.getItem('taskstream-username') || 'User');
  const [theme, setTheme] = useState(localStorage.getItem('taskstream-theme') || 'light');
  const [notifications, setNotifications] = useState(localStorage.getItem('taskstream-notifications') === 'true');
  const [autoArchive, setAutoArchive] = useState(localStorage.getItem('taskstream-auto-archive') === 'true');

  const handleSaveSettings = () => {
    localStorage.setItem('taskstream-username', userName);
    localStorage.setItem('taskstream-theme', theme);
    localStorage.setItem('taskstream-notifications', notifications.toString());
    localStorage.setItem('taskstream-auto-archive', autoArchive.toString());
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const tasks = localStorage.getItem('taskstream-tasks') || '[]';
    const dataStr = JSON.stringify({ tasks: JSON.parse(tasks), settings: { userName, theme, notifications, autoArchive } }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `taskstream-backup-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.tasks) {
            localStorage.setItem('taskstream-tasks', JSON.stringify(data.tasks));
          }
          if (data.settings) {
            setUserName(data.settings.userName || 'User');
            setTheme(data.settings.theme || 'light');
            setNotifications(data.settings.notifications || false);
            setAutoArchive(data.settings.autoArchive || false);
          }
          alert('Data imported successfully! Please refresh the page.');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      alert('All data cleared! The page will reload.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your preferences and data</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
              <Input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark (Coming Soon)</option>
                <option value="auto">Auto (Coming Soon)</option>
              </Select>
              <p className="text-sm text-gray-500 mt-1">Choose your preferred color theme</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Enable notifications</p>
                <p className="text-sm text-gray-500">Get notified about task deadlines</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={autoArchive}
                onChange={(e) => setAutoArchive(e.target.checked)}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-archive completed tasks</p>
                <p className="text-sm text-gray-500">Automatically archive tasks after 30 days</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Data Management</h2>
          </div>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleExportData} variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button type="button" variant="outline" className="w-full" onClick={() => document.querySelector('input[type="file"]')?.click()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Data
                </Button>
              </label>
            </div>
            <Button onClick={handleClearAllData} variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
            <p className="text-sm text-gray-500">
              Export your data to back it up, or import from a previous backup. Clearing all data will remove all tasks and settings permanently.
            </p>
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
