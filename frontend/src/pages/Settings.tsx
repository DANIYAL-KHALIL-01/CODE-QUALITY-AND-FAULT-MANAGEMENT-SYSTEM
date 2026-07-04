import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Loader2, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useSettings } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { api } from '../lib/api';

interface SettingsState {
  githubToken: string;
  gitlabToken: string;
  webhookUrl: string;
  emailNotifications: boolean;
  highRiskAlerts: boolean;
  weeklySummary: boolean;
  slackWebhook: string;
  complexityThreshold: number;
  churnThreshold: number;
  complexityWeight: number;
  bugHistoryWeight: number;
  fullName: string;
  email: string;
  organization: string;
}

export default function Settings() {
  const { settings, loading, fetchSettings, updateSettings } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<SettingsState>({
    githubToken: '',
    gitlabToken: '',
    webhookUrl: '',
    emailNotifications: false,
    highRiskAlerts: true,
    weeklySummary: true,
    slackWebhook: '',
    complexityThreshold: 30,
    churnThreshold: 0.5,
    complexityWeight: 0.4,
    bugHistoryWeight: 0.3,
    fullName: '',
    email: '',
    organization: '',
  });
  
  const [saving, setSaving] = useState(false);
  const [showGithubToken, setShowGithubToken] = useState(false);
  const [showGitlabToken, setShowGitlabToken] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update form data when settings change
  useEffect(() => {
    if (settings) {
      setFormData({
        githubToken: settings.github_token || '',
        gitlabToken: settings.gitlab_token || '',
        webhookUrl: settings.webhook_url || '',
        emailNotifications: settings.email_notifications || false,
        highRiskAlerts: settings.high_risk_alerts !== undefined ? settings.high_risk_alerts : true,
        weeklySummary: settings.weekly_summary !== undefined ? settings.weekly_summary : true,
        slackWebhook: settings.slack_webhook || '',
        complexityThreshold: settings.complexity_threshold || 30,
        churnThreshold: settings.churn_threshold || 0.5,
        complexityWeight: settings.complexity_weight || 0.4,
        bugHistoryWeight: settings.bug_history_weight || 0.3,
        fullName: settings.full_name || '',
        email: settings.email || '',
        organization: settings.organization || '',
      });
    }
  }, [settings]);

  const handleSaveIntegration = async () => {
    setSaving(true);
    const result = await updateSettings({
      github_token: formData.githubToken,
      gitlab_token: formData.gitlabToken,
      webhook_url: formData.webhookUrl,
    });
    setSaving(false);
    
    if (result.success) {
      toast.success('Integration settings saved successfully');
      await fetchSettings();
    } else {
      toast.error(result.error || 'Failed to save settings');
    }
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    const result = await updateSettings({
      email_notifications: formData.emailNotifications,
      high_risk_alerts: formData.highRiskAlerts,
      weekly_summary: formData.weeklySummary,
      slack_webhook: formData.slackWebhook,
    });
    setSaving(false);
    
    if (result.success) {
      toast.success('Notification settings saved successfully');
      await fetchSettings();
    } else {
      toast.error(result.error || 'Failed to save settings');
    }
  };

  const handleSaveAnalysis = async () => {
    setSaving(true);
    const result = await updateSettings({
      complexity_threshold: formData.complexityThreshold,
      churn_threshold: formData.churnThreshold,
      complexity_weight: formData.complexityWeight,
      bug_history_weight: formData.bugHistoryWeight,
    });
    setSaving(false);
    
    if (result.success) {
      toast.success('Analysis configuration saved successfully');
      await fetchSettings();
    } else {
      toast.error(result.error || 'Failed to save settings');
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const result = await updateSettings({
      full_name: formData.fullName,
      email: formData.email,
      organization: formData.organization,
    });
    setSaving(false);
    
    if (result.success) {
      toast.success('Profile updated successfully');
      await fetchSettings();
    } else {
      toast.error(result.error || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const result = await api.deleteAccount() as any;
      
      if (result.error) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }
      
      toast.success('Account deleted successfully');
      await logout();
      navigate('/login');
    } catch (error) {
      toast.error('Failed to delete account');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-[#E6EDF3] mb-2">Settings</h1>
        <p className="text-[#8B949E]">Configure your application preferences</p>
      </div>

      {/* Integration Settings */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Integration Settings</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Configure third-party integrations. GitHub token is used for repository analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github-token" className="text-[#E6EDF3]">
              GitHub Personal Access Token
            </Label>
            <div className="relative">
              <Input
                id="github-token"
                type={showGithubToken ? "text" : "password"}
                placeholder="ghp_xxxxxxxxxxxx"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] pr-10"
                value={formData.githubToken}
                onChange={(e) => setFormData({ ...formData, githubToken: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowGithubToken(!showGithubToken)}
              >
                {showGithubToken ? (
                  <EyeOff className="h-4 w-4 text-[#8B949E]" />
                ) : (
                  <Eye className="h-4 w-4 text-[#8B949E]" />
                )}
              </Button>
            </div>
            <p className="text-xs text-[#8B949E]">
              This token will be used for all repository operations instead of the environment variable.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gitlab-token" className="text-[#E6EDF3]">
              GitLab Personal Access Token
            </Label>
            <div className="relative">
              <Input
                id="gitlab-token"
                type={showGitlabToken ? "text" : "password"}
                placeholder="glpat-xxxxxxxxxxxx"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3] pr-10"
                value={formData.gitlabToken}
                onChange={(e) => setFormData({ ...formData, gitlabToken: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowGitlabToken(!showGitlabToken)}
              >
                {showGitlabToken ? (
                  <EyeOff className="h-4 w-4 text-[#8B949E]" />
                ) : (
                  <Eye className="h-4 w-4 text-[#8B949E]" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-[#E6EDF3]">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              placeholder="https://your-domain.com/webhook"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
            />
          </div>
          <Button 
            className="bg-[#F97316] hover:bg-[#F97316]/90"
            onClick={handleSaveIntegration}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Integration Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Notification Preferences</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Choose how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#E6EDF3] font-medium">Email Notifications</p>
              <p className="text-sm text-[#8B949E]">Receive analysis reports via email</p>
            </div>
            <Switch 
              checked={formData.emailNotifications}
              onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            />
          </div>
          <Separator className="bg-[#30363D]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#E6EDF3] font-medium">High-Risk Alerts</p>
              <p className="text-sm text-[#8B949E]">Get notified when critical issues are detected</p>
            </div>
            <Switch 
              checked={formData.highRiskAlerts}
              onCheckedChange={(checked) => setFormData({ ...formData, highRiskAlerts: checked })}
            />
          </div>
          <Separator className="bg-[#30363D]" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#E6EDF3] font-medium">Weekly Summary</p>
              <p className="text-sm text-[#8B949E]">Receive weekly analysis summaries</p>
            </div>
            <Switch 
              checked={formData.weeklySummary}
              onCheckedChange={(checked) => setFormData({ ...formData, weeklySummary: checked })}
            />
          </div>
          <Separator className="bg-[#30363D]" />
          <div className="space-y-2">
            <Label htmlFor="slack-webhook" className="text-[#E6EDF3]">
              Slack Webhook URL (Optional)
            </Label>
            <Input
              id="slack-webhook"
              placeholder="https://hooks.slack.com/services/..."
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
              value={formData.slackWebhook}
              onChange={(e) => setFormData({ ...formData, slackWebhook: e.target.value })}
            />
          </div>
          <Button 
            className="bg-[#F97316] hover:bg-[#F97316]/90"
            onClick={handleSaveNotifications}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Configuration */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">Analysis Configuration</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Configure analysis thresholds and weights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="complexity-threshold" className="text-[#E6EDF3]">
                Complexity Threshold
              </Label>
              <Input
                id="complexity-threshold"
                type="number"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                value={formData.complexityThreshold}
                onChange={(e) => setFormData({ ...formData, complexityThreshold: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="churn-threshold" className="text-[#E6EDF3]">
                Churn Rate Threshold
              </Label>
              <Input
                id="churn-threshold"
                type="number"
                step="0.1"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                value={formData.churnThreshold}
                onChange={(e) => setFormData({ ...formData, churnThreshold: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="complexity-weight" className="text-[#E6EDF3]">
                Complexity Weight
              </Label>
              <Input
                id="complexity-weight"
                type="number"
                step="0.1"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                value={formData.complexityWeight}
                onChange={(e) => setFormData({ ...formData, complexityWeight: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bug-history-weight" className="text-[#E6EDF3]">
                Bug History Weight
              </Label>
              <Input
                id="bug-history-weight"
                type="number"
                step="0.1"
                className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
                value={formData.bugHistoryWeight}
                onChange={(e) => setFormData({ ...formData, bugHistoryWeight: Number(e.target.value) })}
              />
            </div>
          </div>
          <Button 
            className="bg-[#F97316] hover:bg-[#F97316]/90"
            onClick={handleSaveAnalysis}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Analysis Configuration
          </Button>
        </CardContent>
      </Card>

      {/* User Profile */}
      <Card className="bg-[#161B22] border-[#30363D]">
        <CardHeader>
          <CardTitle className="text-[#E6EDF3]">User Profile</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#E6EDF3]">
              Full Name
            </Label>
            <Input
              id="name"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#E6EDF3]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization" className="text-[#E6EDF3]">
              Organization
            </Label>
            <Input
              id="organization"
              className="bg-[#0D1117] border-[#30363D] text-[#E6EDF3]"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
            />
          </div>
          <Button 
            className="bg-[#F97316] hover:bg-[#F97316]/90"
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-[#161B22] border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription className="text-[#8B949E]">
            Irreversible actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-lg">
            <p className="text-[#E6EDF3] font-medium mb-2">Delete Account</p>
            <p className="text-[#8B949E] text-sm mb-4">
              This will permanently delete your account and all associated data including:
            </p>
            <ul className="text-[#8B949E] text-sm space-y-1 mb-4 ml-4">
              <li>• All repositories and analysis data</li>
              <li>• All settings and preferences</li>
              <li>• All bug reports and test cases</li>
              <li>• This action cannot be undone</li>
            </ul>
            <Button 
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account Permanently
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#161B22] border-[#30363D]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Delete Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#8B949E]">
              This action cannot be undone. This will permanently delete your account and remove all of your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-red-900/10 border border-red-900/20 rounded p-3 my-4">
            <p className="text-sm text-[#E6EDF3]">
              Click <span className="font-bold">DELETE</span> to confirm
            </p>
          </div>
          <div className="flex gap-4">
            <AlertDialogCancel className="bg-[#0D1117] hover:bg-[#161B22] text-[#E6EDF3] border-[#30363D]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Delete Account
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}