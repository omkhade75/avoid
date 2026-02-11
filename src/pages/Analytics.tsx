
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Analytics = () => {
    const { agents } = useAuth();

    // Mock Data
    const callsData = [
        { day: "Mon", calls: 120 },
        { day: "Tue", calls: 145 },
        { day: "Wed", calls: 132 },
        { day: "Thu", calls: 198 },
        { day: "Fri", calls: 210 },
        { day: "Sat", calls: 85 },
        { day: "Sun", calls: 45 },
    ];

    const sentimentData = [
        { name: "Positive", value: 65, color: "#10b981" },
        { name: "Neutral", value: 25, color: "#cbd5e1" },
        { name: "Negative", value: 10, color: "#ef4444" },
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">
                            Performance <span className="text-gradient-neon">Analytics</span>
                        </h1>
                        <p className="mt-1 text-muted-foreground font-body">Deep insights into agent interactions and outcomes.</p>
                    </div>
                    <div>
                        <Select defaultValue="7days">
                            <SelectTrigger className="w-[180px] bg-secondary/30 border-white/10">
                                <SelectValue placeholder="Time Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="7days">Last 7 Days</SelectItem>
                                <SelectItem value="30days">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Conversations", value: "2,845", change: "+12.5%", color: "primary" },
                        { label: "Phone Minutes Used", value: "14,320", change: "+8.2%", color: "blue-500" },
                        { label: "Avg Handle Time", value: "3m 12s", change: "-4.1%", color: "green-500" },
                        { label: "Success Rate", value: "68%", change: "+2.3%", color: "purple-500" },
                    ].map((stat) => (
                        <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-5 rounded-2xl">
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                            <div className={`mt-2 text-3xl font-bold text-${stat.color}`}>{stat.value}</div>
                            <div className="mt-1 text-xs text-green-500">{stat.change} vs last period</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart 1: Call Volume */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 glass-card rounded-2xl p-6">
                        <h3 className="mb-6 text-lg font-semibold">Interaction Volume</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={callsData}>
                                    <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                        cursor={{ fill: '#334155', opacity: 0.4 }}
                                    />
                                    <Bar dataKey="calls" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Chart 2: Sentiment Sentiment */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
                        <h3 className="mb-6 text-lg font-semibold">User Sentiment</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sentimentData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {sentimentData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-center gap-4">
                            {sentimentData.map(d => (
                                <div key={d.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
                                    <span className="text-xs text-muted-foreground">{d.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
