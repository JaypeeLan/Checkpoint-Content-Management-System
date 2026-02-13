import React, { useEffect, useState } from 'react';
import { Alert, Card, CardContent, CircularProgress, Grid2, Stack, Typography } from '@mui/material';
import { io } from 'socket.io-client';
import { api } from '../api/client';
import { validateFrontendEnv } from '../env';
import type { AnalyticsSummary } from '../types/analytics';
import { getApiErrorMessage } from '../utils/apiError';

const env = validateFrontendEnv(import.meta.env as Record<string, string | undefined>);

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState('');
  const [realtime, setRealtime] = useState<string>('Waiting for socket event...');
  const [socketError, setSocketError] = useState('');

  useEffect(() => {
    setLoadingSummary(true);
    setSummaryError('');

    api
      .get('/analytics/summary')
      .then((res) => setSummary(res.data.data))
      .catch((error) => {
        setSummary(null);
        setSummaryError(getApiErrorMessage(error, 'Failed to load dashboard analytics.'));
      })
      .finally(() => setLoadingSummary(false));
  }, []);

  useEffect(() => {
    const socket = io(env.VITE_SOCKET_URL);

    socket.on('connect_error', () => {
      setSocketError('Realtime connection unavailable.');
    });

    socket.emit('ping:dashboard');
    socket.on('pong:dashboard', (payload) => {
      setRealtime(`Socket connected at ${payload.at}`);
      setSocketError('');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Stack spacing={2}>
      {summaryError ? <Alert severity="error">{summaryError}</Alert> : null}
      {socketError ? <Alert severity="warning">{socketError}</Alert> : null}

      {loadingSummary ? (
        <Stack direction="row" alignItems="center" gap={1}>
          <CircularProgress size={18} />
          <Typography variant="body2">Loading dashboard...</Typography>
        </Stack>
      ) : null}

      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card><CardContent><Typography variant="h6">Total Requests</Typography><Typography>{summary?.totalRequests ?? 0}</Typography></CardContent></Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card><CardContent><Typography variant="h6">Media Upload Requests</Typography><Typography>{summary?.mediaUploadsRequested ?? 0}</Typography></CardContent></Card>
        </Grid2>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card><CardContent><Typography variant="h6">Search Requests</Typography><Typography>{summary?.searchRequests ?? 0}</Typography></CardContent></Card>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <Card><CardContent><Typography variant="body1">{realtime}</Typography></CardContent></Card>
        </Grid2>
      </Grid2>
    </Stack>
  );
}