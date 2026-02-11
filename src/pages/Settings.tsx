
import { motion } from "framer-motion";
import { User, Bell, Key, Shield, Smartphone, Mail, Save } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Settings = () => {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        notifications: user?.preferences?.notifications ?? true,
        marketing: user?.preferences?.marketing ?? false,
        apiKey: "sk-proj-**********************",
    });

    const handleSave = () => {
        updateUser({
            name: formData.name,
            email: formData.email,
            preferences: {
                notifications: formData.notifications,
                marketing: formData.marketing
            }
        });

        toast({
            title: "Settings Saved",
            description: "Your preferences have been updated successfully.",
        });
    };

    return (
        <DashboardLayout>
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-bold text-foreground">
                        Account <span className="text-gradient-neon">Settings</span>
                    </h1>
                    <p className="mt-1 text-muted-foreground font-body">Manage your profile, security, and preferences.</p>
                </motion.div>

                {/* Profile Section */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Profile Information</h2>
                            <p className="text-sm text-muted-foreground">Update your personal details.</p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="pl-10 bg-secondary/30 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="pl-10 bg-secondary/30 border-white/10"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Bell className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                            <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Smartphone className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">App Notifications</p>
                                    <p className="text-xs text-muted-foreground">Get push notifications for agent activity.</p>
                                </div>
                            </div>
                            <Switch checked={formData.notifications} onCheckedChange={(c) => setFormData({ ...formData, notifications: c })} />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium text-foreground">Marketing Emails</p>
                                    <p className="text-xs text-muted-foreground">Receive news about new features and updates.</p>
                                </div>
                            </div>
                            <Switch checked={formData.marketing} onCheckedChange={(c) => setFormData({ ...formData, marketing: c })} />
                        </div>
                    </div>
                </motion.div>

                {/* Security / API */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Shield className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Security & API</h2>
                            <p className="text-sm text-muted-foreground">Manage your keys and passwords.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">OpenAI API Key (Default)</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={formData.apiKey}
                                    disabled
                                    type="password"
                                    className="pl-10 bg-secondary/30 border-white/10 text-muted-foreground"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">Managed via environment variables.</p>
                        </div>
                    </div>
                </motion.div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
