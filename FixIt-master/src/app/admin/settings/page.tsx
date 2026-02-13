"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSettingsPage() {
  return (
    <div>
      <Card className="glass-panel-lg">
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Placeholder settings page. Configure system preferences and integrations here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
