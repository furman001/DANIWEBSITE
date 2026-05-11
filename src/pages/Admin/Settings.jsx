import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    panel_name: 'DM Social Panel',
    support_email: 'support@dmsocialpanel.com',
    support_whatsapp: '+92 333 3945955',
    min_deposit: '100',
    announcement: '',
  });

  const handleSave = () => {
    // Settings are stored locally (can be extended to use an entity)
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    toast.success('Settings saved');
  };

  return (
    <div className="max-w-2xl">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-heading flex items-center gap-2 text-lg">
            <Settings className="w-5 h-5 text-primary" />
            Panel Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {[
            ['Panel Name', 'panel_name', 'text'],
            ['Support Email', 'support_email', 'email'],
            ['Support WhatsApp', 'support_whatsapp', 'text'],
            ['Minimum Deposit (PKR)', 'min_deposit', 'number'],
          ].map(([label, key, type]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                type={type}
                value={settings[key]}
                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          ))}
          <div className="space-y-1.5">
            <Label>Announcement / Notice</Label>
            <Textarea
              value={settings.announcement}
              onChange={e => setSettings(s => ({ ...s, announcement: e.target.value }))}
              placeholder="Optional message shown to users..."
              className="rounded-xl"
              rows={3}
            />
          </div>
          <Button onClick={handleSave} className="w-full rounded-xl">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}