import { useState, useEffect } from 'react';
import { callLogService } from './supabase-service';

export interface CallLog {
    id: string;
    agentId: string;
    agentName?: string;
    phoneNumber: string;
    duration: number;
    status: 'completed' | 'failed' | 'missed';
    transcript?: string;
    createdAt: string;
    type: 'inbound' | 'outbound';
}

export function useCallLogs(agentId?: string) {
    const [callLogs, setCallLogs] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (agentId) {
            loadCallLogs(agentId);
        } else {
            setLoading(false);
        }
    }, [agentId]);

    const loadCallLogs = async (agentId: string) => {
        try {
            setLoading(true);
            const logs = await callLogService.getCallLogs(agentId);
            setCallLogs(logs.map(log => ({
                ...log,
                type: 'outbound' as const // Default to outbound for now
            })));
        } catch (error) {
            console.error('Failed to load call logs:', error);
            setCallLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const addCallLog = async (log: Omit<CallLog, 'id' | 'createdAt'>) => {
        try {
            const newLog = await callLogService.createCallLog({
                agentId: log.agentId,
                phoneNumber: log.phoneNumber,
                duration: log.duration,
                status: log.status,
                transcript: log.transcript
            });

            if (newLog && newLog.length > 0) {
                setCallLogs(prev => [{ ...newLog[0], type: 'outbound' }, ...prev]);
            }
        } catch (error) {
            console.error('Failed to add call log:', error);
        }
    };

    return { callLogs, loading, addCallLog, refreshLogs: () => agentId && loadCallLogs(agentId) };
}
