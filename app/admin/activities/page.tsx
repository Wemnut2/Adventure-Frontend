// src/app/admin/activities/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/layout/components/Card';
import { Input } from '@/layout/components/Input';
import { Button } from '@/layout/components/Button';
import { adminService } from '@/libs/services/admin.service';
import { formatDateTime } from '@/libs/utils/format';
import {
  Search,
  Filter,
  Download,
  RefreshCw,
  Activity,
  User,
  DollarSign,
  CheckSquare,
  Award,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface Activity {
  action: string;
  user_email?: string;
  details?: string;
  created_at: string;
  ip_address?: string;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await adminService.getRecentActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (action: string) => {
    if (action.includes('login')) return <User className="h-4 w-4 text-blue-500" />;
    if (action.includes('investment')) return <DollarSign className="h-4 w-4 text-green-500" />;
    if (action.includes('task')) return <CheckSquare className="h-4 w-4 text-purple-500" />;
    if (action.includes('challenge')) return <Award className="h-4 w-4 text-orange-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const filteredActivities = activities.filter((activity: Activity) =>
    activity.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.user_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Activity Log</h1>
          <p className="mt-1 text-gray-600">Track all user and system activities</p>
        </div>
        <Button variant="outline" onClick={fetchActivities} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        >
          <option value="all">All Activities</option>
          <option value="auth">Authentication</option>
          <option value="investment">Investments</option>
          <option value="task">Tasks</option>
          <option value="challenge">Challenges</option>
        </select>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity: Activity, index: number) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    {getActivityIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        {activity.details && (
                          <p className="text-sm text-gray-500">{activity.details}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">
                        {formatDateTime(activity.created_at)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {activity.user_email || 'System'}
                      </span>
                      {activity.ip_address && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          IP: {activity.ip_address}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No activities found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}